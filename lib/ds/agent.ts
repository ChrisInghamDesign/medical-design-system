/**
 * The editor's Agent: Claude with tools that read and change the design system
 * through the same token store as the inspector, so locks, undo and the live
 * canvas all apply. Runs in the browser with the user's own Anthropic API key.
 */
import type Anthropic from "@anthropic-ai/sdk"

import { COMPONENT_CLASSES, slotVariantGroups } from "./classes"
import { contrastLevel, contrastRatio, parseColor } from "./color"
import { cloneTokens, getPath, isPathLocked, setPath } from "./store"
import { COLOR_GROUPS, CONTRAST_PAIRS, ICON_LIBRARY_IDS, normalizeTokens, type ComponentOverride, type DesignTokens, type Mode, type OverrideState } from "./types"

export const AGENT_MODELS = [
  { id: "claude-opus-5-5", name: "Claude Opus 5.5", note: "Most capable" },
  { id: "claude-sonnet-5-5", name: "Claude Sonnet 5.5", note: "Faster, lower cost" },
  { id: "claude-haiku-5-5", name: "Claude Haiku 5.5", note: "Fastest, lowest cost" },
] as const
export type AgentModel = (typeof AGENT_MODELS)[number]["id"]

/** Token sections the agent may change with update_tokens */
const EDITABLE_ROOTS = [
  "name",
  "description",
  "colors",
  "customColors",
  "fonts",
  "typeScale",
  "fontWeights",
  "tracking",
  "radius",
  "radiusSteps",
  "spacing",
  "shadows",
  "controls",
  "icons",
  "menu",
  "brand.logoHeight",
  "brand.markHeight",
  "brand.darkFallback",
]

const STATES: OverrideState[] = ["hover", "focus", "active", "disabled", "open"]

export interface AgentContext {
  getTokens: () => DesignTokens
  setTokens: (next: DesignTokens) => void
  navigate: (view: string) => void
  /** Component demos the editor knows (library + custom) */
  components: { id: string; name: string; custom: boolean }[]
  blocks: { id: string; name: string }[]
  foundations: { id: string; name: string }[]
}

export interface ToolOutcome {
  content: string
  isError?: boolean
  /** One line for the chat, e.g. "Changed 3 colours" */
  summary: string
}

export const AGENT_TOOLS: Anthropic.Tool[] = [
  {
    name: "get_design_system",
    description:
      "Read the current design system tokens (including unsaved edits). Pass a section to read only that part: colors, customColors, fonts, typeScale, fontWeights, tracking, radius, radiusSteps, spacing, shadows, controls, icons, brand, menu, overrides, locks. Without a section you get everything.",
    input_schema: {
      type: "object",
      properties: { section: { type: "string", description: "Top-level token section to read" } },
    },
  },
  {
    name: "update_tokens",
    description:
      "Change design tokens by path, all as one undoable step. Paths are dot-separated, e.g. colors.light.primary, colors.dark.primary-foreground, fonts.heading, radius, spacing, typeScale.base.size, shadows.light.md, icons.library, menu.accent. Colours are CSS colour strings, preferably oklch(L C H) like oklch(0.55 0.15 250). radius and spacing are rem numbers; typeScale sizes and line heights are px numbers; fonts are Google Fonts family names. Locked paths are refused. Changes are applied live; the user saves them to GitHub themselves.",
    input_schema: {
      type: "object",
      properties: {
        changes: {
          type: "array",
          description: "Token changes to apply",
          items: {
            type: "object",
            properties: {
              path: { type: "string" },
              value: { description: "New value (string, number, boolean, object or array, matching the existing value's type)" },
            },
            required: ["path", "value"],
          },
        },
      },
      required: ["changes"],
    },
  },
  {
    name: "set_component_style",
    description:
      "Restyle one part (slot) of a component for all its uses, optionally only for one variant, size or state. props maps CSS properties (kebab-case) to values; use the design system's variables wherever possible: var(--primary), var(--radius-lg), var(--shadow-sm), var(--text-sm), var(--font-weight-semibold). An empty string removes that property. Call list_components first to get component ids, slots and variants.",
    input_schema: {
      type: "object",
      properties: {
        component: { type: "string", description: "Component id, e.g. button" },
        slot: { type: "string", description: "Part (data-slot), e.g. button or card-header" },
        variant: { type: "string" },
        size: { type: "string" },
        state: { type: "string", enum: STATES },
        props: { type: "object", additionalProperties: { type: "string" } },
      },
      required: ["component", "slot", "props"],
    },
  },
  {
    name: "remove_component_styles",
    description: "Remove style changes made to a component (all of them, or only those on one slot).",
    input_schema: {
      type: "object",
      properties: { component: { type: "string" }, slot: { type: "string" } },
      required: ["component"],
    },
  },
  {
    name: "list_components",
    description: "List the components (library and custom), their parts (slots) and variant/size options, plus the blocks and foundation pages.",
    input_schema: { type: "object", properties: {} },
  },
  {
    name: "check_contrast",
    description: "Check WCAG contrast of the text/surface colour pairs in light and dark mode. Run it after changing colours.",
    input_schema: { type: "object", properties: {} },
  },
  {
    name: "show_page",
    description:
      "Show a page on the editor canvas so the user can see the result: overview, style, components, blocks, foundation:<id> (colors, typography, radius, shadows, spacing, controls, icons, brand), component:<id> or block:<id>.",
    input_schema: { type: "object", properties: { view: { type: "string" } }, required: ["view"] },
  },
]

export function agentSystemPrompt(): string {
  return `You are the design system agent inside a design system editor for a Next.js + shadcn/ui app (the "Medical" design system). The person you're talking to is a designer editing their design system; the canvas next to you shows the real components live.

What you can do: read and change the library-neutral design tokens (colours for light and dark mode, custom colours, fonts, type scale, weights, letter spacing, radius, spacing, shadows, control heights and focus, icon library and stroke, menu style) and restyle parts of components, using your tools. Every change applies live and is one undo step (⌘Z) for the user. Nothing is saved to GitHub until the user clicks Save.

How to work:
- Read before you change: call get_design_system (and list_components for component work) so changes fit what's there.
- Keep the system coherent. When you change a colour, change its foreground pair if contrast needs it, and do both light and dark mode unless asked otherwise. Run check_contrast after colour changes and fix failures that matter (text pairs below 4.5:1).
- Use tokens, not one-off values: component styles should reference variables like var(--primary) or var(--radius-lg).
- Never change locked values (listed under locks; a lock on typeScale also covers fontWeights and tracking, radius covers radiusSteps, overrides covers all component styles). If a request needs one, say it's locked and that the user can unlock it with the lock icon.
- After making changes, call show_page with the most relevant page so the user sees them.
- You can't edit code: you can't create components, blocks or files, or change the app's pages. For those, suggest the editor's "New component" button or doing it in code with Claude Code in this repo.
- Reply briefly in plain language: say what you changed and why, in a sentence or two. Don't paste token JSON unless asked.

Each user message starts with a line in square brackets describing what the editor is showing (page, selected part, light/dark). Use it to resolve "this", "here" and similar.`
}

/** "[Editor: …]" line prepended to each user message */
export function editorContextLine(view: string, viewName: string, mode: Mode, selection: { slot: string; variant?: string } | null) {
  return `[Editor: page "${viewName}" (${view}), ${mode} mode${selection ? `, selected part ${selection.slot}${selection.variant ? ` (variant ${selection.variant})` : ""}` : ""}]`
}

const isObject = (v: unknown): v is Record<string, unknown> => typeof v === "object" && v !== null && !Array.isArray(v)
const json = (v: unknown) => JSON.stringify(v, null, 1)

function validateValue(path: string, value: unknown, current: unknown): string | null {
  if (value === undefined || value === null) return "value is missing"
  if (/^colors\.(light|dark)\./.test(path) || /^customColors\.\d+\.(light|dark)$/.test(path)) {
    if (typeof value !== "string" || !parseColor(value)) return "not a CSS colour this editor can read (use oklch(L C H), hex or rgb)"
  }
  if (path === "icons.library" && !ICON_LIBRARY_IDS.includes(value as (typeof ICON_LIBRARY_IDS)[number])) return `icon library must be one of ${ICON_LIBRARY_IDS.join(", ")}`
  if (current !== undefined) {
    const kind = (v: unknown) => (Array.isArray(v) ? "array" : typeof v)
    if (kind(current) !== kind(value)) return `expected a ${kind(current)} like the current value`
  }
  if (typeof value === "number" && !Number.isFinite(value)) return "not a finite number"
  return null
}

function sameScope(o: ComponentOverride, s: { slot: string; variant?: string; size?: string; state?: string }) {
  return o.slot === s.slot && (o.variant ?? undefined) === s.variant && (o.size ?? undefined) === s.size && (o.state ?? undefined) === s.state
}

export function runAgentTool(name: string, rawInput: unknown, ctx: AgentContext): ToolOutcome {
  const input = isObject(rawInput) ? rawInput : {}
  const tokens = ctx.getTokens()
  const locks = tokens.locks ?? []
  try {
    switch (name) {
      case "get_design_system": {
        const t = normalizeTokens(tokens)
        const section = typeof input.section === "string" ? input.section : ""
        if (section) {
          const value = getPath(t, section)
          if (value === undefined) return { content: `No section called ${section}.`, isError: true, summary: `Couldn't read ${section}` }
          return { content: json({ [section]: value, locks }), summary: `Read ${section}` }
        }
        return { content: json(t), summary: "Read the design system" }
      }

      case "update_tokens": {
        const changes = Array.isArray(input.changes) ? input.changes : []
        if (!changes.length) return { content: "No changes given.", isError: true, summary: "No changes" }
        let next = cloneTokens(tokens)
        const applied: string[] = []
        const rejected: { path: string; reason: string }[] = []
        for (const c of changes) {
          const path = isObject(c) && typeof c.path === "string" ? c.path.trim() : ""
          const value = isObject(c) ? c.value : undefined
          if (!path) {
            rejected.push({ path: String(path), reason: "missing path" })
            continue
          }
          if (!EDITABLE_ROOTS.some((r) => path === r || path.startsWith(`${r}.`))) {
            rejected.push({ path, reason: "not an editable token (component styles go through set_component_style; lint rules and locks are changed by the user)" })
            continue
          }
          if (isPathLocked(locks, path)) {
            rejected.push({ path, reason: "locked" })
            continue
          }
          const problem = validateValue(path, value, getPath(normalizeTokens(next), path))
          if (problem) {
            rejected.push({ path, reason: problem })
            continue
          }
          // Create missing parents (older tokens.json files lack newer sections)
          const keys = path.split(".")
          let o = next as unknown as Record<string, unknown>
          for (const k of keys.slice(0, -1)) {
            if (o[k] == null || typeof o[k] !== "object") o[k] = /^\d+$/.test(k) ? [] : {}
            o = o[k] as Record<string, unknown>
          }
          next = setPath(next, path, value)
          applied.push(path)
        }
        if (applied.length) ctx.setTokens(next)
        const summary = applied.length
          ? `Changed ${applied.length} token${applied.length === 1 ? "" : "s"}${rejected.length ? `, ${rejected.length} refused` : ""}`
          : `Refused ${rejected.length} change${rejected.length === 1 ? "" : "s"}`
        return { content: json({ applied, rejected }), isError: !applied.length, summary }
      }

      case "set_component_style": {
        const component = String(input.component ?? "")
        const slot = String(input.slot ?? "")
        const c = COMPONENT_CLASSES[component]
        if (!c) return { content: `Unknown component ${component}. Call list_components.`, isError: true, summary: `Unknown component ${component}` }
        if (!(slot in c.slots)) return { content: `${component} has no slot ${slot}. Its slots: ${Object.keys(c.slots).join(", ")}`, isError: true, summary: `Unknown part ${slot}` }
        if (isPathLocked(locks, "overrides")) return { content: "Component styles are locked.", isError: true, summary: "Component styles are locked" }
        const state = typeof input.state === "string" && STATES.includes(input.state as OverrideState) ? (input.state as OverrideState) : undefined
        const scope = {
          slot,
          variant: typeof input.variant === "string" && input.variant && input.variant !== "default" ? input.variant : undefined,
          size: typeof input.size === "string" && input.size && input.size !== "default" ? input.size : undefined,
          state,
        }
        const props = isObject(input.props) ? input.props : {}
        const overrides = normalizeTokens(tokens).overrides ?? []
        const existing = overrides.find((o) => sameScope(o, scope))
        const merged: Record<string, string> = { ...(existing?.props ?? {}) }
        const bad: string[] = []
        for (const [prop, v] of Object.entries(props)) {
          if (!/^-?[a-z][a-z-]*$/.test(prop) || typeof v !== "string" || /[;{}<>]/.test(v)) {
            bad.push(prop)
            continue
          }
          if (v.trim() === "") delete merged[prop]
          else merged[prop] = v.trim()
        }
        const rest = overrides.filter((o) => !sameScope(o, scope))
        const nextOverrides: ComponentOverride[] = Object.keys(merged).length
          ? [...rest, { component, slot, ...(scope.variant ? { variant: scope.variant } : {}), ...(scope.size ? { size: scope.size } : {}), ...(scope.state ? { state: scope.state } : {}), props: merged }]
          : rest
        ctx.setTokens({ ...cloneTokens(tokens), overrides: nextOverrides })
        const where = [slot, scope.variant, scope.size, scope.state].filter(Boolean).join(" · ")
        return {
          content: json({ component, scope, props: merged, ignored: bad }),
          summary: `Restyled ${where}`,
        }
      }

      case "remove_component_styles": {
        const component = String(input.component ?? "")
        const slot = typeof input.slot === "string" && input.slot ? input.slot : undefined
        if (isPathLocked(locks, "overrides")) return { content: "Component styles are locked.", isError: true, summary: "Component styles are locked" }
        const overrides = normalizeTokens(tokens).overrides ?? []
        const ownSlots = Object.keys(COMPONENT_CLASSES[component]?.slots ?? {})
        const keep = overrides.filter((o) => !((o.component === component || ownSlots.includes(o.slot)) && (!slot || o.slot === slot)))
        const removed = overrides.length - keep.length
        if (removed) ctx.setTokens({ ...cloneTokens(tokens), overrides: keep })
        return { content: `Removed ${removed} style change${removed === 1 ? "" : "s"}.`, summary: `Removed ${removed} style change${removed === 1 ? "" : "s"} on ${slot ?? component}` }
      }

      case "list_components": {
        const components = ctx.components.map((d) => {
          const slots = Object.keys(COMPONENT_CLASSES[d.id]?.slots ?? {})
          const options = Object.fromEntries(
            slots.map((s) => [s, slotVariantGroups(s)] as const).filter(([, g]) => Object.keys(g).length)
          )
          return { id: d.id, name: d.name, ...(d.custom ? { custom: true } : {}), slots, ...(Object.keys(options).length ? { options } : {}) }
        })
        return {
          content: json({ components, blocks: ctx.blocks, foundations: ctx.foundations }),
          summary: `Listed ${components.length} components`,
        }
      }

      case "check_contrast": {
        const t = normalizeTokens(tokens)
        const rows: { mode: Mode; text: string; surface: string; ratio: number; level: string }[] = []
        for (const mode of ["light", "dark"] as Mode[]) {
          for (const [surface, text] of CONTRAST_PAIRS) {
            const ratio = contrastRatio(t.colors[mode][text], t.colors[mode][surface], t.colors[mode].background)
            if (ratio != null) rows.push({ mode, text, surface, ratio: Math.round(ratio * 100) / 100, level: contrastLevel(ratio) })
          }
        }
        rows.sort((a, b) => a.ratio - b.ratio)
        const failing = rows.filter((r) => r.ratio < 4.5)
        return {
          content: json({ failing, all: rows, groups: COLOR_GROUPS.map((g) => g.id) }),
          summary: failing.length ? `Contrast: ${failing.length} pair${failing.length === 1 ? "" : "s"} under 4.5:1` : "Contrast: all pairs pass",
        }
      }

      case "show_page": {
        const view = String(input.view ?? "")
        const ok =
          ["overview", "style", "components", "blocks"].includes(view) ||
          (view.startsWith("foundation:") && ctx.foundations.some((f) => `foundation:${f.id}` === view)) ||
          (view.startsWith("component:") && ctx.components.some((c) => `component:${c.id}` === view)) ||
          (view.startsWith("block:") && ctx.blocks.some((b) => `block:${b.id}` === view))
        if (!ok) return { content: `No page ${view}.`, isError: true, summary: `No page ${view}` }
        ctx.navigate(view)
        return { content: `Showing ${view}.`, summary: `Showed ${view}` }
      }

      default:
        return { content: `Unknown tool ${name}.`, isError: true, summary: `Unknown tool ${name}` }
    }
  } catch (e) {
    return { content: `Tool failed: ${e instanceof Error ? e.message : String(e)}`, isError: true, summary: `${name} failed` }
  }
}
