/**
 * Library-neutral design tokens.
 *
 * This is the source of truth for the design system. Nothing in here is tied to
 * shadcn/ui, MUI or any other library: adapters (lib/ds/adapters) translate these
 * tokens into each library's theme format.
 */

export type Mode = "light" | "dark"

/** Icon libraries the components can draw with (see lib/ds/icons.tsx) */
export const ICON_LIBRARY_IDS = ["hugeicons", "lucide", "tabler", "phosphor"] as const
export type IconLibraryId = (typeof ICON_LIBRARY_IDS)[number]

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

export const TEXT_STEPS = ["xs", "sm", "base", "lg", "xl", "2xl", "3xl", "4xl", "5xl", "6xl", "7xl", "8xl", "9xl"] as const
export type TextStep = (typeof TEXT_STEPS)[number]

export const WEIGHTS = ["thin", "extralight", "light", "normal", "medium", "semibold", "bold", "extrabold", "black"] as const
export type WeightName = (typeof WEIGHTS)[number]

export const TRACKING = ["tighter", "tight", "normal", "wide", "wider", "widest"] as const
export type TrackingName = (typeof TRACKING)[number]

export const RADIUS_STEPS = ["sm", "md", "lg", "xl", "2xl", "3xl", "4xl"] as const
export type RadiusStep = (typeof RADIUS_STEPS)[number]
/** Each radius step is the base radius times this */
export const RADIUS_MULTIPLIER: Record<RadiusStep, number> = {
  sm: 0.6,
  md: 0.8,
  lg: 1,
  xl: 1.4,
  "2xl": 1.8,
  "3xl": 2.2,
  "4xl": 2.6,
}

export const CONTROL_SIZES = ["xs", "sm", "default", "lg"] as const
export type ControlSize = (typeof CONTROL_SIZES)[number]

/** Components whose height follows the control heights */
export const CONTROL_COMPONENTS = [
  { id: "button", label: "Button" },
  { id: "input", label: "Input" },
  { id: "input-group", label: "Input Group" },
  { id: "select", label: "Select" },
  { id: "native-select", label: "Native Select" },
  { id: "toggle", label: "Toggle & Toggle Group" },
] as const

export const LINT_RULES = [
  { id: "restyling", label: "Restyling", description: "Changing a component's colours, radius or borders with className instead of the design system" },
  { id: "raw-colors", label: "Raw colors", description: "Hex, rgb or Tailwind palette colours (bg-blue-500) instead of theme colours (bg-primary)" },
  { id: "made-up-sizes", label: "Made-up sizes", description: "Arbitrary values like p-[13px] or text-[15px] instead of the spacing and type scales" },
  { id: "inline-styles", label: "Inline styles", description: "style={{ … }} attributes" },
  { id: "typos", label: "Typos", description: "Colour classes that name a token that doesn't exist (bg-primry)" },
  { id: "dynamic-classes", label: "Dynamic classes", description: "Class names built with ${…}, which Tailwind can't see" },
] as const
export type LintRuleId = (typeof LINT_RULES)[number]["id"]
export type LintLevel = "off" | "warn" | "error"

export type OverrideState = "hover" | "focus" | "active" | "disabled" | "open"

/** A style change to one part (slot) of a component, optionally for one variant/size/state */
export interface ComponentOverride {
  /** Component id, e.g. "button" */
  component: string
  /** Part name (shadcn data-slot), e.g. "button" or "accordion-trigger" */
  slot: string
  variant?: string
  size?: string
  state?: OverrideState
  /** CSS property (kebab-case) → value */
  props: Record<string, string>
}

export interface CustomColor {
  name: string
  light: string
  dark: string
}

export interface BrandTokens {
  /** Paths under public/, e.g. "/brand/logo.svg" */
  logoLight?: string
  logoDark?: string
  /** What to show in dark mode when there's no dark logo */
  darkFallback: "light" | "text"
  logoHeight: number
  markLight?: string
  markDark?: string
  markHeight: number
  favicon?: string
}

export interface DesignTokens {
  /** Format version, bump if the shape changes */
  version: 1
  name: string
  description?: string
  colors: Record<Mode, Record<ColorToken, string>>
  /** Extra colours (e.g. success, warning) usable as bg-success, text-warning… */
  customColors?: CustomColor[]
  fonts: FontTokens
  /** Type scale in px: font size and line height per step */
  typeScale?: Record<TextStep, { size: number; lineHeight: number }>
  fontWeights?: Record<WeightName, number>
  /** Letter spacing in em */
  tracking?: Record<TrackingName, number>
  /** Base corner radius in rem */
  radius: number
  /** Optional fixed values (rem) for radius steps; otherwise derived from the base */
  radiusSteps?: Partial<Record<RadiusStep, number>>
  /** Base spacing unit in rem (Tailwind's --spacing) */
  spacing: number
  /** CSS box-shadow value per level, per mode */
  shadows: Record<Mode, Record<ShadowLevel, string>>
  controls?: {
    /** Control heights in px */
    heights: Record<ControlSize, number>
    /** Component ids whose height follows the control heights */
    follow: string[]
    focus: { style: "default" | "ring" | "outline"; width: number; offset: number; strength: number }
  }
  icons?: { library: IconLibraryId; strokeWidth: number }
  brand?: BrandTokens
  menu?: { color: "default" | "inverted"; accent: "subtle" | "bold" }
  /** Per-component style changes */
  overrides?: ComponentOverride[]
  lint?: { rules: Record<LintRuleId, LintLevel> }
  /** Token paths that are locked (e.g. "colors.light.primary", "radius") */
  locks?: string[]
}

export const DEFAULT_TYPE_SCALE: Record<TextStep, { size: number; lineHeight: number }> = {
  xs: { size: 12, lineHeight: 16 },
  sm: { size: 14, lineHeight: 20 },
  base: { size: 16, lineHeight: 24 },
  lg: { size: 18, lineHeight: 28 },
  xl: { size: 20, lineHeight: 28 },
  "2xl": { size: 24, lineHeight: 32 },
  "3xl": { size: 30, lineHeight: 36 },
  "4xl": { size: 36, lineHeight: 40 },
  "5xl": { size: 48, lineHeight: 48 },
  "6xl": { size: 60, lineHeight: 60 },
  "7xl": { size: 72, lineHeight: 72 },
  "8xl": { size: 96, lineHeight: 96 },
  "9xl": { size: 128, lineHeight: 128 },
}

export const DEFAULT_WEIGHTS: Record<WeightName, number> = {
  thin: 100,
  extralight: 200,
  light: 300,
  normal: 400,
  medium: 500,
  semibold: 600,
  bold: 700,
  extrabold: 800,
  black: 900,
}

export const DEFAULT_TRACKING: Record<TrackingName, number> = {
  tighter: -0.05,
  tight: -0.025,
  normal: 0,
  wide: 0.025,
  wider: 0.05,
  widest: 0.1,
}

export const DEFAULT_CONTROLS: NonNullable<DesignTokens["controls"]> = {
  heights: { xs: 24, sm: 32, default: 36, lg: 40 },
  follow: CONTROL_COMPONENTS.map((c) => c.id),
  focus: { style: "default", width: 3, offset: 0, strength: 50 },
}

export const DEFAULT_LINT: NonNullable<DesignTokens["lint"]> = {
  rules: {
    restyling: "off",
    "raw-colors": "off",
    "made-up-sizes": "off",
    "inline-styles": "off",
    typos: "off",
    "dynamic-classes": "off",
  },
}

export const LINT_PRESETS: Record<"off" | "relaxed" | "balanced" | "strict", Record<LintRuleId, LintLevel>> = {
  off: DEFAULT_LINT.rules,
  relaxed: { restyling: "off", "raw-colors": "warn", "made-up-sizes": "off", "inline-styles": "off", typos: "warn", "dynamic-classes": "warn" },
  balanced: { restyling: "warn", "raw-colors": "error", "made-up-sizes": "warn", "inline-styles": "warn", typos: "error", "dynamic-classes": "warn" },
  strict: { restyling: "error", "raw-colors": "error", "made-up-sizes": "error", "inline-styles": "error", typos: "error", "dynamic-classes": "error" },
}

/** Fill in any sections missing from older tokens.json files */
export function normalizeTokens(t: DesignTokens): DesignTokens {
  return {
    ...t,
    customColors: t.customColors ?? [],
    typeScale: { ...DEFAULT_TYPE_SCALE, ...t.typeScale },
    fontWeights: { ...DEFAULT_WEIGHTS, ...t.fontWeights },
    tracking: { ...DEFAULT_TRACKING, ...t.tracking },
    radiusSteps: t.radiusSteps ?? {},
    controls: {
      ...DEFAULT_CONTROLS,
      ...t.controls,
      heights: { ...DEFAULT_CONTROLS.heights, ...t.controls?.heights },
      focus: { ...DEFAULT_CONTROLS.focus, ...t.controls?.focus },
    },
    icons: { library: "hugeicons", strokeWidth: 2, ...t.icons },
    brand: {
      logoLight: "/logo.svg",
      favicon: "/icon.svg",
      darkFallback: "light",
      logoHeight: 24,
      markHeight: 32,
      ...t.brand,
    },
    menu: { color: "default", accent: "subtle", ...t.menu },
    overrides: t.overrides ?? [],
    lint: { rules: { ...DEFAULT_LINT.rules, ...t.lint?.rules } },
    locks: t.locks ?? [],
  }
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
