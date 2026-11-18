/**
 * Library-neutral design tokens.
 *
 * This is the source of truth for the design system. Nothing in here is tied to
 * shadcn/ui, MUI or any other library: adapters (lib/ds/adapters) translate these
 * tokens into each library's theme format.
 */

export type Mode = "light" | "dark"

/** Every colour role the system defines. Adapters map these onto library slots. */
export const COLOR_TOKENS = [
  "background",
  "foreground",
  "card",
  "card-foreground",
  "popover",
  "popover-foreground",
  "primary",
  "primary-foreground",
  "secondary",
  "secondary-foreground",
  "muted",
  "muted-foreground",
  "accent",
  "accent-foreground",
  "destructive",
  "border",
  "input",
  "ring",
  "chart-1",
  "chart-2",
  "chart-3",
  "chart-4",
  "chart-5",
  "sidebar",
  "sidebar-foreground",
  "sidebar-primary",
  "sidebar-primary-foreground",
  "sidebar-accent",
  "sidebar-accent-foreground",
  "sidebar-border",
  "sidebar-ring",
] as const

export type ColorToken = (typeof COLOR_TOKENS)[number]

export const SHADOW_LEVELS = ["2xs", "xs", "sm", "md", "lg", "xl", "2xl"] as const
export type ShadowLevel = (typeof SHADOW_LEVELS)[number]

export interface FontTokens {
  /** Body / UI font family name, e.g. "Inter" */
  sans: string
  /** Heading font family name */
  heading: string
  /** Monospace font family name */
  mono: string
}

export interface DesignTokens {
  /** Format version, bump if the shape changes */
  version: 1
  name: string
  description?: string
  colors: Record<Mode, Record<ColorToken, string>>
  fonts: FontTokens
  /** Base corner radius in rem */
  radius: number
  /** Base spacing unit in rem (Tailwind's --spacing) */
  spacing: number
  /** CSS box-shadow value per level, per mode */
  shadows: Record<Mode, Record<ShadowLevel, string>>
  /** Token paths that are locked (e.g. "colors.light.primary", "radius") */
  locks?: string[]
}

export interface ColorGroup {
  id: string
  label: string
  description: string
  tokens: { token: ColorToken; label: string }[]
  /** Pairs to contrast-check: [surface, text] */
  pairs?: [ColorToken, ColorToken][]
}

export const COLOR_GROUPS: ColorGroup[] = [
  {
    id: "base",
    label: "Base",
    description: "Page background and default text",
    tokens: [
      { token: "background", label: "Background" },
      { token: "foreground", label: "Foreground" },
    ],
    pairs: [["background", "foreground"]],
  },
  {
    id: "primary",
    label: "Primary",
    description: "Main actions and highlights",
    tokens: [
      { token: "primary", label: "Primary" },
      { token: "primary-foreground", label: "Primary text" },
    ],
    pairs: [["primary", "primary-foreground"]],
  },
  {
    id: "secondary",
    label: "Secondary",
    description: "Secondary actions",
    tokens: [
      { token: "secondary", label: "Secondary" },
      { token: "secondary-foreground", label: "Secondary text" },
    ],
    pairs: [["secondary", "secondary-foreground"]],
  },
  {
    id: "muted",
    label: "Muted",
    description: "Subtle surfaces and secondary text",
    tokens: [
      { token: "muted", label: "Muted" },
      { token: "muted-foreground", label: "Muted text" },
    ],
    pairs: [
      ["muted", "muted-foreground"],
      ["background", "muted-foreground"],
    ],
  },
  {
    id: "accent",
    label: "Accent",
    description: "Hover and selected states",
    tokens: [
      { token: "accent", label: "Accent" },
      { token: "accent-foreground", label: "Accent text" },
    ],
    pairs: [["accent", "accent-foreground"]],
  },
  {
    id: "surfaces",
    label: "Cards & popovers",
    description: "Raised surfaces",
    tokens: [
      { token: "card", label: "Card" },
      { token: "card-foreground", label: "Card text" },
      { token: "popover", label: "Popover" },
      { token: "popover-foreground", label: "Popover text" },
    ],
    pairs: [
      ["card", "card-foreground"],
      ["popover", "popover-foreground"],
    ],
  },
  {
    id: "feedback",
    label: "Destructive",
    description: "Errors and destructive actions",
    tokens: [{ token: "destructive", label: "Destructive" }],
    pairs: [["background", "destructive"]],
  },
  {
    id: "lines",
    label: "Borders & focus",
    description: "Borders, inputs and focus rings",
    tokens: [
      { token: "border", label: "Border" },
      { token: "input", label: "Input" },
      { token: "ring", label: "Focus ring" },
    ],
  },
  {
    id: "charts",
    label: "Charts",
    description: "Data visualisation series",
    tokens: [
      { token: "chart-1", label: "Chart 1" },
      { token: "chart-2", label: "Chart 2" },
      { token: "chart-3", label: "Chart 3" },
      { token: "chart-4", label: "Chart 4" },
      { token: "chart-5", label: "Chart 5" },
    ],
  },
  {
    id: "sidebar",
    label: "Sidebar",
    description: "App sidebar navigation",
    tokens: [
      { token: "sidebar", label: "Sidebar" },
      { token: "sidebar-foreground", label: "Sidebar text" },
      { token: "sidebar-primary", label: "Sidebar primary" },
      { token: "sidebar-primary-foreground", label: "Sidebar primary text" },
      { token: "sidebar-accent", label: "Sidebar accent" },
      { token: "sidebar-accent-foreground", label: "Sidebar accent text" },
      { token: "sidebar-border", label: "Sidebar border" },
      { token: "sidebar-ring", label: "Sidebar ring" },
    ],
    pairs: [["sidebar", "sidebar-foreground"]],
  },
]

/** All contrast pairs across groups */
export const CONTRAST_PAIRS: [ColorToken, ColorToken][] = COLOR_GROUPS.flatMap(
  (g) => g.pairs ?? []
)
