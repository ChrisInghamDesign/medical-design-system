import type { FontTokens } from "./types"

export type FontCategory = "sans" | "serif" | "mono" | "display"

export interface FontOption {
  family: string
  category: FontCategory
  /** Weights to request from Google Fonts */
  weights: number[]
}

const W = [400, 500, 600, 700]

/** Curated Google Fonts. Any other Google Fonts family can be typed in. */
export const FONT_OPTIONS: FontOption[] = [
  { family: "Inter", category: "sans", weights: W },
  { family: "Geist", category: "sans", weights: W },
  { family: "DM Sans", category: "sans", weights: W },
  { family: "Manrope", category: "sans", weights: W },
  { family: "Plus Jakarta Sans", category: "sans", weights: W },
  { family: "Figtree", category: "sans", weights: W },
  { family: "Outfit", category: "sans", weights: W },
  { family: "Instrument Sans", category: "sans", weights: W },
  { family: "IBM Plex Sans", category: "sans", weights: W },
  { family: "Work Sans", category: "sans", weights: W },
  { family: "Public Sans", category: "sans", weights: W },
  { family: "Nunito Sans", category: "sans", weights: W },
  { family: "Source Sans 3", category: "sans", weights: W },
  { family: "Roboto", category: "sans", weights: W },
  { family: "Open Sans", category: "sans", weights: W },
  { family: "Lato", category: "sans", weights: [400, 700] },
  { family: "Montserrat", category: "sans", weights: W },
  { family: "Poppins", category: "sans", weights: W },
  { family: "Lexend", category: "sans", weights: W },
  { family: "Space Grotesk", category: "display", weights: W },
  { family: "Sora", category: "display", weights: W },
  { family: "Fraunces", category: "serif", weights: W },
  { family: "Playfair Display", category: "serif", weights: W },
  { family: "Lora", category: "serif", weights: W },
  { family: "Merriweather", category: "serif", weights: [400, 700] },
  { family: "Source Serif 4", category: "serif", weights: W },
  { family: "Libre Baskerville", category: "serif", weights: [400, 700] },
  { family: "DM Serif Display", category: "serif", weights: [400] },
  { family: "Instrument Serif", category: "serif", weights: [400] },
  { family: "Geist Mono", category: "mono", weights: W },
  { family: "JetBrains Mono", category: "mono", weights: W },
  { family: "Fira Code", category: "mono", weights: W },
  { family: "IBM Plex Mono", category: "mono", weights: W },
  { family: "Source Code Pro", category: "mono", weights: W },
  { family: "Roboto Mono", category: "mono", weights: W },
  { family: "DM Mono", category: "mono", weights: [400, 500] },
  { family: "Space Mono", category: "mono", weights: [400, 700] },
]

const FALLBACK: Record<keyof FontTokens, string> = {
  sans: "ui-sans-serif, system-ui, sans-serif",
  heading: "ui-sans-serif, system-ui, sans-serif",
  mono: "ui-monospace, SFMono-Regular, Menlo, monospace",
}

const SERIF_FALLBACK = "ui-serif, Georgia, serif"

export function fontStack(family: string, role: keyof FontTokens): string {
  const option = FONT_OPTIONS.find((f) => f.family === family)
  const fallback = option?.category === "serif" ? SERIF_FALLBACK : FALLBACK[role]
  return `"${family}", ${fallback}`
}

/** One Google Fonts stylesheet URL per family (a bad weight list can't break the others). */
export function googleFontUrls(fonts: FontTokens): string[] {
  const families = Array.from(new Set([fonts.sans, fonts.heading, fonts.mono].filter(Boolean)))
  return families.map((family) => {
    const option = FONT_OPTIONS.find((f) => f.family === family)
    const name = family.trim().replace(/\s+/g, "+")
    const spec = option ? `${name}:wght@${option.weights.join(";")}` : name
    return `https://fonts.googleapis.com/css2?family=${spec}&display=swap`
  })
}
