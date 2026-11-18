"use client"

import * as React from "react"

import { overrideSelector } from "@/lib/ds/adapters/shadcn"
import type { CanvasLayer } from "@/lib/ds/bridge"
import { COMPONENT_CLASSES, SLOT_COMPONENT, groupByState, slotClasses, slotVariantGroups } from "@/lib/ds/classes"
import {
  COLOR_TOKENS,
  RADIUS_STEPS,
  SHADOW_LEVELS,
  TEXT_STEPS,
  WEIGHTS,
  normalizeTokens,
  type ComponentOverride,
  type DesignTokens,
  type OverrideState,
} from "@/lib/ds/types"

import { ChromeButton, cx, Icons, PanelSection, Segmented, SelectInput } from "./chrome"
import { CommitInput } from "./inspector"

export interface Selection {
  slot: string
  variant?: string
  size?: string
  /** Chosen automatically when a component page opens: not outlined on the canvas */
  auto?: boolean
}

export const STATES: { value: OverrideState | "none"; label: string }[] = [
  { value: "none", label: "Default" },
  { value: "hover", label: "Hover" },
  { value: "focus", label: "Focus" },
  { value: "active", label: "Pressed" },
  { value: "disabled", label: "Disabled" },
  { value: "open", label: "Open" },
]

const STATE_WORDS: Record<OverrideState, string> = { hover: "hovered", focus: "focused", active: "pressed", disabled: "disabled", open: "open" }

type FieldKind = "length" | "color" | "radius" | "shadow" | "font-size" | "font-weight" | "number" | "select" | "text"

interface Field {
  prop: string
  label: string
  kind: FieldKind
  options?: string[]
  placeholder?: string
}

const FIELD_GROUPS: { title: string; fields: Field[] }[] = [
  {
    title: "Layout",
    fields: [
      { prop: "padding", label: "Padding", kind: "length", placeholder: "e.g. 8px 16px" },
      { prop: "gap", label: "Gap", kind: "length" },
      { prop: "width", label: "Width", kind: "length" },
      { prop: "height", label: "Height", kind: "length" },
      { prop: "min-height", label: "Min height", kind: "length" },
      { prop: "margin", label: "Margin", kind: "length" },
    ],
  },
  {
    title: "Typography",
    fields: [
      { prop: "font-size", label: "Size", kind: "font-size" },
      { prop: "font-weight", label: "Weight", kind: "font-weight" },
      { prop: "line-height", label: "Line height", kind: "text", placeholder: "e.g. 1.5 or 20px" },
      { prop: "letter-spacing", label: "Letter spacing", kind: "text", placeholder: "e.g. -0.01em" },
      { prop: "text-transform", label: "Case", kind: "select", options: ["none", "uppercase", "lowercase", "capitalize"] },
      { prop: "color", label: "Text colour", kind: "color" },
    ],
  },
  {
    title: "Appearance",
    fields: [
      { prop: "background-color", label: "Background", kind: "color" },
      { prop: "border-radius", label: "Radius", kind: "radius" },
      { prop: "border-width", label: "Border width", kind: "length" },
      { prop: "border-style", label: "Border style", kind: "select", options: ["solid", "dashed", "dotted", "none"] },
      { prop: "border-color", label: "Border colour", kind: "color" },
      { prop: "opacity", label: "Opacity", kind: "number", placeholder: "0–1" },
    ],
  },
  {
    title: "Effects",
    fields: [
      { prop: "box-shadow", label: "Shadow", kind: "shadow" },
      { prop: "outline-color", label: "Outline colour", kind: "color" },
      { prop: "cursor", label: "Cursor", kind: "select", options: ["default", "pointer", "not-allowed", "text"] },
      { prop: "transition-duration", label: "Transition", kind: "text", placeholder: "e.g. 150ms" },
    ],
  },
  {
    title: "Transform",
    fields: [
      { prop: "transform", label: "Transform", kind: "text", placeholder: "e.g. translateY(-1px) scale(1.02)" },
    ],
  },
]

const SAFE_VALUE = (v: string) => v.length < 200 && !/[;{}<>]/.test(v)

function presetOptions(kind: FieldKind, tokens: DesignTokens): { value: string; label: string }[] | null {
  const t = normalizeTokens(tokens)
  switch (kind) {
    case "color":
      return [
        { value: "transparent", label: "transparent" },
        ...COLOR_TOKENS.map((c) => ({ value: `var(--${c})`, label: c })),
        ...(t.customColors ?? []).map((c) => ({ value: `var(--${c.name})`, label: c.name })),
      ]
    case "radius":
      return [
        { value: "0", label: "none" },
        ...RADIUS_STEPS.map((s) => ({ value: `var(--radius-${s})`, label: s })),
        { value: "9999px", label: "full" },
      ]
    case "shadow":
      return [{ value: "none", label: "none" }, ...SHADOW_LEVELS.map((s) => ({ value: `var(--shadow-${s})`, label: s }))]
    case "font-size":
      return TEXT_STEPS.map((s) => ({ value: `var(--text-${s})`, label: `${s} · ${t.typeScale![s].size}px` }))
    case "font-weight":
      return WEIGHTS.map((w) => ({ value: `var(--font-weight-${w})`, label: `${w} · ${t.fontWeights![w]}` }))
    default:
      return null
  }
}

function PropRow({ field, value, onChange, tokens, disabled }: { field: Field; value: string | undefined; onChange: (v: string | undefined) => void; tokens: DesignTokens; disabled?: boolean }) {
  const presets = field.kind === "select" ? field.options!.map((o) => ({ value: o, label: o })) : presetOptions(field.kind, tokens)
  const isPreset = value != null && presets?.some((p) => p.value === value)
  const [custom, setCustom] = React.useState(false)
  return (
    <div className="grid grid-cols-[6rem_1fr_auto] items-center gap-2">
      <span className={cx("truncate text-[12px]", value != null ? "font-medium text-blue-700" : "text-zinc-600")} title={field.prop}>
        {field.label}
      </span>
      {presets && (field.kind === "select" || isPreset || (value == null && !custom)) ? (
        <SelectInput
          value={value ?? ""}
          disabled={disabled}
          aria-label={field.label}
          className="h-7 text-[12px]"
          onChange={(e) => {
            if (e.target.value === "__custom") setCustom(true)
            else onChange(e.target.value || undefined)
          }}
        >
          <option value="">Inherited</option>
          {presets.map((p) => (
            <option key={p.value} value={p.value}>
              {p.label}
            </option>
          ))}
          {field.kind !== "select" && <option value="__custom">Custom value…</option>}
        </SelectInput>
      ) : (
        <CommitInput
          value={value ?? ""}
          placeholder={field.placeholder ?? "Inherited"}
          disabled={disabled}
          aria-label={field.label}
          className="h-7 font-mono text-[11px]"
          autoFocus={custom && value == null}
          validate={(v) => v === "" || SAFE_VALUE(v)}
          onCommit={(v) => {
            if (!v) setCustom(false)
            onChange(v || undefined)
          }}
        />
      )}
      <button
        type="button"
        aria-label={`Reset ${field.label}`}
        title="Reset"
        disabled={(value == null && !custom) || disabled}
        onClick={() => {
          setCustom(false)
          onChange(undefined)
        }}
        className="inline-flex size-6 items-center justify-center rounded-[5px] text-zinc-400 hover:bg-zinc-100 hover:text-zinc-700 disabled:invisible"
      >
        <Icons.close width={12} height={12} />
      </button>
    </div>
  )
}

const same = (o: ComponentOverride, s: { slot: string; variant?: string; size?: string; state?: OverrideState }) =>
  o.slot === s.slot && (o.variant ?? undefined) === (s.variant ?? undefined) && (o.size ?? undefined) === (s.size ?? undefined) && (o.state ?? undefined) === (s.state ?? undefined)

export function ComponentPanel({
  componentId,
  componentName,
  layers,
  selection,
  onSelect,
  state,
  setState,
  tokens,
  update,
  locked,
}: {
  componentId: string
  componentName: string
  layers: CanvasLayer[]
  selection: Selection | null
  onSelect: (s: Selection | null) => void
  state: OverrideState | null
  setState: (s: OverrideState | null) => void
  tokens: DesignTokens
  update: (path: string, value: unknown, key?: string) => void
  locked: boolean
}) {
  const [tab, setTab] = React.useState<"style" | "utilities">("style")
  const t = normalizeTokens(tokens)
  const overrides = t.overrides ?? []
  const ownSlots = Object.keys(COMPONENT_CLASSES[componentId]?.slots ?? {})
  const slot = selection?.slot ?? ownSlots.find((s) => layers.some((l) => l.slot === s)) ?? ownSlots[0]
  const groups = slot ? slotVariantGroups(slot) : {}
  const layer = layers.find((l) => l.slot === slot)
  const variants = groups.variant ?? layer?.variants.filter((v) => v !== "default") ?? []
  const sizes = groups.size ?? layer?.sizes.filter((v) => v !== "default") ?? []
  const scope = { slot: slot ?? "", variant: selection?.variant, size: selection?.size, state: state ?? undefined }
  const current = overrides.find((o) => same(o, scope))
  const props = current?.props ?? {}
  const owner = (slot && SLOT_COMPONENT[slot]) || componentId

  const setProp = (prop: string, value: string | undefined) => {
    if (!slot) return
    const nextProps = { ...props }
    if (value == null) delete nextProps[prop]
    else nextProps[prop] = value
    const rest = overrides.filter((o) => !same(o, scope))
    const next: ComponentOverride[] = Object.keys(nextProps).length
      ? [...rest, { component: owner, slot, ...(scope.variant ? { variant: scope.variant } : {}), ...(scope.size ? { size: scope.size } : {}), ...(scope.state ? { state: scope.state } : {}), props: nextProps }]
      : rest
    update("overrides", next)
  }

  const componentOverrides = overrides.filter((o) => o.component === componentId || ownSlots.includes(o.slot))

  if (!slot) {
    return (
      <PanelSection>
        <p className="text-[12px] text-zinc-500">This component has no editable parts.</p>
      </PanelSection>
    )
  }

  const classes = slotClasses(slot, { variant: scope.variant, size: scope.size })
  const allClasses = [...classes.base, ...classes.groups.flatMap((g) => g.classes)]
  const byState = groupByState(allClasses)

  return (
    <>
      <PanelSection>
        <div className="flex items-center gap-2">
          <Icons.component width={14} height={14} className="text-zinc-500" />
          <span className="text-[13px] font-semibold text-zinc-900">{componentName}</span>
        </div>
        <label className="flex flex-col gap-1.5">
          <span className="text-[12px] text-zinc-600">Part</span>
          <SelectInput value={slot} aria-label="Part" onChange={(e) => onSelect({ slot: e.target.value })}>
            <optgroup label={componentName}>
              {ownSlots.map((s) => (
                <option key={s} value={s}>
                  {s}
                </option>
              ))}
            </optgroup>
            {layers.some((l) => !ownSlots.includes(l.slot)) && (
              <optgroup label="Also on this page">
                {layers
                  .filter((l) => !ownSlots.includes(l.slot))
                  .map((l) => (
                    <option key={l.slot} value={l.slot}>
                      {l.slot}
                    </option>
                  ))}
              </optgroup>
            )}
          </SelectInput>
        </label>
        <div className="grid grid-cols-2 gap-2">
          <label className="flex flex-col gap-1.5">
            <span className="text-[12px] text-zinc-600">Variant</span>
            <SelectInput value={scope.variant ?? ""} disabled={!variants.length} aria-label="Variant" onChange={(e) => onSelect({ slot, variant: e.target.value || undefined, size: scope.size })}>
              <option value="">All variants</option>
              {variants.map((v) => (
                <option key={v} value={v}>
                  {v}
                </option>
              ))}
            </SelectInput>
          </label>
          <label className="flex flex-col gap-1.5">
            <span className="text-[12px] text-zinc-600">Size</span>
            <SelectInput value={scope.size ?? ""} disabled={!sizes.length} aria-label="Size" onChange={(e) => onSelect({ slot, variant: scope.variant, size: e.target.value || undefined })}>
              <option value="">All sizes</option>
              {sizes.map((v) => (
                <option key={v} value={v}>
                  {v}
                </option>
              ))}
            </SelectInput>
          </label>
        </div>
        <label className="flex flex-col gap-1.5">
          <span className="text-[12px] text-zinc-600">State</span>
          <SelectInput value={state ?? "none"} aria-label="State" onChange={(e) => setState(e.target.value === "none" ? null : (e.target.value as OverrideState))}>
            {STATES.map((s) => (
              <option key={s.value} value={s.value}>
                {s.label}
              </option>
            ))}
          </SelectInput>
        </label>
        <p className="text-[11px] text-zinc-500">
          Changes apply to <span className="font-mono">{slot}</span>
          {scope.variant ? ` · ${scope.variant}` : ""}
          {scope.size ? ` · ${scope.size}` : ""}
          {scope.state ? ` when ${STATE_WORDS[scope.state]}` : ""}, everywhere it&apos;s used.
        </p>
        <Segmented
          value={tab}
          onChange={setTab}
          className="w-full [&>button]:flex-1"
          options={[
            { value: "style", label: "Style" },
            { value: "utilities", label: "Utilities" },
          ]}
        />
      </PanelSection>

      {tab === "style" ? (
        <>
          {locked && (
            <PanelSection>
              <p className="text-[12px] text-amber-800">Component styles are locked. Unlock them on the Lint page to edit.</p>
            </PanelSection>
          )}
          {FIELD_GROUPS.map((g) => (
            <PanelSection key={g.title} title={g.title}>
              {g.fields.map((f) => (
                <PropRow key={`${slot}|${scope.variant}|${scope.size}|${scope.state}|${f.prop}`} field={f} value={props[f.prop]} tokens={tokens} disabled={locked} onChange={(v) => setProp(f.prop, v)} />
              ))}
            </PanelSection>
          ))}
          <PanelSection title={`Changes to ${componentName} (${componentOverrides.length})`}>
            {componentOverrides.length === 0 ? (
              <p className="text-[11px] text-zinc-500">No changes yet. The component uses its built-in styles.</p>
            ) : (
              <ul className="flex flex-col gap-1.5">
                {componentOverrides.map((o, i) => (
                  <li key={i} className="flex items-start gap-2 rounded-[6px] border border-zinc-200 px-2 py-1.5">
                    <button
                      type="button"
                      className="min-w-0 flex-1 text-left"
                      onClick={() => {
                        onSelect({ slot: o.slot, variant: o.variant, size: o.size })
                        setState(o.state ?? null)
                      }}
                    >
                      <div className="truncate font-mono text-[11px] text-zinc-800">
                        {o.slot}
                        {o.variant ? ` · ${o.variant}` : ""}
                        {o.size ? ` · ${o.size}` : ""}
                        {o.state ? ` · ${o.state}` : ""}
                      </div>
                      <div className="truncate text-[11px] text-zinc-500">{Object.keys(o.props).join(", ")}</div>
                    </button>
                    <ChromeButton size="sm" variant="ghost" aria-label="Remove this change" disabled={locked} onClick={() => update("overrides", overrides.filter((x) => x !== o))}>
                      <Icons.trash width={13} height={13} />
                    </ChromeButton>
                  </li>
                ))}
              </ul>
            )}
          </PanelSection>
        </>
      ) : (
        <>
          <PanelSection title="Built-in classes">
            <p className="text-[11px] text-zinc-500">
              Tailwind classes this part ships with in components/ui/{owner}.tsx
              {classes.groups.length ? ` (${classes.groups.map((g) => `${g.group}=${g.value}`).join(", ")})` : ""}. Your changes are layered on top.
            </p>
            {allClasses.length === 0 ? (
              <p className="text-[12px] text-zinc-500">No classes on this part.</p>
            ) : (
              Object.entries(byState).map(([prefix, list]) => (
                <div key={prefix} className="flex flex-col gap-1">
                  <span className="text-[11px] font-medium text-zinc-500">{prefix || "Always"}</span>
                  <div className="flex flex-wrap gap-1">
                    {list.map((c, i) => (
                      <code key={i} className="rounded-[4px] bg-zinc-100 px-1.5 py-0.5 font-mono text-[10.5px] break-all text-zinc-700">
                        {c}
                      </code>
                    ))}
                  </div>
                </div>
              ))
            )}
          </PanelSection>
          <PanelSection title="Generated CSS">
            {current ? (
              <pre className="overflow-x-auto rounded-[6px] bg-zinc-950 p-2.5 font-mono text-[10.5px] leading-relaxed whitespace-pre-wrap text-zinc-100">
                {`${overrideSelector(current)} {\n${Object.entries(current.props)
                  .map(([k, v]) => `  ${k}: ${v};`)
                  .join("\n")}\n}`}
              </pre>
            ) : (
              <p className="text-[11px] text-zinc-500">No changes for this part and scope.</p>
            )}
            <p className="text-[11px] text-zinc-500">Saved into app/theme.css. Other libraries map the same changes to their own styling API.</p>
          </PanelSection>
        </>
      )}
    </>
  )
}
