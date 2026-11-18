/**
 * Styles: named looks for the whole component set, chosen on the Style page.
 *
 * The built-in styles follow shadcn/ui's base styles (Vega, Nova, Maia, Lyra, Mira,
 * Luma, Sera, Rhea). components/ui is installed with Vega, so Vega changes nothing;
 * each other style is expressed as control heights plus component changes (the
 * same overrides the component inspector makes), based on the differences between
 * that style's registry components and Vega's. The component code itself stays
 * Vega's, so this is a close match, not a reinstall.
 *
 * Custom styles are saved into tokens.json (customStyles) from the current look.
 * Overrides a style adds are tagged with its id, so switching style replaces them
 * and leaves your own component changes alone.
 */
import { isPathLocked } from "./store"
import { DEFAULT_CONTROLS, type ComponentOverride, type ControlSize, type DesignTokens, type StyleDefinition } from "./types"

type Props = Record<string, string>
type O = Omit<ComponentOverride, "style">

const sp = (n: number) => `calc(var(--spacing) * ${n})`
const r = (step: string) => `var(--radius-${step})`
const text = (step: string) => `var(--text-${step})`
const weight = (w: string) => `var(--font-weight-${w})`

/** The text fields that share a look */
const FIELD_SLOTS: [string, string][] = [
  ["input", "input"],
  ["textarea", "textarea"],
  ["select", "select-trigger"],
  ["native-select", "native-select"],
  ["input-group", "input-group"],
]

const fields = (props: Props): O[] => FIELD_SLOTS.map(([component, slot]) => ({ component, slot, props }))
const button = (props: Props): O => ({ component: "button", slot: "button", props })
const card = (props: Props, spacing?: [number, number]): O[] => [
  { component: "card", slot: "card", props: { ...props, ...(spacing ? { "--card-spacing": sp(spacing[1]) } : {}) } },
  ...(spacing ? [{ component: "card", slot: "card", size: "sm", props: { "--card-spacing": sp(spacing[0]) } }] : []),
]
const cardTitle = (props: Props): O => ({ component: "card", slot: "card-title", props })
const badge = (props: Props): O => ({ component: "badge", slot: "badge", props })

const h = (xs: number, sm: number, def: number, lg: number): Record<ControlSize, number> => ({ xs, sm, default: def, lg })

export const BUILT_IN_STYLES: StyleDefinition[] = [
  {
    id: "vega",
    name: "Vega",
    description: "Clean, neutral, and familiar",
    heights: h(24, 32, 36, 40),
    overrides: [],
  },
  {
    id: "nova",
    name: "Nova",
    description: "Reduced padding and margins",
    heights: h(24, 28, 32, 36),
    overrides: [
      button({ "border-radius": r("lg") }),
      ...fields({ "border-radius": r("lg"), "box-shadow": "none" }),
      ...card({ "box-shadow": "none" }, [3, 4]),
    ],
  },
  {
    id: "maia",
    name: "Maia",
    description: "Rounded, with generous spacing",
    heights: h(24, 32, 36, 40),
    overrides: [
      button({ "border-radius": r("4xl"), "padding-inline": sp(3) }),
      ...fields({ "border-radius": r("4xl"), "background-color": "color-mix(in oklch, var(--input) 30%, transparent)", "box-shadow": "none" }),
      ...card({ "border-radius": r("2xl"), "box-shadow": "none" }),
    ],
  },
  {
    id: "lyra",
    name: "Lyra",
    description: "Boxy and sharp. For mono fonts.",
    heights: h(24, 28, 32, 36),
    overrides: [
      button({ "border-radius": "0", "font-size": text("xs") }),
      ...fields({ "border-radius": "0", "font-size": text("xs"), "box-shadow": "none" }),
      ...card({ "border-radius": "0", "font-size": text("xs"), "box-shadow": "none" }, [3, 4]),
      cardTitle({ "font-size": text("sm") }),
      badge({ "border-radius": "0" }),
    ],
  },
  {
    id: "mira",
    name: "Mira",
    description: "Made for compact interfaces.",
    heights: h(20, 24, 28, 32),
    overrides: [
      button({ "font-size": text("xs"), "padding-inline": sp(2) }),
      ...fields({ "font-size": text("sm"), "padding-inline": sp(2), "background-color": "color-mix(in oklch, var(--input) 20%, transparent)", "box-shadow": "none" }),
      ...card({ "border-radius": r("lg"), "font-size": text("xs"), "box-shadow": "none" }, [3, 4]),
      cardTitle({ "font-size": text("sm") }),
      badge({ "font-size": "0.625rem" }),
    ],
  },
  {
    id: "luma",
    name: "Luma",
    description: "Fluid, luminous, and soft.",
    heights: h(24, 32, 36, 40),
    overrides: [
      button({ "border-radius": r("4xl"), "padding-inline": sp(3) }),
      ...fields({ "border-radius": r("3xl"), "border-color": "transparent", "background-color": "color-mix(in oklch, var(--input) 50%, transparent)", "box-shadow": "none" }),
      ...card({ "border-radius": r("4xl"), "box-shadow": "var(--shadow-md)" }),
      badge({ "border-radius": r("3xl") }),
    ],
  },
  {
    id: "sera",
    name: "Sera",
    description: "Editorial and typographic.",
    heights: h(28, 36, 40, 44),
    overrides: [
      button({ "border-radius": "0", "font-size": text("xs"), "font-weight": weight("semibold"), "letter-spacing": "0.1em", "text-transform": "uppercase", "padding-inline": sp(6) }),
      ...fields({ "border-radius": "0", "border-color": "transparent", "border-bottom-color": "var(--input)", "background-color": "transparent", "padding-inline": "0", "box-shadow": "none" }),
      ...card({ "border-radius": "0", "box-shadow": "var(--shadow-sm)" }, [5, 8]),
      cardTitle({ "font-size": text("lg"), "font-weight": weight("semibold"), "letter-spacing": "0.05em", "text-transform": "uppercase" }),
      badge({ "border-radius": "0", "background-color": "transparent", "padding-inline": "0", "font-size": "0.625rem", "font-weight": weight("semibold"), "letter-spacing": "0.1em", "text-transform": "uppercase" }),
    ],
  },
  {
    id: "rhea",
    name: "Rhea",
    description: "Like Luma but compact.",
    heights: h(24, 28, 32, 36),
    overrides: [
      button({ "border-radius": r("2xl"), "padding-inline": sp(3) }),
      ...fields({ "border-radius": r("2xl"), "border-color": "transparent", "background-color": "color-mix(in oklch, var(--input) 50%, transparent)", "box-shadow": "none" }),
      ...card({ "border-radius": `min(${r("4xl")}, 24px)` }, [4, 5]),
      badge({ "border-radius": r("2xl") }),
    ],
  },
]

export function allStyles(tokens: DesignTokens): StyleDefinition[] {
  return [...BUILT_IN_STYLES, ...(tokens.customStyles ?? [])]
}

export function findStyle(tokens: DesignTokens, id: string | undefined): StyleDefinition | undefined {
  return allStyles(tokens).find((s) => s.id === (id ?? "vega"))
}

export const isBuiltInStyle = (id: string) => BUILT_IN_STYLES.some((s) => s.id === id)

const strip = (o: ComponentOverride): O => {
  const { style, ...rest } = o
  void style
  return rest
}

const overrideKey = (o: O) => JSON.stringify([o.component, o.slot, o.variant ?? "", o.size ?? "", o.state ?? "", Object.entries(o.props).sort()])

/** Whether the current look still matches the active style (heights and its component changes) */
export function styleIsModified(tokens: DesignTokens): boolean {
  const def = findStyle(tokens, tokens.style)
  if (!def) return true
  const heights = { ...DEFAULT_CONTROLS.heights, ...tokens.controls?.heights }
  if ((Object.keys(def.heights) as ControlSize[]).some((k) => def.heights[k] !== heights[k])) return true
  const mine = (tokens.overrides ?? []).filter((o) => o.style === def.id).map((o) => overrideKey(strip(o))).sort()
  const theirs = def.overrides.map(overrideKey).sort()
  return JSON.stringify(mine) !== JSON.stringify(theirs)
}

export interface StyleResult {
  tokens: DesignTokens
  /** Parts not applied because they're locked */
  skipped: string[]
}

/** Switch to a style: its heights and component changes replace the previous style's */
export function applyStyle(tokens: DesignTokens, id: string): StyleResult {
  const def = findStyle(tokens, id)
  if (!def) return { tokens, skipped: [] }
  const locks = tokens.locks ?? []
  const skipped: string[] = []
  const next: DesignTokens = JSON.parse(JSON.stringify(tokens))
  if (isPathLocked(locks, "overrides")) skipped.push("component changes (locked)")
  else next.overrides = [...(tokens.overrides ?? []).filter((o) => !o.style), ...def.overrides.map((o) => ({ ...o, style: def.id }))]
  if (isPathLocked(locks, "controls.heights")) skipped.push("control heights (locked)")
  else next.controls = { ...DEFAULT_CONTROLS, ...tokens.controls, heights: { ...def.heights } }
  next.style = def.id
  return { tokens: next, skipped }
}

/** "My compact look" → "custom-my-compact-look", unique among existing styles */
function newStyleId(tokens: DesignTokens, name: string) {
  const base = `custom-${name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "") || "style"}`
  let id = base
  for (let i = 2; allStyles(tokens).some((s) => s.id === id); i++) id = `${base}-${i}`
  return id
}

/** Save the current heights and every component change as a style, and make it active */
export function saveStyle(tokens: DesignTokens, name: string, description: string, replaceId?: string): DesignTokens {
  const id = replaceId ?? newStyleId(tokens, name)
  const def: StyleDefinition = {
    id,
    name: name.trim(),
    description: description.trim() || "Saved from the editor",
    heights: { ...DEFAULT_CONTROLS.heights, ...tokens.controls?.heights },
    overrides: (tokens.overrides ?? []).map(strip),
  }
  const others = (tokens.customStyles ?? []).filter((s) => s.id !== id)
  return {
    ...JSON.parse(JSON.stringify(tokens)),
    customStyles: [...others, def],
    // The changes now belong to this style, so switching away removes them cleanly
    overrides: def.overrides.map((o) => ({ ...o, style: id })),
    style: id,
  }
}

export function renameStyle(tokens: DesignTokens, id: string, name: string, description?: string): DesignTokens {
  return {
    ...tokens,
    customStyles: (tokens.customStyles ?? []).map((s) => (s.id === id ? { ...s, name: name.trim() || s.name, description: description?.trim() || s.description } : s)),
  }
}

/** Delete a custom style; if it's active, its changes stay as your own and the style becomes Vega */
export function deleteStyle(tokens: DesignTokens, id: string): DesignTokens {
  const active = (tokens.style ?? "vega") === id
  return {
    ...tokens,
    customStyles: (tokens.customStyles ?? []).filter((s) => s.id !== id),
    overrides: active ? (tokens.overrides ?? []).map((o) => (o.style === id ? strip(o) : o)) : tokens.overrides,
    style: active ? "vega" : tokens.style,
  }
}
