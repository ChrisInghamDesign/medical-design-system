/**
 * shadcn/ui preset codes (from ui.shadcn.com/create, e.g. "b8"): decode one and
 * apply it to the tokens — style, base colour, accent theme, chart colours, fonts,
 * radius, icon library and menu style.
 *
 * Colours come from lib/ds/preset-data.json, fetched once from shadcn's own preset
 * endpoint (ui.shadcn.com/init) so the editor can apply any code offline: full
 * palettes per base colour, and per base colour the values each accent theme and
 * chart palette changes.
 */
import { decodePreset, isPresetCode } from "shadcn/preset"

import data from "./preset-data.json"
import { isPathLocked } from "./store"
import { applyStyle, isBuiltInStyle } from "./styles"
import { COLOR_TOKENS, ICON_LIBRARY_IDS, type ColorToken, type DesignTokens, type IconLibraryId, type MenuColor, type Mode } from "./types"

type Palette = Record<Mode, Record<string, string>>
interface PresetData {
  baseColors: Record<string, Palette>
  themes: Record<string, Record<string, Palette>>
  chartColors: Record<string, Record<string, Palette>>
  radius: Record<string, string>
}
const DATA = data as unknown as PresetData

export const BASE_COLOR_NAMES = Object.keys(DATA.baseColors)

/** Preset font ids → Google Fonts family names */
const FONT_NAMES: Record<string, string> = {
  "dm-sans": "DM Sans",
  "ibm-plex-sans": "IBM Plex Sans",
  "jetbrains-mono": "JetBrains Mono",
  "source-sans-3": "Source Sans 3",
  "geist-mono": "Geist Mono",
}
export function presetFontName(id: string): string {
  return FONT_NAMES[id] ?? id.split("-").map((w) => (w.length <= 2 ? w.toUpperCase() : w[0].toUpperCase() + w.slice(1))).join(" ")
}

const MONO = /mono$/

export interface PresetSummary {
  style: string
  baseColor: string
  theme: string
  chartColor: string
  font: string
  fontHeading: string
  radius: string
  iconLibrary: string
  menuColor: string
  menuAccent: string
}

/** Decode a preset code; null if it isn't one */
export function readPreset(code: string): PresetSummary | null {
  const trimmed = code.trim()
  if (!trimmed || !isPresetCode(trimmed)) return null
  return (decodePreset(trimmed) as PresetSummary | null) ?? null
}

export interface PresetResult {
  tokens: DesignTokens
  /** What changed, for a confirmation message */
  applied: string[]
  /** What was left alone and why */
  skipped: string[]
}

/** Apply a decoded preset; locked values are kept */
export function applyPreset(tokens: DesignTokens, p: PresetSummary): PresetResult {
  const locks = tokens.locks ?? []
  const locked = (path: string) => isPathLocked(locks, path)
  const applied: string[] = []
  const skipped: string[] = []
  let next: DesignTokens = JSON.parse(JSON.stringify(tokens))

  // Style first: it replaces the previous style's component changes and heights
  if (isBuiltInStyle(p.style)) {
    const res = applyStyle(next, p.style)
    next = res.tokens
    skipped.push(...res.skipped)
    applied.push(`style ${p.style}`)
  } else skipped.push(`style ${p.style} (not available)`)

  // Colours: base palette + accent theme + chart palette, for both modes
  const base = DATA.baseColors[p.baseColor]
  if (!base) skipped.push(`base colour ${p.baseColor} (not available)`)
  else {
    const theme = DATA.themes[p.baseColor]?.[p.theme]
    const chart = DATA.chartColors[p.baseColor]?.[p.chartColor]
    let lockedCount = 0
    for (const mode of ["light", "dark"] as Mode[]) {
      const values = { ...base[mode], ...theme?.[mode], ...chart?.[mode] }
      for (const token of COLOR_TOKENS) {
        const v = values[token]
        if (!v) continue
        if (locked(`colors.${mode}.${token}`)) lockedCount++
        else next.colors[mode][token as ColorToken] = v
      }
    }
    next.baseColor = p.baseColor
    next.accent = p.theme === p.baseColor ? undefined : p.theme
    applied.push(`${p.baseColor} colours${next.accent ? ` with ${p.theme} accent` : ""}`)
    if (lockedCount) skipped.push(`${lockedCount} locked colour${lockedCount === 1 ? "" : "s"}`)
  }

  // Fonts: body font, and heading font unless it inherits the body font
  if (locked("fonts")) skipped.push("fonts (locked)")
  else {
    const body = presetFontName(p.font)
    if (MONO.test(p.font)) next.fonts = { ...next.fonts, sans: body, mono: body }
    else next.fonts = { ...next.fonts, sans: body }
    next.fonts.heading = p.fontHeading && p.fontHeading !== "inherit" ? presetFontName(p.fontHeading) : body
    applied.push(`${body} font`)
  }

  // Radius
  const rem = DATA.radius[p.radius]
  if (rem == null) skipped.push(`radius ${p.radius} (unknown)`)
  else if (locked("radius")) skipped.push("radius (locked)")
  else {
    next.radius = parseFloat(rem) || 0
    next.radiusSteps = {}
    applied.push(`radius ${next.radius}rem`)
  }

  // Icon library
  if (!ICON_LIBRARY_IDS.includes(p.iconLibrary as IconLibraryId)) skipped.push(`${p.iconLibrary} icons (not available; kept ${next.icons?.library ?? "hugeicons"})`)
  else if (locked("icons")) skipped.push("icons (locked)")
  else {
    next.icons = { strokeWidth: 2, ...next.icons, library: p.iconLibrary as IconLibraryId }
    applied.push(`${p.iconLibrary} icons`)
  }

  // Menus
  if (locked("menu")) skipped.push("menus (locked)")
  else {
    next.menu = { color: p.menuColor as MenuColor, accent: p.menuAccent as "subtle" | "bold" }
    applied.push(`${p.menuColor.replace("-", " ")} menus`)
  }

  return { tokens: next, applied, skipped }
}
