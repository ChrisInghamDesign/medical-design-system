"use client"

import * as React from "react"
import {
  Add01Icon,
  Alert02Icon,
  ArrowDown01Icon,
  ArrowLeft01Icon,
  ArrowRight01Icon,
  ArrowUp01Icon,
  Calendar03Icon,
  CheckmarkCircle02Icon,
  Copy01Icon,
  Delete02Icon,
  Download01Icon,
  Edit02Icon,
  File01Icon,
  FileAttachmentIcon,
  Folder01Icon,
  Home01Icon,
  Image01Icon,
  InformationCircleIcon,
  Loading03Icon,
  Menu01Icon,
  Notification03Icon,
  Pdf01Icon,
  Search01Icon,
  Settings02Icon,
  UserIcon,
  ICON_LIBRARIES,
  type IconName,
} from "@/lib/ds/icons"

import classes from "@/design-system/component-classes.json"
import { Alert, AlertTitle } from "@/components/ui/alert"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox"
import { Field, FieldLabel } from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import { InputGroup, InputGroupAddon, InputGroupInput } from "@/components/ui/input-group"
import { Label } from "@/components/ui/label"
import { NativeSelect, NativeSelectOption } from "@/components/ui/native-select"
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { Toggle } from "@/components/ui/toggle"
import { contrastLevel, contrastRatio } from "@/lib/ds/color"
import {
  CONTRAST_PAIRS,
  type ColorToken,
  CONTROL_SIZES,
  RADIUS_MULTIPLIER,
  RADIUS_STEPS,
  SHADOW_LEVELS,
  TEXT_STEPS,
  TRACKING,
  normalizeTokens,
  type DesignTokens,
  type Mode,
} from "@/lib/ds/types"

import { Icon } from "./shadcn/demos-a"

export interface FoundationProps {
  tokens: DesignTokens
  mode: Mode
  /** Resolve a public asset path (handles unsaved uploads) */
  assetUrl: (path?: string) => string | undefined
}

export function Section({ title, description, children }: { title: string; description?: string; children: React.ReactNode }) {
  return (
    <section className="flex min-w-0 flex-col gap-4">
      <div className="flex max-w-[353px] min-w-0 flex-col gap-1">
        <h2 className="text-[13px] leading-[22px] font-medium text-[var(--chrome-canvas-fg)]">{title}</h2>
        {description && <p className="text-[11px] leading-4 text-[var(--chrome-canvas-fg-muted)]">{description}</p>}
      </div>
      {children}
    </section>
  )
}

/** The neutral "chrome" card every specimen sits in (same in any theme) */
export const CHROME_CARD = "flex min-w-0 flex-col overflow-hidden rounded-xl border border-[var(--chrome-line)] bg-[var(--chrome-card)]"
export const CHROME_LABEL = "flex min-w-0 flex-col gap-0.5 border-t border-[var(--chrome-line)] p-3 font-mono text-[11px] leading-4 text-[var(--chrome-fg)]"

function Tile({
  label,
  children,
  className,
  corner,
  start,
}: {
  label: React.ReactNode
  children: React.ReactNode
  className?: string
  /** Content flush in the bottom-right corner (radius samples) */
  corner?: boolean
  /** Content left-aligned and stacked (type samples) */
  start?: boolean
}) {
  const body = corner
    ? "flex min-h-20 min-w-0 flex-1 items-end justify-end"
    : start
      ? "flex min-h-20 min-w-0 flex-1 flex-col items-start justify-center gap-1 overflow-hidden p-4 text-[var(--chrome-fg)]"
      : "flex min-h-30 min-w-0 flex-1 flex-wrap items-center justify-center gap-2 p-3"
  return (
    <div className={`${CHROME_CARD} ${className ?? ""}`}>
      <div className={body}>{children}</div>
      <div className={CHROME_LABEL}>
        <span className="truncate">{label}</span>
      </div>
    </div>
  )
}

/** Light and dark values of the neutral canvas chrome */
export function chromeVars(mode: Mode): React.CSSProperties {
  const v =
    mode === "dark"
      ? { canvas: "lab(15.2% 0 0)", fg: "lab(93.04% 0 0)", muted: "lab(75.64% 0 0)", card: "lab(13.23% 0 0)", line: "lab(24.37% 0 0)", surface: "lab(19.84% 0 0)" }
      : { canvas: "lab(93.74% 0 0)", fg: "lab(9.29% 0 0)", muted: "lab(38.52% 0 0)", card: "lab(100% 0 0)", line: "lab(91.18% 0 0)", surface: "lab(96.52% 0 0)" }
  return {
    "--chrome-canvas": v.canvas,
    "--chrome-canvas-fg": v.fg,
    "--chrome-canvas-fg-muted": v.muted,
    "--chrome-fg": v.fg,
    "--chrome-fg-muted": v.muted,
    "--chrome-card": v.card,
    "--chrome-line": v.line,
    "--chrome-surface": v.surface,
  } as React.CSSProperties
}

/* ------------------------------------------------------------------ */
/* Colours                                                             */
/* ------------------------------------------------------------------ */

/** Colour groups as the Color page shows them */
const COLOR_SECTIONS: { title: string; description: string; tokens: ColorToken[]; wide?: boolean }[] = [
  { title: "Base", description: "The page itself and the text written on it.", tokens: ["background", "foreground"], wide: true },
  { title: "Card & popover", description: "Raised surfaces and the text they carry.", tokens: ["card", "card-foreground", "popover", "popover-foreground"] },
  {
    title: "Primary, secondary, muted & accent",
    description: "The fills that carry actions and emphasis, each with its text colour.",
    tokens: ["primary", "primary-foreground", "secondary", "secondary-foreground", "muted", "muted-foreground", "accent", "accent-foreground"],
  },
  { title: "Destructive", description: "Reserved for deleting, discarding and anything that can't be undone.", tokens: ["destructive"] },
  { title: "Border, input & ring", description: "Hairlines, field outlines and the focus ring.", tokens: ["border", "input", "ring"] },
  { title: "Charts", description: "Five series colours that stay distinct at a glance.", tokens: ["chart-1", "chart-2", "chart-3", "chart-4", "chart-5"] },
  {
    title: "Sidebar",
    description: "The app sidebar's own surface, text and highlight.",
    tokens: ["sidebar", "sidebar-foreground", "sidebar-primary", "sidebar-primary-foreground", "sidebar-accent", "sidebar-accent-foreground", "sidebar-border", "sidebar-ring"],
  },
]

function Swatch({ name, value, wide }: { name: string; value: string; wide?: boolean }) {
  return (
    <div className={`${CHROME_CARD} ${wide ? "sm:col-span-2" : ""}`}>
      <div className="h-24" style={{ background: `var(--${name})` }} title={value} />
      <div className={CHROME_LABEL}>
        <span className="truncate">{name}</span>
        <span className="truncate text-[var(--chrome-fg-muted)]">{value}</span>
      </div>
    </div>
  )
}

export function ColorsView({ tokens, mode }: FoundationProps) {
  const t = normalizeTokens(tokens)
  const colors = t.colors[mode]
  const pairs = CONTRAST_PAIRS.filter(([s, x], i) => CONTRAST_PAIRS.findIndex(([s2, x2]) => s2 === s && x2 === x) === i)
  return (
    <div className="flex flex-col gap-10">
      <Section title="Foreground on background" description="Every text-on-surface pair in the system, checked against WCAG at body text size.">
        <div className="grid min-w-0 grid-cols-1 items-stretch gap-3 min-[480px]:grid-cols-2 min-[800px]:grid-cols-4">
          {pairs.map(([surface, text]) => {
            const ratio = contrastRatio(colors[text], colors[surface], colors.background)
            const level = ratio ? contrastLevel(ratio) : "Fail"
            return (
              <div key={`${surface}-${text}`} className={CHROME_CARD}>
                <div className="flex h-24 items-center justify-center text-sm font-medium" style={{ background: `var(--${surface})`, color: `var(--${text})` }}>
                  {ratio ? ratio.toFixed(2) : "?"} · {level}
                </div>
                <div className={CHROME_LABEL}>
                  <span className="truncate">
                    {surface} / {text}
                  </span>
                </div>
              </div>
            )
          })}
        </div>
      </Section>
      {COLOR_SECTIONS.map((section) => (
        <Section key={section.title} title={section.title} description={section.description}>
          <div className="grid min-w-0 grid-cols-1 items-stretch gap-3 min-[480px]:grid-cols-2 min-[800px]:grid-cols-4">
            {section.tokens.map((token) => (
              <Swatch key={token} name={token} value={colors[token]} wide={section.wide} />
            ))}
          </div>
        </Section>
      ))}
      {(t.customColors ?? []).length > 0 && (
        <Section title="Custom colours" description="Your own colours, used by name as Tailwind classes (bg-success, text-warning).">
          <div className="grid min-w-0 grid-cols-1 items-stretch gap-3 min-[480px]:grid-cols-2 min-[800px]:grid-cols-4">
            {t.customColors!.map((c) => (
              <Swatch key={c.name} name={c.name} value={mode === "dark" ? c.dark : c.light} />
            ))}
          </div>
        </Section>
      )}
    </div>
  )
}

/* ------------------------------------------------------------------ */
/* Typography                                                          */
/* ------------------------------------------------------------------ */

const HEADINGS = [
  ["h1", "text-4xl"],
  ["h2", "text-3xl"],
  ["h3", "text-2xl"],
  ["h4", "text-xl"],
  ["h5", "text-lg"],
] as const

const TEXT_CLASS: Record<string, string> = {
  xs: "text-xs",
  sm: "text-sm",
  base: "text-base",
  lg: "text-lg",
  xl: "text-xl",
  "2xl": "text-2xl",
  "3xl": "text-3xl",
  "4xl": "text-4xl",
  "5xl": "text-5xl",
  "6xl": "text-6xl",
  "7xl": "text-7xl",
  "8xl": "text-8xl",
  "9xl": "text-9xl",
}
const WEIGHT_CLASS: Record<string, string> = {
  thin: "font-thin",
  extralight: "font-extralight",
  light: "font-light",
  normal: "font-normal",
  medium: "font-medium",
  semibold: "font-semibold",
  bold: "font-bold",
  extrabold: "font-extrabold",
  black: "font-black",
}
const TRACKING_CLASS: Record<string, string> = {
  tighter: "tracking-tighter",
  tight: "tracking-tight",
  normal: "tracking-normal",
  wide: "tracking-wide",
  wider: "tracking-wider",
  widest: "tracking-widest",
}

const SAMPLE = "Care that fits around your life"
const PARAGRAPH = "Book a visit, message your care team and see your results in one place. Every screen is built from the same components and tokens, so a change here shows up everywhere."
const GRID_3 = "grid min-w-0 grid-cols-1 items-stretch gap-3 min-[800px]:grid-cols-3"
const GRID_4 = "grid min-w-0 grid-cols-1 items-stretch gap-3 min-[480px]:grid-cols-2 min-[800px]:grid-cols-4"
const STACK = "flex min-w-0 flex-col gap-3"

export function TypographyView({ tokens, mode }: FoundationProps) {
  const t = normalizeTokens(tokens)
  const css = `:root {
  --primary:            ${t.colors[mode].primary};
  --primary-foreground: ${t.colors[mode]["primary-foreground"]};
  --radius:             ${t.radius}rem;
  --spacing:            ${t.spacing}rem;
}`
  return (
    <div className="flex flex-col gap-8">
      <Section title="Font family" description="The three faces the system loads: one for body copy, one for headings and one for code.">
        <div className={GRID_3}>
          {(
            [
              ["Body", "sans", "font-sans"],
              ["Headings", "heading", "font-heading"],
              ["Mono", "mono", "font-mono"],
            ] as const
          ).map(([label, key, cls]) => (
            <Tile key={key} start label={label}>
              <span className="font-mono text-[11px] text-[var(--chrome-fg-muted)]">{t.fonts[key]}</span>
              <span className={`${cls} text-4xl`}>Ag</span>
              <span className={`${cls} text-xs break-all`}>ABCDEFGHIJKLMNOPQRSTUVWXYZ</span>
              <span className={`${cls} text-xs break-all`}>abcdefghijklmnopqrstuvwxyz</span>
              <span className={`${cls} text-xs break-all`}>0123456789 !@#$%^&*()</span>
            </Tile>
          ))}
        </div>
      </Section>
      <Section title="Headings" description="Five steps of the heading scale, each set in the heading face at the size its class names.">
        <div className={STACK}>
          {HEADINGS.map(([tag, cls]) => (
            <Tile key={tag} start label={`${tag} · ${cls}`}>
              <span className={`font-heading ${cls} font-semibold tracking-tight`}>{SAMPLE}</span>
            </Tile>
          ))}
        </div>
      </Section>
      <Section title="Type scale" description="Every text size the components use, each at its own line height.">
        <div className={STACK}>
          {TEXT_STEPS.map((s) => (
            <Tile key={s} start label={`text-${s} · ${t.typeScale![s].size}px / ${t.typeScale![s].lineHeight}px`}>
              <span className={`${TEXT_CLASS[s]} max-w-full truncate`}>{SAMPLE}</span>
            </Tile>
          ))}
        </div>
      </Section>
      <Section title="Body" description="The same paragraph at the four weights body copy uses, each with the number its name maps to.">
        <div className={GRID_4}>
          {(["normal", "medium", "semibold", "bold"] as const).map((w) => (
            <Tile key={w} start label={`font-${w} · ${t.fontWeights![w]}`}>
              <p className={`${WEIGHT_CLASS[w]} text-sm`}>{PARAGRAPH}</p>
            </Tile>
          ))}
        </div>
      </Section>
      <Section title="Mono" description="The code face, on the kind of block the CSS export writes.">
        <Tile start label="font-mono">
          <pre className="font-mono text-xs leading-relaxed whitespace-pre">{css}</pre>
        </Tile>
      </Section>
      <Section title="Tracking" description="The six letter-spacing steps, one line each so they can be compared.">
        <div className={STACK}>
          {TRACKING.map((tr) => (
            <Tile key={tr} start label={`tracking-${tr} · ${t.tracking![tr]}em`}>
              <span className={`${TRACKING_CLASS[tr]} text-lg`}>{SAMPLE}</span>
            </Tile>
          ))}
        </div>
      </Section>
    </div>
  )
}

/* ------------------------------------------------------------------ */
/* Radius                                                              */
/* ------------------------------------------------------------------ */

export function RadiusView({ tokens }: FoundationProps) {
  const t = normalizeTokens(tokens)
  const px = (step: (typeof RADIUS_STEPS)[number]) => {
    const fixed = t.radiusSteps?.[step]
    return Math.round((fixed ?? t.radius * RADIUS_MULTIPLIER[step]) * 16 * 10) / 10
  }
  return (
    <div className="flex flex-col gap-8">
      <Section title="Base value" description="The one value the whole scale is calculated from, and the corner it rounds.">
        <div className="grid min-w-0 grid-cols-1 items-stretch gap-3 min-[480px]:grid-cols-2">
          <Tile corner label={`radius · ${Math.round(t.radius * 16 * 10) / 10}px`}>
            <Corner radius="var(--radius)" />
          </Tile>
        </div>
      </Section>
      <Section title="Radius scale" description="Every step calculated from the base value, from the tightest corner to the roundest.">
        <div className="grid min-w-0 grid-cols-1 items-stretch gap-3 min-[480px]:grid-cols-2 min-[800px]:grid-cols-4">
          {RADIUS_STEPS.map((s) => (
            <Tile corner key={s} label={`radius-${s} · ${px(s)}px${t.radiusSteps?.[s] != null ? " (fixed)" : ""}`}>
              <Corner radius={`var(--radius-${s})`} />
            </Tile>
          ))}
        </div>
      </Section>
      <Section title="In context" description="Components the scale rounds, each label naming the step its style uses.">
        <div className="grid min-w-0 grid-cols-1 items-stretch gap-3 min-[800px]:grid-cols-2">
          <Tile label="Button · rounded-md">
            <Button>Save changes</Button>
            <Button variant="outline">Cancel</Button>
          </Tile>
          <Tile label="Input · rounded-md">
            <Input placeholder="Search projects" className="max-w-xs" />
          </Tile>
          <Tile label="Badge · rounded-md">
            <Badge>New</Badge>
            <Badge variant="secondary">Beta</Badge>
            <Badge variant="outline">Archived</Badge>
          </Tile>
          <Tile label="Checkbox · rounded-sm">
            <Label className="gap-2">
              <Checkbox defaultChecked /> Notify me
            </Label>
          </Tile>
          <Tile label="Switch · rounded-full">
            <Label className="gap-2">
              <Switch defaultChecked /> Auto-reminders
            </Label>
          </Tile>
          <Tile label="Avatar · rounded-full">
            <Avatar>
              <AvatarFallback>JP</AvatarFallback>
            </Avatar>
            <Avatar>
              <AvatarFallback>AK</AvatarFallback>
            </Avatar>
          </Tile>
        </div>
      </Section>
    </div>
  )
}

/** A corner sample: the top-left of a box rounded by the given radius */
function Corner({ radius }: { radius: string }) {
  return <div className="h-14 w-1/2 border-t border-l border-[var(--chrome-fg)] bg-[var(--chrome-surface)]" style={{ borderTopLeftRadius: radius }} />
}

/* ------------------------------------------------------------------ */
/* Shadows                                                             */
/* ------------------------------------------------------------------ */

export function ShadowsView({ tokens, mode }: FoundationProps) {
  const levels = ["none", ...SHADOW_LEVELS] as const
  const surface = "bg-popover text-popover-foreground rounded-lg border"
  return (
    <div className="flex flex-col gap-8">
      <Section title="Elevation ramp" description="Every step, from flat to deepest.">
        <div className="grid min-w-0 grid-cols-1 items-stretch gap-3 min-[800px]:grid-cols-2">
          {levels.map((level) => (
            <Tile
              key={level}
              className="[&>div:first-child]:min-h-36"
              label={
                <>
                  <span>shadow-{level}</span>
                  <span className="block truncate text-[var(--chrome-fg-muted)]">{level === "none" ? "no elevation" : tokens.shadows[mode][level]}</span>
                </>
              }
            >
              <div className="bg-card h-6 w-24 rounded-full" style={{ boxShadow: level === "none" ? "none" : `var(--shadow-${level})` }} />
            </Tile>
          ))}
        </div>
      </Section>
      <Section title="In context" description="The surfaces the ramp lifts, each labelled with the step it uses.">
        <div className="grid min-w-0 grid-cols-1 items-stretch gap-3 min-[800px]:grid-cols-2">
          <Tile label="Toolbar button · shadow-xs">
            <Button variant="outline">Export</Button>
          </Tile>
          <Tile label="Card · shadow-sm">
            <Card className="w-full max-w-60 shadow-sm">
              <CardHeader>
                <CardTitle>Upcoming visit</CardTitle>
                <CardDescription>Tuesday, 10:30 AM</CardDescription>
              </CardHeader>
            </Card>
          </Tile>
          <Tile label="Menu surface · shadow-md">
            <div className={`${surface} flex w-44 flex-col p-1 text-sm shadow-md`}>
              {["Profile", "Appointments", "Sign out"].map((x) => (
                <span key={x} className="rounded-md px-2 py-1.5">
                  {x}
                </span>
              ))}
            </div>
          </Tile>
          <Tile label="Popover · shadow-md">
            <div className={`${surface} w-56 p-3 shadow-md`}>
              <div className="text-sm font-medium">Reminder</div>
              <div className="text-muted-foreground text-xs">We&apos;ll text you a day before.</div>
            </div>
          </Tile>
          <Tile label="Tooltip · shadow-md">
            <span className="bg-foreground text-background rounded-md px-2 py-1 text-xs shadow-md">Copy link</span>
          </Tile>
          <Tile label="Dialog panel · shadow-xl">
            <div className={`${surface} w-64 rounded-xl p-4 shadow-xl`}>
              <div className="font-heading font-semibold">Cancel appointment?</div>
              <div className="text-muted-foreground text-xs">You can book again at any time.</div>
            </div>
          </Tile>
        </div>
      </Section>
    </div>
  )
}

/* ------------------------------------------------------------------ */
/* Spacing                                                             */
/* ------------------------------------------------------------------ */

const SPACING_STEPS = [1, 2, 3, 4, 5, 6, 8, 10, 12, 16, 24, 32]

export function SpacingView({ tokens }: FoundationProps) {
  const px = (n: number) => Math.round(tokens.spacing * n * 16 * 10) / 10
  return (
    <div className="flex flex-col gap-8">
      <Section title="Base unit" description="The one length every padding, gap and size in the system is a multiple of.">
        <div className="grid min-w-0 grid-cols-1 items-stretch gap-3 min-[480px]:grid-cols-2">
          <Tile label={`spacing · ${px(1)}px`}>
            <div className="bg-primary h-6" style={{ width: "var(--spacing)" }} />
          </Tile>
        </div>
      </Section>
      <Section title="Scale" description="The multiples the components use, each bar exactly as wide as its step.">
        <div className={GRID_4}>
          {SPACING_STEPS.map((n) => (
            <Tile key={n} label={`x${n} · ${px(n)}px`}>
              <div className="bg-primary/30 border-primary h-3 border-x" style={{ width: `calc(var(--spacing) * ${n})` }} />
            </Tile>
          ))}
        </div>
      </Section>
      <Section title="In context" description="Two real surfaces at the current density, where the unit reads as padding.">
        <div className="grid min-w-0 grid-cols-1 items-stretch gap-3 min-[800px]:grid-cols-2">
          <Tile label="Form">
            <Card className="w-full max-w-72">
              <CardHeader>
                <CardTitle>Book a visit</CardTitle>
                <CardDescription>Padding and gaps follow the base unit</CardDescription>
              </CardHeader>
              <CardContent className="flex flex-col gap-3">
                <Input placeholder="Reason for visit" />
                <Input placeholder="Preferred date" />
              </CardContent>
              <CardFooter>
                <Button className="w-full">Continue</Button>
              </CardFooter>
            </Card>
          </Tile>
          <Tile label="Toolbar">
            <div className="bg-card flex items-center gap-2 rounded-lg border p-2">
              <Button size="sm" variant="ghost">
                Day
              </Button>
              <Button size="sm" variant="secondary">
                Week
              </Button>
              <Button size="sm" variant="ghost">
                Month
              </Button>
              <Badge variant="secondary">12 visits</Badge>
            </div>
          </Tile>
        </div>
      </Section>
    </div>
  )
}

/* ------------------------------------------------------------------ */
/* Controls                                                            */
/* ------------------------------------------------------------------ */

const fruits = [
  { label: "Choose a plan", value: "plan" },
  { label: "Basic", value: "basic" },
]

export function ControlsView({ tokens }: FoundationProps) {
  const t = normalizeTokens(tokens)
  const heights = t.controls!.heights
  const f = t.controls!.focus
  const focusLabel = `${f.style === "outline" ? "outline" : "ring"} · ${f.width}px · ${f.strength}%`
  return (
    <div className="flex flex-col gap-10">
      <Section title="Heights" description="One height per size. Every control at that size uses it, so buttons and inputs next to each other always line up.">
        <div className="flex flex-col gap-3">
          {CONTROL_SIZES.map((size) => (
            <div key={size} className="border border-[var(--chrome-line)] bg-[var(--chrome-card)] text-[var(--chrome-fg)] overflow-hidden rounded-xl">
              <div className="relative flex min-h-24 flex-wrap items-center justify-center gap-3 p-5">
                <div
                  className="border-primary/40 pointer-events-none absolute inset-x-0 top-1/2 -translate-y-1/2 border-y border-dashed"
                  style={{ height: heights[size] }}
                />
                <Button size={size}>Save changes</Button>
                <Button size={size} variant="outline">
                  Cancel
                </Button>
                {size === "default" && <Input placeholder="Search projects" className="w-44" />}
                {size === "default" && (
                  <InputGroup className="w-44">
                    <InputGroupInput placeholder="Filter members" />
                    <InputGroupAddon>
                      <Icon icon={Search01Icon} />
                    </InputGroupAddon>
                  </InputGroup>
                )}
                {(size === "default" || size === "sm") && (
                  <Select items={fruits} defaultValue="plan">
                    <SelectTrigger size={size} className="w-36">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {fruits.map((f) => (
                        <SelectItem key={f.value} value={f.value}>
                          {f.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                )}
                {(size === "default" || size === "sm") && (
                  <NativeSelect size={size} defaultValue="name">
                    <NativeSelectOption value="name">Sort by name</NativeSelectOption>
                  </NativeSelect>
                )}
                {size !== "xs" && (
                  <Toggle size={size} variant="outline" aria-label="Bold" defaultPressed>
                    B
                  </Toggle>
                )}
              </div>
              <div className={CHROME_LABEL}>
                <span className="truncate">
                  {size} · {heights[size]}px · h-{heights[size] / 4}
                </span>
              </div>
            </div>
          ))}
        </div>
      </Section>
      <Section title="In a row" description="A form row at the default size. Everything shares the default height, so the row lines up.">
        <Tile label={`Input · Select · Button · ${heights.default}px`}>
          <div className="flex flex-wrap items-end gap-2">
            <Field className="w-40">
              <FieldLabel htmlFor="ctl-name">Name</FieldLabel>
              <Input id="ctl-name" placeholder="Jane" />
            </Field>
            <Select items={fruits} defaultValue="basic">
              <SelectTrigger className="w-32">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {fruits.map((f) => (
                  <SelectItem key={f.value} value={f.value}>
                    {f.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Button>Add</Button>
          </div>
        </Tile>
      </Section>
      <Section title="Focus" description="What every control shows when you tab to it: the same ring or outline on all of them.">
        <div className="grid min-w-0 grid-cols-1 items-stretch gap-3 min-[800px]:grid-cols-2">
          <Tile label={`Button · ${focusLabel}`}>
            <Button>Focus me</Button>
          </Tile>
          <Tile label={`Input · ${focusLabel}`}>
            <Input placeholder="Then me" className="w-44" />
          </Tile>
        </div>
      </Section>
    </div>
  )
}

/* ------------------------------------------------------------------ */
/* Icons                                                               */
/* ------------------------------------------------------------------ */

const ICON_PACKAGES: Record<string, string> = {
  hugeicons: "@hugeicons/react + @hugeicons/core-free-icons",
  lucide: "lucide-react",
  tabler: "@tabler/icons-react",
  phosphor: "@phosphor-icons/react",
}

const ROLES: { name: string; icons: IconName[] }[] = [
  { name: "Navigation", icons: [Home01Icon, Menu01Icon, Search01Icon, Settings02Icon, UserIcon] },
  { name: "Actions", icons: [Add01Icon, Edit02Icon, Delete02Icon, Copy01Icon, Download01Icon] },
  { name: "Status", icons: [CheckmarkCircle02Icon, Alert02Icon, InformationCircleIcon, Notification03Icon, Loading03Icon] },
  { name: "Files", icons: [File01Icon, FileAttachmentIcon, Folder01Icon, Image01Icon, Pdf01Icon] },
  { name: "Arrows", icons: [ArrowLeft01Icon, ArrowRight01Icon, ArrowUp01Icon, ArrowDown01Icon, Calendar03Icon] },
]

export function IconsView({ tokens }: FoundationProps) {
  const t = normalizeTokens(tokens)
  return (
    <div className="flex flex-col gap-10">
      <Section title="Icon library" description="The set every icon in the system is drawn from, and the packages it installs.">
        <Tile label={`${ICON_LIBRARIES.find((l) => l.id === t.icons!.library)?.name ?? "HugeIcons"} · ${ICON_PACKAGES[t.icons!.library] ?? ""} · stroke ${t.icons!.strokeWidth}`}>
          <div className="flex flex-wrap gap-3 [&_svg]:size-5">
            {ROLES.flatMap((r) => r.icons)
              .slice(0, 14)
              .map((icon, i) => (
                <Icon key={i} icon={icon} />
              ))}
          </div>
        </Tile>
      </Section>
      <Section title="Roles" description="The jobs an app asks icons to do, five at a time, in the chosen library.">
        <div className="grid min-w-0 grid-cols-1 items-stretch gap-3 min-[480px]:grid-cols-2 min-[800px]:grid-cols-3">
          {ROLES.map((r) => (
            <Tile key={r.name} label={r.name}>
              <div className="flex gap-3 [&_svg]:size-5">
                {r.icons.map((icon, i) => (
                  <Icon key={i} icon={icon} />
                ))}
              </div>
            </Tile>
          ))}
        </div>
      </Section>
      <Section title="In context" description="Real components drawing their own icons.">
        <div className="grid min-w-0 grid-cols-1 items-stretch gap-3 min-[800px]:grid-cols-2">
          <Tile label="Menu">
            <div className="bg-popover text-popover-foreground flex w-48 flex-col rounded-lg border p-1 text-sm shadow-md [&_svg]:size-4">
              {(
                [
                  [UserIcon, "Profile"],
                  [Settings02Icon, "Settings"],
                  [Notification03Icon, "Notifications"],
                ] as const
              ).map(([icon, label]) => (
                <span key={label} className="flex items-center gap-2 rounded-md px-2 py-1.5">
                  <Icon icon={icon} /> {label}
                </span>
              ))}
            </div>
          </Tile>
          <Tile label="Input">
            <InputGroup className="max-w-xs">
              <InputGroupInput placeholder="Search components…" />
              <InputGroupAddon>
                <Icon icon={Search01Icon} />
              </InputGroupAddon>
            </InputGroup>
          </Tile>
          <Tile label="Alert">
            <Alert className="max-w-xs">
              <Icon icon={Alert02Icon} />
              <AlertTitle>Not every icon has an equivalent</AlertTitle>
            </Alert>
          </Tile>
          <Tile label="Pagination">
            <Pagination>
              <PaginationContent>
                <PaginationItem>
                  <PaginationPrevious href="#" />
                </PaginationItem>
                <PaginationItem>
                  <PaginationLink href="#" isActive>
                    1
                  </PaginationLink>
                </PaginationItem>
                <PaginationItem>
                  <PaginationEllipsis />
                </PaginationItem>
                <PaginationItem>
                  <PaginationNext href="#" />
                </PaginationItem>
              </PaginationContent>
            </Pagination>
          </Tile>
        </div>
      </Section>
    </div>
  )
}

/* ------------------------------------------------------------------ */
/* Brand                                                               */
/* ------------------------------------------------------------------ */

export function BrandLogo({ tokens, mode, assetUrl, kind = "logo" }: FoundationProps & { kind?: "logo" | "mark" }) {
  const b = normalizeTokens(tokens).brand!
  const light = kind === "logo" ? b.logoLight : b.markLight
  const dark = kind === "logo" ? b.logoDark : b.markDark
  const height = kind === "logo" ? b.logoHeight : b.markHeight
  const src = mode === "dark" ? dark ?? (b.darkFallback === "light" ? light : undefined) : light
  const url = assetUrl(src)
  if (!url) return <span className="font-heading text-lg font-semibold">{tokens.name}</span>
  // eslint-disable-next-line @next/next/no-img-element -- static SVG brand asset
  return <img src={url} alt={tokens.name} style={{ height }} className="w-auto" />
}

export function BrandView(props: FoundationProps) {
  const { tokens, assetUrl } = props
  const b = normalizeTokens(tokens).brand!
  const filled = [b.logoLight, b.markLight, b.favicon].filter(Boolean).length
  return (
    <div className="flex flex-col gap-10">
      <Section title="Brand assets" description={`The files the system ships with. ${filled} of 3 filled.`}>
        <div className="grid gap-4 md:grid-cols-3">
          <Tile label="Logo">
            <BrandLogo {...props} />
          </Tile>
          <Tile label="Mark">
            {b.markLight ? <BrandLogo {...props} kind="mark" /> : <span className="text-muted-foreground text-sm">No mark yet</span>}
          </Tile>
          <Tile label="Favicon">
            {assetUrl(b.favicon) ? (
              // eslint-disable-next-line @next/next/no-img-element -- static SVG brand asset
              <img src={assetUrl(b.favicon)} alt="Favicon" className="size-12 rounded-md border" />
            ) : (
              <span className="text-muted-foreground text-sm">No favicon</span>
            )}
          </Tile>
        </div>
      </Section>
      <Section title="In context" description="Where the brand actually shows up.">
        <div className="flex flex-col gap-4">
          <div className="border border-[var(--chrome-line)] bg-[var(--chrome-card)] text-[var(--chrome-fg)] overflow-hidden rounded-xl">
            <div className="flex items-center gap-6 border-b px-5 py-3">
              <BrandLogo {...props} />
              <nav className="text-muted-foreground flex gap-4 text-sm">
                <span className="text-foreground font-medium">Overview</span>
                <span>Appointments</span>
                <span>Messages</span>
              </nav>
              <div className="ml-auto flex items-center gap-2">
                <Badge variant="secondary">Pro</Badge>
                <div className="bg-muted flex size-8 items-center justify-center rounded-full text-xs font-medium">CI</div>
              </div>
            </div>
            <div className="text-muted-foreground px-5 py-2 font-mono text-[11px]">Header</div>
          </div>
          <div className="border border-[var(--chrome-line)] bg-[var(--chrome-card)] text-[var(--chrome-fg)] flex justify-center rounded-xl p-8">
            <Card className="w-full max-w-sm">
              <CardHeader className="items-center text-center">
                <div className="flex justify-center pb-2">
                  <BrandLogo {...props} />
                </div>
                <CardTitle>Sign in to {tokens.name}</CardTitle>
                <CardDescription>Use your patient portal account</CardDescription>
              </CardHeader>
              <CardContent className="flex flex-col gap-3">
                <Input placeholder="Email" />
                <Input placeholder="Password" type="password" />
              </CardContent>
              <CardFooter>
                <Button className="w-full">Sign in</Button>
              </CardFooter>
            </Card>
          </div>
          <div className="bg-card flex w-80 items-center gap-2 rounded-t-lg border px-3 py-2">
            {assetUrl(b.favicon) && (
              // eslint-disable-next-line @next/next/no-img-element -- static SVG brand asset
              <img src={assetUrl(b.favicon)} alt="" className="size-4" />
            )}
            <span className="truncate text-xs">{tokens.name} design system</span>
            <span className="text-muted-foreground ml-auto text-xs">×</span>
          </div>
        </div>
      </Section>
    </div>
  )
}

/* ------------------------------------------------------------------ */
/* Style (menus)                                                       */
/* ------------------------------------------------------------------ */

type Classes = Record<string, { slots: Record<string, string[]> }>
const slotClass = (component: string, slot: string) => ((classes as Classes)[component]?.slots?.[slot] ?? []).join(" ")

/** A static copy of the real dropdown menu (same slots and classes), so menu styles can be seen without opening one */
export function MenuPreview() {
  return (
    <div
      data-slot="dropdown-menu-content"
      className={`${slotClass("dropdown-menu", "dropdown-menu-content")} relative w-56`}
      style={{ position: "relative" }}
    >
      <div data-slot="dropdown-menu-label" className={slotClass("dropdown-menu", "dropdown-menu-label")}>
        My account
      </div>
      {["Profile", "Billing", "Settings"].map((item, i) => (
        <div
          key={item}
          data-slot="dropdown-menu-item"
          data-highlighted={i === 1 ? "" : undefined}
          className={slotClass("dropdown-menu", "dropdown-menu-item")}
        >
          {item}
        </div>
      ))}
      <div data-slot="dropdown-menu-separator" className={slotClass("dropdown-menu", "dropdown-menu-separator")} />
      <div data-slot="dropdown-menu-item" className={slotClass("dropdown-menu", "dropdown-menu-item")}>
        Log out
      </div>
    </div>
  )
}
