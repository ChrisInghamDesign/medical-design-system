/**
 * shadcn/ui adapter.
 *
 * import: reads a shadcn globals.css (e.g. one written by DS Manager or the
 *         shadcn CLI) into library-neutral tokens.
 * export: writes app/theme.css, which the app loads after globals.css so the
 *         tokens win.
 */
import { fontStack } from "../fonts"
import {
  COLOR_TOKENS,
  SHADOW_LEVELS,
  type ColorToken,
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

  return {
    ...base,
    colors,
    shadows,
    radius: remValue(light.radius, base.radius),
    spacing: remValue(theme.spacing, base.spacing),
  }
}

/** CSS custom properties for one mode. Used by theme.css and the live canvas. */
export function shadcnVars(tokens: DesignTokens, mode: Mode): Record<string, string> {
  const vars: Record<string, string> = {}
  for (const token of COLOR_TOKENS) vars[`--${token}`] = tokens.colors[mode][token as ColorToken]
  for (const level of SHADOW_LEVELS) vars[`--shadow-${level}`] = tokens.shadows[mode][level as ShadowLevel]
  if (mode === "light") {
    vars["--radius"] = `${tokens.radius}rem`
    vars["--spacing"] = `${tokens.spacing}rem`
    vars["--font-sans"] = fontStack(tokens.fonts.sans, "sans")
    vars["--font-heading"] = fontStack(tokens.fonts.heading, "heading")
    vars["--font-mono"] = fontStack(tokens.fonts.mono, "mono")
  }
  return vars
}

const block = (selector: string, vars: Record<string, string>) =>
  `${selector} {\n${Object.entries(vars)
    .map(([k, v]) => `  ${k}: ${v};`)
    .join("\n")}\n}\n`

export function shadcnThemeCss(tokens: DesignTokens): string {
  return [
    "/*",
    " * Generated from design-system/tokens.json by the design system editor.",
    " * Do not edit by hand: change tokens in the editor (/editor) instead.",
    " * Loaded after globals.css; the doubled :root selector makes these values win.",
    " */",
    "",
    block(":root:root", shadcnVars(tokens, "light")),
    block(":root:root.dark", shadcnVars(tokens, "dark")),
  ].join("\n")
}

/**
 * Make Tailwind spacing follow the --spacing token. shadcn's globals.css inlines
 * a fixed value; this points it at the variable instead. Safe to run repeatedly.
 */
export function patchGlobalsCss(css: string): string {
  return css.replace(
    /(@theme inline\s*\{[\s\S]*?)--spacing:\s*[\d.]+rem;/,
    "$1--spacing: var(--spacing);"
  )
}

export const shadcnAdapter: LibraryAdapter = {
  id: "shadcn",
  name: "shadcn/ui",
  description: "Tailwind CSS variables for shadcn/ui components (app/theme.css)",
  outputs: [{ path: "app/theme.css", generate: shadcnThemeCss }],
  previewVars: shadcnVars,
}
