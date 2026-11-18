import type { ColorToken, DesignTokens, Mode } from "./types"

/**
 * shadcn/ui base colour palettes (neutral roles only). Applying one replaces
 * backgrounds, text, surfaces and borders but keeps brand colours.
 */
type Spec = {
  /** [light, dark] for each step */
  white: string
  fg: string
  surfaceDark: string
  secondary: [string, string]
  secondaryFg: string
  mutedFg: [string, string]
  border: string
  sidebar: string
}

const SPECS: Record<"neutral" | "zinc" | "slate" | "stone" | "gray", Spec> = {
  neutral: {
    white: "oklch(1 0 0)",
    fg: "oklch(0.145 0 0)",
    surfaceDark: "oklch(0.205 0 0)",
    secondary: ["oklch(0.97 0 0)", "oklch(0.269 0 0)"],
    secondaryFg: "oklch(0.205 0 0)",
    mutedFg: ["oklch(0.556 0 0)", "oklch(0.708 0 0)"],
    border: "oklch(0.922 0 0)",
    sidebar: "oklch(0.985 0 0)",
  },
  zinc: {
    white: "oklch(1 0 0)",
    fg: "oklch(0.141 0.005 285.823)",
    surfaceDark: "oklch(0.21 0.006 285.885)",
    secondary: ["oklch(0.967 0.001 286.375)", "oklch(0.274 0.006 286.033)"],
    secondaryFg: "oklch(0.21 0.006 285.885)",
    mutedFg: ["oklch(0.552 0.016 285.938)", "oklch(0.705 0.015 286.067)"],
    border: "oklch(0.92 0.004 286.32)",
    sidebar: "oklch(0.985 0 0)",
  },
  slate: {
    white: "oklch(1 0 0)",
    fg: "oklch(0.129 0.042 264.695)",
    surfaceDark: "oklch(0.208 0.042 265.755)",
    secondary: ["oklch(0.968 0.007 247.896)", "oklch(0.279 0.041 260.031)"],
    secondaryFg: "oklch(0.208 0.042 265.755)",
    mutedFg: ["oklch(0.554 0.046 257.417)", "oklch(0.704 0.04 256.788)"],
    border: "oklch(0.929 0.013 255.508)",
    sidebar: "oklch(0.984 0.003 247.858)",
  },
  stone: {
    white: "oklch(1 0 0)",
    fg: "oklch(0.147 0.004 49.25)",
    surfaceDark: "oklch(0.216 0.006 56.043)",
    secondary: ["oklch(0.97 0.001 106.424)", "oklch(0.268 0.007 34.298)"],
    secondaryFg: "oklch(0.216 0.006 56.043)",
    mutedFg: ["oklch(0.553 0.013 58.071)", "oklch(0.709 0.01 56.259)"],
    border: "oklch(0.923 0.003 48.717)",
    sidebar: "oklch(0.985 0.001 106.423)",
  },
  gray: {
    white: "oklch(1 0 0)",
    fg: "oklch(0.13 0.028 261.692)",
    surfaceDark: "oklch(0.21 0.034 264.665)",
    secondary: ["oklch(0.967 0.003 264.542)", "oklch(0.278 0.033 256.848)"],
    secondaryFg: "oklch(0.21 0.034 264.665)",
    mutedFg: ["oklch(0.551 0.027 264.364)", "oklch(0.707 0.022 261.325)"],
    border: "oklch(0.928 0.006 264.531)",
    sidebar: "oklch(0.985 0.002 247.839)",
  },
}

export const BASE_COLORS = SPECS

function palette(s: Spec, mode: Mode): Partial<Record<ColorToken, string>> {
  if (mode === "light")
    return {
      background: s.white,
      foreground: s.fg,
      card: s.white,
      "card-foreground": s.fg,
      popover: s.white,
      "popover-foreground": s.fg,
      secondary: s.secondary[0],
      "secondary-foreground": s.secondaryFg,
      muted: s.secondary[0],
      "muted-foreground": s.mutedFg[0],
      accent: s.secondary[0],
      "accent-foreground": s.secondaryFg,
      border: s.border,
      input: s.border,
      sidebar: s.sidebar,
      "sidebar-foreground": s.fg,
      "sidebar-accent": s.secondary[0],
      "sidebar-accent-foreground": s.secondaryFg,
      "sidebar-border": s.border,
    }
  return {
    background: s.fg,
    foreground: s.sidebar,
    card: s.surfaceDark,
    "card-foreground": s.sidebar,
    popover: s.surfaceDark,
    "popover-foreground": s.sidebar,
    secondary: s.secondary[1],
    "secondary-foreground": s.sidebar,
    muted: s.secondary[1],
    "muted-foreground": s.mutedFg[1],
    accent: s.secondary[1],
    "accent-foreground": s.sidebar,
    border: "oklch(1 0 0 / 10%)",
    input: "oklch(1 0 0 / 15%)",
    sidebar: s.surfaceDark,
    "sidebar-foreground": s.sidebar,
    "sidebar-accent": s.secondary[1],
    "sidebar-accent-foreground": s.sidebar,
    "sidebar-border": "oklch(1 0 0 / 10%)",
  }
}

/** Token path → new value for both modes */
export function applyBaseColor(_tokens: DesignTokens, name: keyof typeof SPECS): Record<string, string> {
  const out: Record<string, string> = {}
  for (const mode of ["light", "dark"] as Mode[]) {
    for (const [token, value] of Object.entries(palette(SPECS[name], mode))) out[`colors.${mode}.${token}`] = value!
  }
  return out
}
