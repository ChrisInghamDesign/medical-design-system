/**
 * shadcn/ui adapter.
 *
 * import: reads a shadcn globals.css (e.g. one written by DS Manager or the
 *         shadcn CLI) into library-neutral tokens.
 * export: writes app/theme.css, which the app loads after globals.css so the
 *         tokens win. It also patches globals.css and components/ui at build
 *         time so every token is reachable (see patchGlobalsCss, patchComponentSource).
 */
import { fontStack } from "../fonts"
import {
  COLOR_TOKENS,
  CONTROL_SIZES,
  DEFAULT_CONTROLS,
  RADIUS_MULTIPLIER,
  RADIUS_STEPS,
  SHADOW_LEVELS,
  TEXT_STEPS,
  TRACKING,
  WEIGHTS,
  normalizeTokens,
  type ColorToken,
  type ComponentOverride,
  type DesignTokens,
  type Mode,
  type ShadowLevel,
} from "../types"
import type { LibraryAdapter } from "./types"

/** Find the body of the first top-level block whose selector matches exactly. */
function topLevelBlock(css: string, selector: string): string | null {
  const re = new RegExp(`(^|\\n)${selector.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}\\s*\\{`, "g")
  const m = re.exec(css)
  if (!m) return null
  let depth = 1
  let i = m.index + m[0].length
  const start = i
  while (i < css.length && depth > 0) {
    if (css[i] === "{") depth++
    else if (css[i] === "}") depth--
    i++
  }
  return css.slice(start, i - 1)
}

function readVars(block: string | null): Record<string, string> {
  const out: Record<string, string> = {}
  if (!block) return out
  for (const m of block.matchAll(/--([a-z0-9-]+)\s*:\s*([^;]+);/gi)) {
    out[m[1]] = m[2].trim()
  }
  return out
}

function remValue(raw: string | undefined, fallback: number): number {
  if (!raw) return fallback
  const m = raw.match(/^([\d.]+)rem$/)
  if (m) return parseFloat(m[1])
  const px = raw.match(/^([\d.]+)px$/)
  if (px) return parseFloat(px[1]) / 16
  return fallback
}

export function importShadcnCss(css: string, base: DesignTokens): DesignTokens {
  const light = readVars(topLevelBlock(css, ":root"))
  const dark = readVars(topLevelBlock(css, ".dark"))
  const theme = readVars(topLevelBlock(css, "@theme inline"))

  const colors = { light: { ...base.colors.light }, dark: { ...base.colors.dark } }
  for (const token of COLOR_TOKENS) {
    if (light[token]) colors.light[token] = light[token]
    if (dark[token]) colors.dark[token] = dark[token]
    else if (light[token] && !base.colors.dark[token]) colors.dark[token] = light[token]
  }

  const shadows = { light: { ...base.shadows.light }, dark: { ...base.shadows.dark } }
  for (const level of SHADOW_LEVELS) {
    const key = `shadow-${level}`
    if (light[key]) shadows.light[level] = light[key]
    shadows.dark[level] = dark[key] ?? light[key] ?? shadows.dark[level]
  }

  const spacingRaw = theme.spacing && !theme.spacing.startsWith("var(") ? theme.spacing : undefined

  return {
    ...base,
    colors,
    shadows,
    radius: remValue(light.radius, base.radius),
    spacing: remValue(spacingRaw, base.spacing),
  }
}

const rem = (px: number) => `${Math.round((px / 16) * 10000) / 10000}rem`
const num = (n: number) => `${Math.round(n * 10000) / 10000}`

/** CSS custom properties for one mode. */
export function shadcnVars(input: DesignTokens, mode: Mode): Record<string, string> {
  const tokens = normalizeTokens(input)
  const vars: Record<string, string> = {}
  for (const token of COLOR_TOKENS) vars[`--${token}`] = tokens.colors[mode][token as ColorToken]
  for (const c of tokens.customColors ?? []) vars[`--${c.name}`] = mode === "dark" ? c.dark : c.light
  for (const level of SHADOW_LEVELS) vars[`--shadow-${level}`] = tokens.shadows[mode][level as ShadowLevel]
  if (mode === "light") {
    vars["--radius"] = `${tokens.radius}rem`
    for (const step of RADIUS_STEPS) {
      const fixed = tokens.radiusSteps?.[step]
      vars[`--radius-${step}`] = fixed != null ? `${fixed}rem` : `calc(var(--radius) * ${RADIUS_MULTIPLIER[step]})`
    }
    vars["--spacing"] = `${tokens.spacing}rem`
    vars["--font-sans"] = fontStack(tokens.fonts.sans, "sans")
    vars["--font-heading"] = fontStack(tokens.fonts.heading, "heading")
    vars["--font-mono"] = fontStack(tokens.fonts.mono, "mono")
    for (const step of TEXT_STEPS) {
      const t = tokens.typeScale![step]
      vars[`--text-${step}`] = rem(t.size)
      vars[`--text-${step}--line-height`] = num(t.lineHeight / t.size)
    }
    for (const w of WEIGHTS) vars[`--font-weight-${w}`] = String(tokens.fontWeights![w])
    for (const t of TRACKING) vars[`--tracking-${t}`] = `${tokens.tracking![t]}em`
  }
  return vars
}

const block = (selector: string, decls: Record<string, string>) => {
  const entries = Object.entries(decls).filter(([, v]) => v !== undefined && v !== "")
  if (!entries.length) return ""
  return `${selector} {\n${entries.map(([k, v]) => `  ${k}: ${v};`).join("\n")}\n}\n`
}

/* ------------------------------------------------------------------ */
/* Controls, focus, icons, menus                                       */
/* ------------------------------------------------------------------ */

function controlsCss(t: DesignTokens): string {
  const c = t.controls ?? DEFAULT_CONTROLS
  const follow = new Set(c.follow)
  const changed = CONTROL_SIZES.filter((s) => c.heights[s] !== DEFAULT_CONTROLS.heights[s])
  const out: string[] = []
  for (const size of changed) {
    const h = `${c.heights[size]}px`
    if (follow.has("button")) {
      out.push(block(`[data-slot="button"][data-size="${size}"]`, { height: h }))
      const icon = size === "default" ? "icon" : `icon-${size}`
      out.push(block(`[data-slot="button"][data-size="${icon}"]`, { height: h, width: h }))
    }
    if (size === "default") {
      if (follow.has("input")) out.push(block(`[data-slot="input"]`, { height: h }))
      if (follow.has("input-group")) out.push(block(`[data-slot="input-group"]:not(:has(textarea))`, { height: h }))
    }
    if (follow.has("select") && (size === "default" || size === "sm"))
      out.push(block(`[data-slot="select-trigger"][data-size="${size}"]`, { height: h }))
    if (follow.has("native-select") && (size === "default" || size === "sm"))
      out.push(block(`[data-slot="native-select"][data-size="${size}"]`, { height: h }))
    if (follow.has("toggle") && size !== "xs")
      out.push(block(`:is([data-slot="toggle"], [data-slot="toggle-group-item"])[data-size="${size}"]`, { height: h, "min-width": h }))
  }
  const f = c.focus
  if (f.style !== "default") {
    const color = `color-mix(in oklch, var(--ring) ${f.strength}%, transparent)`
    const sel = `[data-slot]:focus-visible`
    if (f.style === "ring") {
      out.push(
        block(sel, {
          "box-shadow": f.offset
            ? `0 0 0 ${f.offset}px var(--background), 0 0 0 ${f.offset + f.width}px ${color}`
            : `0 0 0 ${f.width}px ${color}`,
          outline: "none",
        })
      )
    } else {
      out.push(block(sel, { outline: `${f.width}px solid ${color}`, "outline-offset": `${f.offset}px`, "box-shadow": "none" }))
    }
  }
  return out.join("")
}

function iconsCss(t: DesignTokens): string {
  const w = t.icons?.strokeWidth ?? 2
  if (w === 2) return ""
  return block(`svg [stroke-width]`, { "stroke-width": String(w) })
}

const MENU_FAMILIES = ["dropdown-menu", "context-menu", "menubar", "select", "combobox"]

function menuCss(t: DesignTokens): string {
  const m = t.menu ?? { color: "default", accent: "subtle" }
  const out: string[] = []
  const contents = MENU_FAMILIES.map((f) => `[data-slot="${f}-content"]`).join(", ")
  const items = MENU_FAMILIES.flatMap((f) => [`[data-slot^="${f}-"][data-highlighted]`, `[data-slot$="${f}-item"]:focus`]).join(", ")
  const inverted = m.color === "inverted" || m.color === "inverted-translucent"
  const translucent = m.color === "default-translucent" || m.color === "inverted-translucent"
  if (inverted) {
    out.push(block(`:is(${contents})`, { "background-color": "var(--foreground)", color: "var(--background)", "--muted-foreground": "color-mix(in oklch, var(--background) 65%, transparent)", "--border": "color-mix(in oklch, var(--background) 18%, transparent)" }))
  }
  if (translucent) {
    // Frosted menus: the surface lets the page show through, blurred
    const surface = inverted ? "var(--foreground)" : "var(--popover)"
    out.push(block(`:is(${contents})`, { "background-color": `color-mix(in oklch, ${surface} 78%, transparent)`, "-webkit-backdrop-filter": "blur(12px) saturate(1.4)", "backdrop-filter": "blur(12px) saturate(1.4)" }))
  }
  if (m.accent === "bold") {
    out.push(block(`:is(${items})`, { "background-color": "var(--primary)", color: "var(--primary-foreground)" }))
  } else if (inverted) {
    out.push(block(`:is(${items})`, { "background-color": "color-mix(in oklch, var(--background) 14%, transparent)", color: "var(--background)" }))
  }
  return out.join("")
}

/* ------------------------------------------------------------------ */
/* Component overrides                                                 */
/* ------------------------------------------------------------------ */

const STATE_SUFFIX: Record<NonNullable<ComponentOverride["state"]>, string[]> = {
  // Hover never overrides an invalid or disabled control's own look
  hover: [':hover:not([aria-invalid="true"], :disabled, [data-disabled])'],
  focus: [":focus-visible"],
  active: [":active"],
  disabled: [":disabled", "[data-disabled]", '[aria-disabled="true"]'],
  open: ["[data-open]", "[data-popup-open]", '[aria-expanded="true"]'],
}

const attr = (v: string) => v.replace(/["\\]/g, "")

export function overrideSelector(o: Pick<ComponentOverride, "slot" | "variant" | "size" | "state">, preview = false): string {
  let base = `[data-slot="${attr(o.slot)}"]`
  if (o.variant) base += `[data-variant="${attr(o.variant)}"]`
  if (o.size) base += `[data-size="${attr(o.size)}"]`
  if (!o.state) return base
  const sels = STATE_SUFFIX[o.state].map((s) => base + s)
  if (preview) sels.push(`.ds-preview-${o.state} ${base}`)
  return sels.join(", ")
}

export function overridesCss(t: DesignTokens, preview = false): string {
  return (t.overrides ?? [])
    .filter((o) => Object.keys(o.props).length)
    .map((o) => block(overrideSelector(o, preview), o.props))
    .join("")
}

/* ------------------------------------------------------------------ */
/* theme.css                                                           */
/* ------------------------------------------------------------------ */

export function shadcnThemeCss(input: DesignTokens, opts: { preview?: boolean } = {}): string {
  const tokens = normalizeTokens(input)
  const parts = [
    "/*",
    " * Generated from design-system/tokens.json by the design system editor.",
    " * Do not edit by hand: change tokens in the editor (/editor) instead.",
    " * Loaded after globals.css; the doubled :root selector makes these values win.",
    " */",
    "",
    block(":root:root", shadcnVars(tokens, "light")),
    block(":root:root.dark", shadcnVars(tokens, "dark")),
  ]
  const extras: [string, string][] = [
    ["Control heights and focus", controlsCss(tokens)],
    ["Icons", iconsCss(tokens)],
    ["Menus", menuCss(tokens)],
    ["Component overrides", overridesCss(tokens, opts.preview)],
  ]
  for (const [title, css] of extras) if (css) parts.push(`/* ${title} */\n${css}`)
  return parts.join("\n")
}

/* ------------------------------------------------------------------ */
/* Build-time patches                                                  */
/* ------------------------------------------------------------------ */

const CUSTOM_START = "/* ds:custom-colors:start (generated) */"
const CUSTOM_END = "/* ds:custom-colors:end */"

/**
 * Point Tailwind's spacing and radius steps at the token variables (shadcn's
 * globals.css inlines fixed values), and register custom colours as Tailwind
 * colours. Safe to run repeatedly.
 */
export function patchGlobalsCss(css: string, input?: DesignTokens): string {
  let out = css.replace(/(@theme inline\s*\{[\s\S]*?)--spacing:\s*[\d.]+rem;/, "$1--spacing: var(--spacing);")
  for (const step of RADIUS_STEPS) {
    out = out.replace(new RegExp(`(@theme inline\\s*\\{[\\s\\S]*?)--radius-${step}:\\s*calc\\([^;]*\\);`), `$1--radius-${step}: var(--radius-${step});`)
  }
  const startIdx = out.indexOf(CUSTOM_START)
  if (startIdx >= 0) {
    const endIdx = out.indexOf(CUSTOM_END, startIdx)
    out = (out.slice(0, startIdx).trimEnd() + "\n" + out.slice(endIdx + CUSTOM_END.length).trimStart()).trimEnd() + "\n"
  }
  const custom = input?.customColors ?? []
  if (custom.length) {
    out =
      out.trimEnd() +
      `\n\n${CUSTOM_START}\n@theme inline {\n${custom.map((c) => `  --color-${c.name}: var(--${c.name});`).join("\n")}\n}\n${CUSTOM_END}\n`
  }
  return out
}

/**
 * Add data-variant / data-size attributes next to data-slot in components whose
 * styles depend on those props, so variant- and size-specific overrides can
 * target them. Safe to run repeatedly.
 */
export function patchComponentSource(src: string): string {
  const fnRe = /function (\w+)\(\{([^}]*)\}/g
  let out = ""
  let last = 0
  const fns: { start: number; params: string }[] = []
  let m: RegExpExecArray | null
  while ((m = fnRe.exec(src))) fns.push({ start: m.index, params: m[2] })
  if (!fns.length) return src
  fns.push({ start: src.length, params: "" })
  out = src.slice(0, fns[0].start)
  for (let i = 0; i < fns.length - 1; i++) {
    let chunk = src.slice(fns[i].start, fns[i + 1].start)
    const params = fns[i].params
    // Only real destructured props (one per line), not JSX like render = <Button variant="…" />
    const hasVariant = /(^|\n)\s*variant\s*[,=\n]/.test(params)
    const hasSize = /(^|\n)\s*size\s*[,=\n]/.test(params)
    if ((hasVariant || hasSize) && /data-slot=/.test(chunk)) {
      chunk = chunk.replace(/^(\s*)(data-slot=(?:"[^"]*"|\{[^}]*\}))\s*$/m, (line, indent: string, slot: string) => {
        const extra: string[] = []
        if (hasVariant && !/data-variant=/.test(chunk)) extra.push(`${indent}data-variant={variant ?? "default"}`)
        if (hasSize && !/data-size=/.test(chunk)) extra.push(`${indent}data-size={size ?? "default"}`)
        return [indent + slot, ...extra].join("\n")
      })
    }
    out += chunk
  }
  last = src.length
  return out + src.slice(last)
}

export const shadcnAdapter: LibraryAdapter = {
  id: "shadcn",
  name: "shadcn/ui",
  description: "Tailwind CSS variables and overrides for shadcn/ui components (app/theme.css)",
  outputs: [{ path: "app/theme.css", generate: (t) => shadcnThemeCss(t) }],
  previewCss: (t) => shadcnThemeCss(t, { preview: true }),
}
