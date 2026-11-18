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
import { Toggle } from "@/components/ui/toggle"
import { contrastLevel, contrastRatio } from "@/lib/ds/color"
import {
  COLOR_GROUPS,
  CONTROL_SIZES,
  RADIUS_MULTIPLIER,
  RADIUS_STEPS,
  SHADOW_LEVELS,
  TEXT_STEPS,
  TRACKING,
  WEIGHTS,
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
    <section className="flex flex-col gap-4">
      <div>
        <h2 className="font-heading text-xl font-semibold tracking-tight">{title}</h2>
        {description && <p className="text-muted-foreground max-w-2xl text-sm">{description}</p>}
      </div>
      {children}
    </section>
  )
}

function Tile({ label, children, className }: { label: React.ReactNode; children: React.ReactNode; className?: string }) {
  return (
    <div className={`bg-card flex min-w-0 flex-col overflow-hidden rounded-xl border ${className ?? ""}`}>
      <div className="flex min-h-24 flex-1 items-center justify-center p-5">{children}</div>
      <div className="text-muted-foreground border-t px-4 py-2 font-mono text-[11px]">{label}</div>
    </div>
  )
}

/* ------------------------------------------------------------------ */
/* Colours                                                             */
/* ------------------------------------------------------------------ */

export function ColorsView({ tokens, mode }: FoundationProps) {
  const t = normalizeTokens(tokens)
  const colors = t.colors[mode]
  return (
    <div className="flex flex-col gap-10">
      {COLOR_GROUPS.map((group) => (
        <Section key={group.id} title={group.label} description={group.description}>
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
            {group.tokens.map(({ token, label }) => (
              <div key={token} className="flex flex-col gap-2">
                <div className="h-20 rounded-lg border" style={{ background: `var(--${token})` }} title={colors[token]} />
                <div className="text-sm font-medium">{label}</div>
                <div className="text-muted-foreground font-mono text-xs break-all">{colors[token]}</div>
              </div>
            ))}
          </div>
          {group.pairs && group.pairs.length > 0 && (
            <div className="flex flex-wrap gap-3">
              {group.pairs.map(([surface, text]) => {
                const ratio = contrastRatio(colors[text], colors[surface], colors.background)
                const level = ratio ? contrastLevel(ratio) : "Fail"
                return (
                  <div
                    key={`${surface}-${text}`}
                    className="flex items-center gap-3 rounded-lg border px-3 py-2"
                    style={{ background: `var(--${surface})`, color: `var(--${text})` }}
                  >
                    <span className="text-lg font-semibold">Aa</span>
                    <span className="text-xs">
                      {text} on {surface}
                    </span>
                    <span className="rounded bg-black/70 px-1.5 py-0.5 font-mono text-[11px] text-white">
                      {ratio ? ratio.toFixed(2) : "?"} · {level}
                    </span>
                  </div>
                )
              })}
            </div>
          )}
        </Section>
      ))}
      {(t.customColors ?? []).length > 0 && (
        <Section title="Custom colours" description="Your own colours. Use them as Tailwind classes, e.g. bg-success or text-warning.">
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
            {t.customColors!.map((c) => (
              <div key={c.name} className="flex flex-col gap-2">
                <div className="h-20 rounded-lg border" style={{ background: `var(--${c.name})` }} />
                <div className="text-sm font-medium">{c.name}</div>
                <div className="text-muted-foreground font-mono text-xs break-all">{mode === "dark" ? c.dark : c.light}</div>
              </div>
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

export function TypographyView({ tokens }: FoundationProps) {
  const t = normalizeTokens(tokens)
  return (
    <div className="flex flex-col gap-10">
      <Section title="Font families" description="One face for body copy, one for headings and one for code.">
        <div className="grid gap-4 md:grid-cols-3">
          {(
            [
              ["Body", "sans", "font-sans"],
              ["Headings", "heading", "font-heading"],
              ["Code", "mono", "font-mono"],
            ] as const
          ).map(([label, key, cls]) => (
            <div key={key} className="bg-card flex min-w-0 flex-col gap-2 overflow-hidden rounded-xl border p-5">
              <div className="text-muted-foreground text-xs font-medium tracking-wide uppercase">{label}</div>
              <div className={`${cls} text-4xl`}>Ag</div>
              <div className={`${cls} text-lg`}>{t.fonts[key]}</div>
              <div className={`${cls} text-muted-foreground text-sm break-all`}>ABCDEFGHIJKLMNOPQRSTUVWXYZ abcdefghijklmnopqrstuvwxyz 0123456789</div>
            </div>
          ))}
        </div>
      </Section>
      <Section title="Headings" description="Each heading level in the heading face.">
        <div className="flex flex-col gap-3">
          {HEADINGS.map(([tag, cls]) => (
            <Tile key={tag} label={`${tag} · ${cls}`} className="[&>div:first-child]:justify-start">
              <div className={`font-heading ${cls} font-semibold tracking-tight`}>Care that fits your life</div>
            </Tile>
          ))}
        </div>
      </Section>
      <Section title="Type scale" description="Every text size, each with its own line height.">
        <div className="flex flex-col divide-y rounded-xl border">
          {TEXT_STEPS.map((s) => (
            <div key={s} className="flex items-baseline gap-6 overflow-hidden px-5 py-3">
              <div className="text-muted-foreground w-36 shrink-0 font-mono text-xs">
                text-{s} · {t.typeScale![s].size}/{t.typeScale![s].lineHeight}px
              </div>
              <div className={`${TEXT_CLASS[s]} truncate`}>Care that fits your life</div>
            </div>
          ))}
        </div>
      </Section>
      <Section title="Weights">
        <div className="grid grid-cols-3 gap-3 lg:grid-cols-5">
          {WEIGHTS.map((w) => (
            <Tile key={w} label={`font-${w} · ${t.fontWeights![w]}`}>
              <span className={`${WEIGHT_CLASS[w]} text-3xl`}>Aa</span>
            </Tile>
          ))}
        </div>
      </Section>
      <Section title="Letter spacing">
        <div className="flex flex-col divide-y rounded-xl border">
          {TRACKING.map((tr) => (
            <div key={tr} className="flex items-baseline gap-6 px-5 py-3">
              <div className="text-muted-foreground w-36 shrink-0 font-mono text-xs">
                tracking-{tr} · {t.tracking![tr]}em
              </div>
              <div className={`${TRACKING_CLASS[tr]} text-lg`}>Design systems that last</div>
            </div>
          ))}
        </div>
      </Section>
    </div>
  )
}

/* ------------------------------------------------------------------ */
/* Radius                                                              */
/* ------------------------------------------------------------------ */

const RADIUS_CLASS: Record<string, string> = {
  sm: "rounded-sm",
  md: "rounded-md",
  lg: "rounded-lg",
  xl: "rounded-xl",
  "2xl": "rounded-2xl",
  "3xl": "rounded-3xl",
  "4xl": "rounded-4xl",
}

export function RadiusView({ tokens }: FoundationProps) {
  const t = normalizeTokens(tokens)
  const px = (step: (typeof RADIUS_STEPS)[number]) => {
    const fixed = t.radiusSteps?.[step]
    return Math.round((fixed ?? t.radius * RADIUS_MULTIPLIER[step]) * 16 * 10) / 10
  }
  return (
    <div className="flex flex-col gap-10">
      <Section title="Base value" description="The one value the whole scale is calculated from.">
        <Tile label={`--radius · ${Math.round(t.radius * 16 * 10) / 10}px`} className="max-w-sm">
          <div className="bg-muted border-foreground/60 h-20 w-40 border-t-2 border-l-2" style={{ borderTopLeftRadius: "var(--radius)" }} />
        </Tile>
      </Section>
      <Section title="Radius scale" description="Every step, from the tightest corner to the roundest.">
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
          {RADIUS_STEPS.map((s) => (
            <Tile key={s} label={`rounded-${s} · ${px(s)}px${t.radiusSteps?.[s] != null ? " (fixed)" : ""}`}>
              <div className={`bg-primary/15 border-primary h-16 w-full border-2 ${RADIUS_CLASS[s]}`} />
            </Tile>
          ))}
        </div>
      </Section>
      <Section title="In context" description="Components using the scale.">
        <div className="grid gap-4 md:grid-cols-2">
          <Tile label="Button">
            <div className="flex gap-2">
              <Button>Save changes</Button>
              <Button variant="outline">Cancel</Button>
            </div>
          </Tile>
          <Tile label="Input">
            <Input placeholder="Search projects" className="max-w-xs" />
          </Tile>
          <Tile label="Badge">
            <div className="flex gap-2">
              <Badge>New</Badge>
              <Badge variant="secondary">Beta</Badge>
              <Badge variant="outline">Archived</Badge>
            </div>
          </Tile>
          <Tile label="Checkbox">
            <Label className="gap-2">
              <Checkbox defaultChecked /> Notify me
            </Label>
          </Tile>
          <Tile label="Card" className="md:col-span-2">
            <Card className="w-full max-w-sm">
              <CardHeader>
                <CardTitle>Upcoming visit</CardTitle>
                <CardDescription>Tuesday, 10:30 AM</CardDescription>
              </CardHeader>
            </Card>
          </Tile>
        </div>
      </Section>
    </div>
  )
}

/* ------------------------------------------------------------------ */
/* Shadows                                                             */
/* ------------------------------------------------------------------ */

export function ShadowsView({ tokens, mode }: FoundationProps) {
  return (
    <div className="flex flex-col gap-10">
      <Section title="Elevation ramp" description="Every shadow step, from subtle to strong.">
        <div className="grid grid-cols-2 gap-8 p-2 sm:grid-cols-3 lg:grid-cols-4">
          {SHADOW_LEVELS.map((level) => (
            <div key={level} className="flex flex-col gap-3">
              <div className="bg-card h-24 rounded-xl" style={{ boxShadow: `var(--shadow-${level})` }} />
              <div className="text-sm font-medium">shadow-{level}</div>
              <div className="text-muted-foreground font-mono text-[11px] break-all">{tokens.shadows[mode][level]}</div>
            </div>
          ))}
        </div>
      </Section>
      <Section title="In context">
        <div className="grid gap-6 p-2 md:grid-cols-2">
          <Card className="shadow-sm">
            <CardHeader>
              <CardTitle>Card · shadow-sm</CardTitle>
              <CardDescription>Resting surfaces</CardDescription>
            </CardHeader>
          </Card>
          <div className="bg-popover text-popover-foreground rounded-lg border p-4 shadow-md">
            <div className="text-sm font-medium">Popover · shadow-md</div>
            <div className="text-muted-foreground text-sm">Floating menus and tooltips</div>
          </div>
          <div className="bg-popover text-popover-foreground rounded-xl border p-6 shadow-xl md:col-span-2">
            <div className="font-heading text-lg font-semibold">Dialog · shadow-xl</div>
            <div className="text-muted-foreground text-sm">The highest surfaces</div>
          </div>
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
  return (
    <div className="flex flex-col gap-10">
      <Section title="Base unit" description="Every padding, gap and size in the system is a multiple of it.">
        <Tile label={`--spacing · ${Math.round(tokens.spacing * 16 * 100) / 100}px`} className="max-w-xs">
          <div className="bg-primary h-6" style={{ width: "var(--spacing)" }} />
        </Tile>
      </Section>
      <Section title="Scale">
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
          {SPACING_STEPS.map((n) => (
            <Tile key={n} label={`×${n} · ${Math.round(tokens.spacing * n * 16 * 10) / 10}px`}>
              <div className="bg-primary/30 border-primary h-3 border-x" style={{ width: `calc(var(--spacing) * ${n})` }} />
            </Tile>
          ))}
        </div>
      </Section>
      <Section title="In context" description="Real surfaces at the current density.">
        <div className="grid gap-4 md:grid-cols-2">
          <Card>
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
          <div className="flex flex-col gap-2">
            {["Annual check-up", "Lab work", "Follow-up"].map((t) => (
              <div key={t} className="bg-card flex items-center justify-between rounded-lg border px-4 py-3 text-sm">
                {t}
                <Badge variant="secondary">Open</Badge>
              </div>
            ))}
          </div>
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
  return (
    <div className="flex flex-col gap-10">
      <Section title="Heights" description="One height per size. Every control at that size uses it, so buttons and inputs next to each other always line up.">
        <div className="flex flex-col gap-3">
          {CONTROL_SIZES.map((size) => (
            <div key={size} className="bg-card overflow-hidden rounded-xl border">
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
              <div className="text-muted-foreground border-t px-4 py-2 font-mono text-[11px]">
                {size} · {heights[size]}px
              </div>
            </div>
          ))}
        </div>
      </Section>
      <Section title="In a row" description="A form row at the default size.">
        <Tile label="default">
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
      <Section title="Focus" description="Tab through these to see the focus style.">
        <Tile label={`focus · ${t.controls!.focus.style}`}>
          <div className="flex flex-wrap gap-3">
            <Button>Focus me</Button>
            <Input placeholder="Then me" className="w-40" />
            <Checkbox />
          </div>
        </Tile>
      </Section>
    </div>
  )
}

/* ------------------------------------------------------------------ */
/* Icons                                                               */
/* ------------------------------------------------------------------ */

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
      <Section title="Icon library" description="The set every icon in the system comes from.">
        <Tile label={`${ICON_LIBRARIES.find((l) => l.id === t.icons!.library)?.name ?? "HugeIcons"} · stroke ${t.icons!.strokeWidth}`}>
          <div className="flex flex-wrap gap-3 [&_svg]:size-5">
            {ROLES.flatMap((r) => r.icons)
              .slice(0, 14)
              .map((icon, i) => (
                <Icon key={i} icon={icon} />
              ))}
          </div>
        </Tile>
      </Section>
      <Section title="Roles" description="The jobs an app asks icons to do, five at a time.">
        <div className="grid grid-cols-2 gap-4 lg:grid-cols-3">
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
      <Section title="In context" description="Components drawing their own icons.">
        <div className="grid gap-4 md:grid-cols-2">
          <Tile label="Button">
            <div className="flex gap-2">
              <Button>
                <Icon icon={Add01Icon} data-icon="inline-start" /> New visit
              </Button>
              <Button variant="outline" size="icon" aria-label="Settings">
                <Icon icon={Settings02Icon} />
              </Button>
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
          <div className="bg-card overflow-hidden rounded-xl border">
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
          <div className="bg-muted/40 flex justify-center rounded-xl border p-8">
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
