"use client"

import * as React from "react"

import { ADAPTERS } from "@/lib/ds/adapters"
import { BASE_COLORS, applyBaseColor } from "@/lib/ds/base-colors"
import { contrastLevel, contrastRatio, formatOklch, getAlpha, hexToRgb, parseColor, rgbToOklch, toHex, withAlpha, withHex } from "@/lib/ds/color"
import { FONT_OPTIONS, type FontCategory } from "@/lib/ds/fonts"
import {
  Alert02Icon,
  ArrowRight01Icon,
  Calendar03Icon,
  CheckmarkCircle02Icon,
  HugeiconsIcon,
  ICON_LIBRARIES,
  Search01Icon,
  Settings02Icon,
  UserIcon,
  type IconLibrary,
} from "@/lib/ds/icons"
import {
  COLOR_GROUPS,
  CONTRAST_PAIRS,
  CONTROL_COMPONENTS,
  CONTROL_SIZES,
  LINT_PRESETS,
  LINT_RULES,
  RADIUS_MULTIPLIER,
  RADIUS_STEPS,
  SHADOW_LEVELS,
  TEXT_STEPS,
  TRACKING,
  WEIGHTS,
  normalizeTokens,
  type ColorToken,
  type DesignTokens,
  type FontTokens,
  type LintLevel,
  type Mode,
  type ShadowLevel,
} from "@/lib/ds/types"

import { ChromeButton, cx, FieldRow, Icons, PanelSection, RangeInput, Segmented, SelectInput, TextInput } from "./chrome"

export interface InspectorProps {
  tokens: DesignTokens
  mode: Mode
  setMode: (m: Mode) => void
  update: (path: string, value: unknown, key?: string) => void
  updateMany: (changes: [string, unknown][], key?: string) => void
  isLocked: (path: string) => boolean
  toggleLock: (path: string) => void
}

/* ------------------------------------------------------------------ */
/* Shared bits                                                         */
/* ------------------------------------------------------------------ */

export function LockButton({ path, isLocked, toggleLock }: { path: string } & Pick<InspectorProps, "isLocked" | "toggleLock">) {
  const locked = isLocked(path)
  const Icon = locked ? Icons.lock : Icons.unlock
  return (
    <button
      type="button"
      onClick={() => toggleLock(path)}
      title={locked ? "Locked: click to unlock" : "Lock this value"}
      aria-label={locked ? `Unlock ${path}` : `Lock ${path}`}
      aria-pressed={locked}
      className={cx(
        "inline-flex size-6 shrink-0 items-center justify-center rounded-[5px] transition-colors",
        locked ? "bg-amber-100 text-amber-700" : "text-zinc-300 hover:bg-zinc-100 hover:text-zinc-600"
      )}
    >
      <Icon width={13} height={13} />
    </button>
  )
}

/** Text field that only commits valid values, on Enter or blur */
export function CommitInput({
  value,
  onCommit,
  validate,
  ...props
}: Omit<React.InputHTMLAttributes<HTMLInputElement>, "value" | "onChange"> & {
  value: string
  onCommit: (v: string) => void
  validate?: (v: string) => boolean
}) {
  const [draft, setDraft] = React.useState(value)
  const [invalid, setInvalid] = React.useState(false)
  // Reset the draft when the value changes from outside (undo, import, colour picker)
  const [prevValue, setPrevValue] = React.useState(value)
  if (value !== prevValue) {
    setPrevValue(value)
    setDraft(value)
    setInvalid(false)
  }
  const commit = () => {
    const v = draft.trim()
    if (v === value) return
    if (validate && !validate(v)) {
      setInvalid(true)
      return
    }
    setInvalid(false)
    onCommit(v)
  }
  return (
    <TextInput
      {...props}
      value={draft}
      aria-invalid={invalid}
      className={cx(props.className, invalid && "border-red-400 focus:border-red-500 focus:ring-red-500/20")}
      onChange={(e) => setDraft(e.target.value)}
      onBlur={commit}
      onKeyDown={(e) => {
        if (e.key === "Enter") {
          commit()
          ;(e.target as HTMLInputElement).blur()
        }
        if (e.key === "Escape") {
          setDraft(value)
          setInvalid(false)
        }
      }}
    />
  )
}

export function ModeTabs({ mode, setMode }: Pick<InspectorProps, "mode" | "setMode">) {
  return (
    <Segmented
      value={mode}
      onChange={setMode}
      className="w-full [&>button]:flex-1"
      options={[
        {
          value: "light",
          label: (
            <>
              <Icons.sun width={13} height={13} /> Light
            </>
          ),
        },
        {
          value: "dark",
          label: (
            <>
              <Icons.moon width={13} height={13} /> Dark
            </>
          ),
        },
      ]}
    />
  )
}

function ContrastBadge({ ratio }: { ratio: number | null }) {
  if (ratio == null) return null
  const level = contrastLevel(ratio)
  return (
    <span
      className={cx(
        "inline-flex items-center rounded-[4px] px-1.5 py-0.5 font-mono text-[10px] font-medium",
        level === "Fail" && "bg-red-100 text-red-700",
        level === "AA Large" && "bg-amber-100 text-amber-800",
        (level === "AA" || level === "AAA") && "bg-emerald-100 text-emerald-800"
      )}
      title={`Contrast ${ratio.toFixed(2)}:1 (${level})`}
    >
      {ratio.toFixed(1)} {level}
    </span>
  )
}

const CHECKER =
  "linear-gradient(45deg,#e4e4e7 25%,transparent 25%),linear-gradient(-45deg,#e4e4e7 25%,transparent 25%),linear-gradient(45deg,transparent 75%,#e4e4e7 75%),linear-gradient(-45deg,transparent 75%,#e4e4e7 75%)"

/** Colour swatch + native picker + value field + opacity */
export function ColorField({
  label,
  sublabel,
  value,
  onChange,
  disabled,
  lock,
}: {
  label: string
  sublabel?: string
  value: string
  onChange: (v: string, key?: string) => void
  disabled?: boolean
  lock?: React.ReactNode
}) {
  const alpha = getAlpha(value)
  return (
    <div className="flex flex-col gap-1.5">
      <div className="flex items-center gap-2">
        <label
          className={cx("relative size-8 shrink-0 overflow-hidden rounded-[6px] border border-zinc-200", disabled ? "cursor-not-allowed" : "cursor-pointer")}
          title={disabled ? "Locked" : "Pick a colour"}
          style={{ backgroundImage: CHECKER, backgroundSize: "8px 8px", backgroundPosition: "0 0,0 4px,4px -4px,-4px 0" }}
        >
          <span className="absolute inset-0" style={{ background: value }} />
          <input
            type="color"
            disabled={disabled}
            aria-label={`${label} colour`}
            className="absolute inset-0 size-full cursor-pointer opacity-0 disabled:cursor-not-allowed"
            value={toHex(value)}
            onChange={(e) => onChange(withHex(value, e.target.value), `color:${label}`)}
          />
        </label>
        <div className="flex min-w-0 flex-1 flex-col">
          <div className="truncate text-[12px] font-medium text-zinc-800">{label}</div>
          {sublabel && <div className="truncate font-mono text-[10px] text-zinc-400">{sublabel}</div>}
        </div>
        {lock}
      </div>
      <div className="flex items-center gap-1.5">
        <CommitInput
          value={value}
          disabled={disabled}
          className="h-7 font-mono text-[11px]"
          aria-label={`${label} value`}
          validate={(v) => parseColor(v) != null}
          onCommit={(v) => {
            const rgb = parseColor(v)
            if (!rgb) return
            onChange(v.trim().toLowerCase().startsWith("oklch") ? v : formatOklch(rgbToOklch(rgb)))
          }}
        />
        <CommitInput
          value={String(Math.round(alpha * 100))}
          disabled={disabled}
          className="h-7 w-14 shrink-0 text-right font-mono text-[11px]"
          aria-label={`${label} opacity percent`}
          title="Opacity %"
          validate={(v) => /^\d{1,3}$/.test(v) && Number(v) <= 100}
          onCommit={(v) => onChange(withAlpha(value, Number(v) / 100))}
        />
      </div>
    </div>
  )
}

function NumberField({
  value,
  onCommit,
  unit,
  disabled,
  placeholder,
  label,
  min = -10000,
  max = 10000,
  allowEmpty,
}: {
  value: number | undefined
  onCommit: (v: number | undefined) => void
  unit?: string
  disabled?: boolean
  placeholder?: string
  label: string
  min?: number
  max?: number
  allowEmpty?: boolean
}) {
  return (
    <div className="flex items-center gap-1">
      <CommitInput
        value={value == null ? "" : String(value)}
        placeholder={placeholder}
        disabled={disabled}
        aria-label={label}
        className="h-7 text-right font-mono text-[12px]"
        validate={(v) => (v === "" ? !!allowEmpty : !Number.isNaN(Number(v)) && Number(v) >= min && Number(v) <= max)}
        onCommit={(v) => onCommit(v === "" ? undefined : Number(v))}
      />
      {unit && <span className="w-6 shrink-0 text-[11px] text-zinc-500">{unit}</span>}
    </div>
  )
}

/* ------------------------------------------------------------------ */
/* Colours                                                             */
/* ------------------------------------------------------------------ */

function ColorRow({ token, label, props }: { token: ColorToken; label: string; props: InspectorProps }) {
  const { tokens, mode, update, isLocked } = props
  const path = `colors.${mode}.${token}`
  return (
    <ColorField
      label={label}
      sublabel={`--${token}`}
      value={tokens.colors[mode][token]}
      disabled={isLocked(path)}
      onChange={(v, key) => update(path, v, key ? path : undefined)}
      lock={<LockButton path={path} isLocked={isLocked} toggleLock={props.toggleLock} />}
    />
  )
}

function CustomColors(props: InspectorProps) {
  const t = normalizeTokens(props.tokens)
  const list = t.customColors ?? []
  const [name, setName] = React.useState("")
  const valid = /^[a-z][a-z0-9-]{1,30}$/.test(name) && !list.some((c) => c.name === name) && !(name in t.colors.light)
  const set = (next: typeof list, key?: string) => props.update("customColors", next, key)
  return (
    <PanelSection title="Custom colours">
      <p className="text-[11px] text-zinc-500">Extra colours like success or warning. Use them as bg-success, text-warning…</p>
      {list.map((c, i) => (
        <div key={c.name} className="flex flex-col gap-2 rounded-[6px] border border-zinc-200 p-2">
          <div className="flex items-center justify-between">
            <span className="font-mono text-[12px] text-zinc-800">{c.name}</span>
            <ChromeButton size="sm" variant="ghost" aria-label={`Remove ${c.name}`} onClick={() => set(list.filter((_, j) => j !== i))}>
              <Icons.close width={12} height={12} />
            </ChromeButton>
          </div>
          <ColorField
            label={`${c.name} · ${props.mode}`}
            value={props.mode === "dark" ? c.dark : c.light}
            onChange={(v, key) => set(list.map((x, j) => (j === i ? { ...x, [props.mode]: v } : x)), key ? `custom:${c.name}` : undefined)}
          />
        </div>
      ))}
      <div className="flex gap-2">
        <TextInput placeholder="name, e.g. success" value={name} onChange={(e) => setName(e.target.value.toLowerCase())} aria-label="New colour name" />
        <ChromeButton
          disabled={!valid}
          onClick={() => {
            set([...list, { name, light: "oklch(0.6 0.15 150)", dark: "oklch(0.7 0.15 150)" }])
            setName("")
          }}
        >
          Add
        </ChromeButton>
      </div>
    </PanelSection>
  )
}

export function ColorsPanel(props: InspectorProps) {
  const { tokens, mode } = props
  const [open, setOpen] = React.useState<Record<string, boolean>>({ base: true, primary: true })
  const [base, setBase] = React.useState("")
  const colors = tokens.colors[mode]
  const fails = CONTRAST_PAIRS.filter(([s, t]) => {
    const r = contrastRatio(colors[t], colors[s], colors.background)
    return r != null && r < 4.5
  })

  return (
    <>
      <PanelSection>
        <ModeTabs mode={mode} setMode={props.setMode} />
        <p className="text-[11px] text-zinc-500">Editing {mode} mode. The canvas switches to match.</p>
        {fails.length > 0 ? (
          <div className="flex items-start gap-2 rounded-[6px] bg-amber-50 px-2.5 py-2 text-[11px] text-amber-900">
            <Icons.alert width={14} height={14} className="mt-px shrink-0" />
            <span>
              {fails.length} text pairing{fails.length === 1 ? "" : "s"} below 4.5:1 contrast in {mode} mode:{" "}
              {fails.map(([s, t]) => `${t} on ${s}`).join(", ")}
            </span>
          </div>
        ) : (
          <div className="flex items-center gap-2 rounded-[6px] bg-emerald-50 px-2.5 py-2 text-[11px] text-emerald-900">
            <Icons.check width={14} height={14} /> All text pairings pass 4.5:1 in {mode} mode
          </div>
        )}
      </PanelSection>
      <PanelSection title="Base colour">
        <p className="text-[11px] text-zinc-500">
          Start from a shadcn neutral palette. Replaces backgrounds, text, borders and surfaces in both modes; brand colours (primary,
          charts, destructive) stay. Locked values are kept.
        </p>
        <div className="flex gap-2">
          <SelectInput value={base} onChange={(e) => setBase(e.target.value)} aria-label="Base colour">
            <option value="">Choose…</option>
            {Object.keys(BASE_COLORS).map((b) => (
              <option key={b} value={b}>
                {b[0].toUpperCase() + b.slice(1)}
              </option>
            ))}
          </SelectInput>
          <ChromeButton
            disabled={!base}
            onClick={() => {
              const next = applyBaseColor(tokens, base as keyof typeof BASE_COLORS)
              props.updateMany(Object.entries(next).map(([p, v]) => [p, v]))
            }}
          >
            Apply
          </ChromeButton>
        </div>
      </PanelSection>
      {COLOR_GROUPS.map((group) => {
        const isOpen = open[group.id] ?? false
        return (
          <section key={group.id} className="border-b border-zinc-200">
            <button
              type="button"
              onClick={() => setOpen((o) => ({ ...o, [group.id]: !isOpen }))}
              aria-expanded={isOpen}
              className="flex w-full items-center gap-2 px-4 py-3 text-left hover:bg-zinc-50"
            >
              <Icons.chevron width={13} height={13} className={cx("text-zinc-400 transition-transform", isOpen && "rotate-90")} />
              <span className="flex-1 text-[12px] font-semibold text-zinc-900">{group.label}</span>
              <span className="flex -space-x-1">
                {group.tokens.slice(0, 4).map(({ token }) => (
                  <span key={token} className="size-3.5 rounded-full ring-1 ring-zinc-200" style={{ background: colors[token] }} />
                ))}
              </span>
            </button>
            {isOpen && (
              <div className="flex flex-col gap-4 px-4 pb-4">
                {group.pairs?.map(([s, t]) => (
                  <div key={`${s}-${t}`} className="flex items-center justify-between gap-2 text-[11px] text-zinc-500">
                    <span>
                      {t} on {s}
                    </span>
                    <ContrastBadge ratio={contrastRatio(colors[t], colors[s], colors.background)} />
                  </div>
                ))}
                {group.tokens.map(({ token, label }) => (
                  <ColorRow key={token} token={token} label={label} props={props} />
                ))}
              </div>
            )}
          </section>
        )
      })}
      <CustomColors {...props} />
    </>
  )
}

/* ------------------------------------------------------------------ */
/* Typography                                                          */
/* ------------------------------------------------------------------ */

const CATEGORY_LABEL: Record<FontCategory, string> = { sans: "Sans serif", serif: "Serif", display: "Display", mono: "Monospace" }

function FontPicker({ role, label, props }: { role: keyof FontTokens; label: string; props: InspectorProps }) {
  const path = `fonts.${role}`
  const value = props.tokens.fonts[role]
  const locked = props.isLocked(path)
  const known = FONT_OPTIONS.some((f) => f.family === value)
  const [custom, setCustom] = React.useState(!known)
  const order: FontCategory[] = role === "mono" ? ["mono", "sans", "serif", "display"] : ["sans", "serif", "display", "mono"]
  return (
    <div className="flex flex-col gap-1.5">
      <div className="flex items-center justify-between">
        <span className="text-[12px] text-zinc-600">{label}</span>
        <LockButton path={path} isLocked={props.isLocked} toggleLock={props.toggleLock} />
      </div>
      <SelectInput
        value={custom ? "__custom" : value}
        disabled={locked}
        aria-label={`${label} font`}
        onChange={(e) => {
          if (e.target.value === "__custom") setCustom(true)
          else {
            setCustom(false)
            props.update(path, e.target.value)
          }
        }}
      >
        {order.map((cat) => (
          <optgroup key={cat} label={CATEGORY_LABEL[cat]}>
            {FONT_OPTIONS.filter((f) => f.category === cat).map((f) => (
              <option key={f.family} value={f.family}>
                {f.family}
              </option>
            ))}
          </optgroup>
        ))}
        <option value="__custom">Other Google font…</option>
      </SelectInput>
      {custom && (
        <CommitInput
          value={value}
          disabled={locked}
          placeholder="Exact Google Fonts name, e.g. Nunito"
          aria-label={`${label} custom font name`}
          validate={(v) => /^[A-Za-z0-9 ]{2,60}$/.test(v)}
          onCommit={(v) => props.update(path, v)}
        />
      )}
    </div>
  )
}

export function TypographyPanel(props: InspectorProps) {
  const t = normalizeTokens(props.tokens)
  const scaleLocked = props.isLocked("typeScale")
  return (
    <>
      <PanelSection title="Fonts">
        <FontPicker role="sans" label="Body" props={props} />
        <FontPicker role="heading" label="Headings" props={props} />
        <FontPicker role="mono" label="Code" props={props} />
        <p className="text-[11px] text-zinc-500">Fonts load from Google Fonts.</p>
      </PanelSection>
      <PanelSection title="Sizes" action={<LockButton path="typeScale" isLocked={props.isLocked} toggleLock={props.toggleLock} />}>
        <div className="grid grid-cols-[3rem_1fr_1fr] items-center gap-x-2 gap-y-1.5 text-[11px] text-zinc-500">
          <span />
          <span>Size</span>
          <span>Line height</span>
          {TEXT_STEPS.map((s) => (
            <React.Fragment key={s}>
              <span className="font-mono text-zinc-700">{s}</span>
              <NumberField
                label={`text-${s} size`}
                value={t.typeScale![s].size}
                unit="px"
                min={6}
                max={200}
                disabled={scaleLocked}
                onCommit={(v) => props.update(`typeScale.${s}`, { ...t.typeScale![s], size: v ?? t.typeScale![s].size })}
              />
              <NumberField
                label={`text-${s} line height`}
                value={t.typeScale![s].lineHeight}
                unit="px"
                min={6}
                max={240}
                disabled={scaleLocked}
                onCommit={(v) => props.update(`typeScale.${s}`, { ...t.typeScale![s], lineHeight: v ?? t.typeScale![s].lineHeight })}
              />
            </React.Fragment>
          ))}
        </div>
      </PanelSection>
      <PanelSection title="Weights">
        <div className="grid grid-cols-[1fr_6rem] items-center gap-x-2 gap-y-1.5 text-[11px]">
          {WEIGHTS.map((w) => (
            <React.Fragment key={w}>
              <span className="text-zinc-700">{w}</span>
              <NumberField label={`${w} weight`} value={t.fontWeights![w]} min={1} max={1000} disabled={scaleLocked} onCommit={(v) => props.update(`fontWeights.${w}`, v ?? t.fontWeights![w])} />
            </React.Fragment>
          ))}
        </div>
      </PanelSection>
      <PanelSection title="Letter spacing">
        <div className="grid grid-cols-[1fr_6rem] items-center gap-x-2 gap-y-1.5 text-[11px]">
          {TRACKING.map((tr) => (
            <React.Fragment key={tr}>
              <span className="text-zinc-700">{tr}</span>
              <NumberField label={`${tr} tracking`} value={t.tracking![tr]} unit="em" min={-1} max={1} disabled={scaleLocked} onCommit={(v) => props.update(`tracking.${tr}`, v ?? t.tracking![tr])} />
            </React.Fragment>
          ))}
        </div>
      </PanelSection>
    </>
  )
}

/* ------------------------------------------------------------------ */
/* Radius & spacing                                                    */
/* ------------------------------------------------------------------ */

function NumberSlider({
  path,
  label,
  min,
  max,
  step,
  unit,
  presets,
  props,
}: {
  path: "radius" | "spacing"
  label: string
  min: number
  max: number
  step: number
  unit: string
  presets: number[]
  props: InspectorProps
}) {
  const value = props.tokens[path]
  const locked = props.isLocked(path)
  return (
    <PanelSection title={label} action={<LockButton path={path} isLocked={props.isLocked} toggleLock={props.toggleLock} />}>
      <div className="flex items-center gap-3">
        <RangeInput min={min} max={max} step={step} value={value} disabled={locked} aria-label={label} onChange={(e) => props.update(path, Number(e.target.value), path)} />
        <div className="w-24 shrink-0">
          <NumberField label={`${label} in ${unit}`} value={value} unit={unit} min={0} max={max * 2} disabled={locked} onCommit={(v) => props.update(path, v ?? value)} />
        </div>
      </div>
      <div className="flex flex-wrap gap-1.5">
        {presets.map((p) => (
          <ChromeButton key={p} size="sm" disabled={locked} variant={p === value ? "primary" : "default"} onClick={() => props.update(path, p)}>
            {p}
          </ChromeButton>
        ))}
      </div>
      <p className="text-[11px] text-zinc-500">≈ {Math.round(value * 16 * 10) / 10}px at default browser size</p>
    </PanelSection>
  )
}

export function RadiusPanel(props: InspectorProps) {
  const t = normalizeTokens(props.tokens)
  return (
    <>
      <NumberSlider path="radius" label="Base radius" min={0} max={1.5} step={0.025} unit="rem" presets={[0, 0.25, 0.5, 0.625, 0.75, 0.875, 1]} props={props} />
      <PanelSection title="Steps">
        <p className="text-[11px] text-zinc-500">Each step is the base × a multiplier. Type a value to fix a step; clear it to go back to the calculated value.</p>
        <div className="grid grid-cols-[4.5rem_1fr] items-center gap-x-2 gap-y-1.5 text-[11px]">
          {RADIUS_STEPS.map((s) => (
            <React.Fragment key={s}>
              <span className="font-mono text-zinc-700">--radius-{s}</span>
              <NumberField
                label={`radius ${s}`}
                value={t.radiusSteps?.[s]}
                placeholder={String(Math.round(t.radius * RADIUS_MULTIPLIER[s] * 1000) / 1000)}
                unit="rem"
                min={0}
                max={10}
                allowEmpty
                disabled={props.isLocked("radius")}
                onCommit={(v) => {
                  const next = { ...t.radiusSteps }
                  if (v == null) delete next[s]
                  else next[s] = v
                  props.update("radiusSteps", next)
                }}
              />
            </React.Fragment>
          ))}
        </div>
      </PanelSection>
    </>
  )
}

export function SpacingPanel(props: InspectorProps) {
  return <NumberSlider path="spacing" label="Base spacing unit" min={0.2} max={0.32} step={0.005} unit="rem" presets={[0.22, 0.25, 0.275, 0.3]} props={props} />
}

/* ------------------------------------------------------------------ */
/* Shadows                                                             */
/* ------------------------------------------------------------------ */

const SHADOW_SHAPE: Record<ShadowLevel, { y: number; blur: number; opacity: number }> = {
  "2xs": { y: 0.5, blur: 1.5, opacity: 0.5 },
  xs: { y: 0.5, blur: 3, opacity: 0.5 },
  sm: { y: 1, blur: 3, opacity: 1 },
  md: { y: 1.5, blur: 6, opacity: 1 },
  lg: { y: 2.5, blur: 10.5, opacity: 1 },
  xl: { y: 4, blur: 18, opacity: 1 },
  "2xl": { y: 6, blur: 30, opacity: 1.5 },
}

function generateShadows(color: string, opacity: number, distance: number, softness: number, spread: number, x: number) {
  const rgb = hexToRgb(color) ?? { r: 0, g: 0, b: 0, alpha: 1 }
  const out = {} as Record<ShadowLevel, string>
  const r = (n: number) => Math.round(n * 10) / 10
  for (const level of SHADOW_LEVELS) {
    const s = SHADOW_SHAPE[level]
    const c = formatOklch(rgbToOklch({ ...rgb, alpha: Math.min(1, (opacity / 100) * s.opacity) }))
    out[level] = `${r(x * s.y)}px ${r(s.y * distance)}px ${r(s.blur * softness)}px ${r(spread)}px ${c}`
  }
  return out
}

export function ShadowsPanel(props: InspectorProps) {
  const { tokens, mode } = props
  const [g, setG] = React.useState({ color: "#1b2a38", opacity: 10, distance: 1, softness: 1, spread: 0, x: 0 })
  const anyLocked = SHADOW_LEVELS.some((l) => props.isLocked(`shadows.${mode}.${l}`))
  const apply = (patch: Partial<typeof g>) => {
    const next = { ...g, ...patch }
    setG(next)
    const gen = generateShadows(next.color, next.opacity, next.distance, next.softness, next.spread, next.x)
    props.updateMany(
      SHADOW_LEVELS.filter((l) => !props.isLocked(`shadows.${mode}.${l}`)).map((l) => [`shadows.${mode}.${l}`, gen[l]]),
      `shadows-gen-${mode}`
    )
  }
  const slider = (label: string, key: keyof typeof g, min: number, max: number, step: number, unit = "") => (
    <FieldRow label={`${label} · ${g[key]}${unit}`}>
      <RangeInput min={min} max={max} step={step} value={g[key] as number} onChange={(e) => apply({ [key]: Number(e.target.value) })} />
    </FieldRow>
  )
  return (
    <>
      <PanelSection>
        <ModeTabs mode={mode} setMode={props.setMode} />
      </PanelSection>
      <PanelSection title="Generate a ramp">
        <p className="text-[11px] text-zinc-500">Rewrites every {mode}-mode shadow level at once{anyLocked ? " (locked levels are skipped)" : ""}.</p>
        <FieldRow label="Colour">
          <div className="flex items-center gap-2">
            <input type="color" value={g.color} aria-label="Shadow colour" className="size-8 cursor-pointer rounded-[6px] border border-zinc-200" onChange={(e) => apply({ color: e.target.value })} />
            <span className="font-mono text-[11px] text-zinc-500">{g.color}</span>
          </div>
        </FieldRow>
        {slider("Strength", "opacity", 0, 40, 1, "%")}
        {slider("Distance", "distance", 0, 3, 0.1, "×")}
        {slider("Softness", "softness", 0.2, 3, 0.1, "×")}
        {slider("Spread", "spread", -4, 4, 0.5, "px")}
        {slider("Offset X", "x", -2, 2, 0.1, "×")}
      </PanelSection>
      <PanelSection title="Ramp">
        {SHADOW_LEVELS.map((level) => {
          const path = `shadows.${mode}.${level}`
          return (
            <div key={level} className="flex flex-col gap-1">
              <div className="flex items-center justify-between">
                <span className="font-mono text-[11px] text-zinc-600">shadow-{level}</span>
                <LockButton path={path} isLocked={props.isLocked} toggleLock={props.toggleLock} />
              </div>
              <CommitInput
                value={tokens.shadows[mode][level]}
                disabled={props.isLocked(path)}
                className="h-7 font-mono text-[11px]"
                aria-label={`shadow-${level}`}
                validate={(v) => v.length > 0 && !/[;{}]/.test(v)}
                onCommit={(v) => props.update(path, v)}
              />
            </div>
          )
        })}
      </PanelSection>
    </>
  )
}

/* ------------------------------------------------------------------ */
/* Controls                                                            */
/* ------------------------------------------------------------------ */

export function ControlsPanel(props: InspectorProps) {
  const t = normalizeTokens(props.tokens)
  const c = t.controls!
  const locked = props.isLocked("controls")
  return (
    <>
      <PanelSection title="Heights" action={<LockButton path="controls" isLocked={props.isLocked} toggleLock={props.toggleLock} />}>
        <div className="grid grid-cols-[4rem_1fr] items-center gap-x-2 gap-y-1.5 text-[11px]">
          {CONTROL_SIZES.map((s) => (
            <React.Fragment key={s}>
              <span className="font-mono text-zinc-700">{s}</span>
              <NumberField label={`${s} height`} value={c.heights[s]} unit="px" min={12} max={96} disabled={locked} onCommit={(v) => props.update(`controls.heights.${s}`, v ?? c.heights[s])} />
            </React.Fragment>
          ))}
        </div>
      </PanelSection>
      <PanelSection title="Follow these heights">
        {CONTROL_COMPONENTS.map((comp) => (
          <label key={comp.id} className="flex items-center justify-between gap-2 text-[12px] text-zinc-700">
            {comp.label}
            <input
              type="checkbox"
              className="size-4 accent-zinc-900"
              checked={c.follow.includes(comp.id)}
              disabled={locked}
              onChange={(e) => props.update("controls.follow", e.target.checked ? [...c.follow, comp.id] : c.follow.filter((x) => x !== comp.id))}
            />
          </label>
        ))}
      </PanelSection>
      <PanelSection title="Focus">
        <Segmented
          value={c.focus.style}
          onChange={(v) => props.update("controls.focus.style", v)}
          className="w-full [&>button]:flex-1"
          options={[
            { value: "default", label: "Default" },
            { value: "ring", label: "Ring" },
            { value: "outline", label: "Outline" },
          ]}
        />
        {c.focus.style === "default" ? (
          <p className="text-[11px] text-zinc-500">Each component keeps its own focus ring.</p>
        ) : (
          <div className="grid grid-cols-[4rem_1fr] items-center gap-x-2 gap-y-1.5 text-[11px]">
            <span className="text-zinc-700">Width</span>
            <NumberField label="Focus width" value={c.focus.width} unit="px" min={0} max={12} disabled={locked} onCommit={(v) => props.update("controls.focus.width", v ?? 3)} />
            <span className="text-zinc-700">Offset</span>
            <NumberField label="Focus offset" value={c.focus.offset} unit="px" min={0} max={12} disabled={locked} onCommit={(v) => props.update("controls.focus.offset", v ?? 0)} />
            <span className="text-zinc-700">Strength</span>
            <NumberField label="Focus strength" value={c.focus.strength} unit="%" min={0} max={100} disabled={locked} onCommit={(v) => props.update("controls.focus.strength", v ?? 50)} />
          </div>
        )}
      </PanelSection>
    </>
  )
}

/* ------------------------------------------------------------------ */
/* Icons                                                               */
/* ------------------------------------------------------------------ */

export function IconsPanel(props: InspectorProps) {
  const t = normalizeTokens(props.tokens)
  return (
    <>
      <PanelSection title="Library" action={<LockButton path="icons" isLocked={props.isLocked} toggleLock={props.toggleLock} />}>
        <div className="grid grid-cols-2 gap-1.5" role="radiogroup" aria-label="Icon library">
          {ICON_LIBRARIES.map((lib) => {
            const active = t.icons!.library === lib.id
            return (
              <button
                key={lib.id}
                type="button"
                role="radio"
                aria-checked={active}
                disabled={props.isLocked("icons")}
                onClick={() => props.update("icons.library", lib.id as IconLibrary)}
                className={cx(
                  "flex flex-col items-start gap-1.5 rounded-[6px] border px-2.5 py-2 text-left text-[12px] transition-colors disabled:opacity-50",
                  active ? "border-blue-500 bg-blue-50/60 text-zinc-900" : "border-zinc-200 text-zinc-700 hover:bg-zinc-50"
                )}
              >
                <span className="flex gap-1.5 text-zinc-700 [&_svg]:size-3.5">
                  {([UserIcon, Search01Icon, Settings02Icon, CheckmarkCircle02Icon, Alert02Icon] as const).map((icon) => (
                    <HugeiconsIcon key={icon} icon={icon} library={lib.id} />
                  ))}
                </span>
                <span className="font-medium">{lib.name}</span>
              </button>
            )
          })}
        </div>
        <p className="text-[11px] text-zinc-500">
          Every component icon switches to the matching icon from this library. Saving rewires the app too; new icons need a row in{" "}
          <code>lib/ds/icons.tsx</code>.
        </p>
        <div className="flex items-center gap-2 text-[11px] text-zinc-500 [&_svg]:size-3.5">
          <HugeiconsIcon icon={Calendar03Icon} library={t.icons!.library} />
          <HugeiconsIcon icon={ArrowRight01Icon} library={t.icons!.library} />
          {ICON_LIBRARIES.find((l) => l.id === t.icons!.library)?.name}
        </div>
      </PanelSection>
      <PanelSection title="Icon style">
        <FieldRow label={`Stroke · ${t.icons!.strokeWidth}`}>
          <RangeInput min={0.5} max={3} step={0.25} value={t.icons!.strokeWidth} disabled={props.isLocked("icons")} onChange={(e) => props.update("icons.strokeWidth", Number(e.target.value), "icons.stroke")} />
        </FieldRow>
      </PanelSection>
    </>
  )
}

/* ------------------------------------------------------------------ */
/* Brand                                                               */
/* ------------------------------------------------------------------ */

export interface PendingAsset {
  repoPath: string
  content: string
  dataUrl: string
}

/** Strip scripts and event handlers from an uploaded SVG */
export function sanitizeSvg(text: string): string | null {
  const svg = text.replace(/<\?xml[^>]*>/g, "").replace(/<!DOCTYPE[^>]*>/gi, "").trim()
  if (!/^<svg[\s>]/i.test(svg)) return null
  return svg
    .replace(/<script[\s\S]*?<\/script>/gi, "")
    .replace(/\son[a-z]+\s*=\s*("[^"]*"|'[^']*')/gi, "")
    .replace(/(href|xlink:href)\s*=\s*("javascript:[^"]*"|'javascript:[^']*')/gi, "")
}

const ASSET_SLOTS = {
  logoLight: { label: "Logo (light)", path: "/brand/logo.svg", repo: "public/brand/logo.svg" },
  logoDark: { label: "Logo (dark)", path: "/brand/logo-dark.svg", repo: "public/brand/logo-dark.svg" },
  markLight: { label: "Mark (light)", path: "/brand/mark.svg", repo: "public/brand/mark.svg" },
  markDark: { label: "Mark (dark)", path: "/brand/mark-dark.svg", repo: "public/brand/mark-dark.svg" },
  favicon: { label: "Favicon", path: "/icon.svg", repo: "app/icon.svg" },
} as const

export function BrandPanel(props: InspectorProps & { onAsset: (path: string, asset: PendingAsset) => void; onError: (msg: string) => void }) {
  const t = normalizeTokens(props.tokens)
  const b = t.brand!
  const locked = props.isLocked("brand")
  const upload = (key: keyof typeof ASSET_SLOTS) => (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    e.target.value = ""
    if (!file) return
    if (file.size > 500_000) return props.onError("That SVG is over 500 KB. Use a smaller file.")
    file.text().then((text) => {
      const svg = sanitizeSvg(text)
      if (!svg) return props.onError("That file isn't an SVG.")
      const slot = ASSET_SLOTS[key]
      // A fresh path each time so the browser doesn't show a cached old file
      const path = key === "favicon" ? slot.path : slot.path.replace(".svg", `-${Date.now().toString(36)}.svg`)
      const repoPath = key === "favicon" ? slot.repo : `public${path}`
      props.onAsset(path, { repoPath, content: svg, dataUrl: `data:image/svg+xml;charset=utf-8,${encodeURIComponent(svg)}` })
      props.update(`brand.${key}`, path)
    })
  }
  const fileRow = (key: keyof typeof ASSET_SLOTS) => (
    <div className="flex items-center gap-2">
      <span className="w-24 shrink-0 text-[12px] text-zinc-600">{ASSET_SLOTS[key].label}</span>
      <span className="min-w-0 flex-1 truncate font-mono text-[11px] text-zinc-500">{b[key] ?? "none"}</span>
      <label className={cx("inline-flex h-7 cursor-pointer items-center rounded-[6px] border border-zinc-200 px-2 text-[12px] hover:bg-zinc-50", locked && "pointer-events-none opacity-40")}>
        Upload
        <input type="file" accept=".svg,image/svg+xml" className="sr-only" onChange={upload(key)} disabled={locked} />
      </label>
      {b[key] && key !== "favicon" && (
        <ChromeButton size="sm" variant="ghost" aria-label={`Remove ${ASSET_SLOTS[key].label}`} disabled={locked} onClick={() => props.update(`brand.${key}`, undefined)}>
          <Icons.close width={12} height={12} />
        </ChromeButton>
      )}
    </div>
  )
  return (
    <>
      <PanelSection title="Logo" action={<LockButton path="brand" isLocked={props.isLocked} toggleLock={props.toggleLock} />}>
        {fileRow("logoLight")}
        {fileRow("logoDark")}
        <FieldRow group label="Dark mode without a dark logo">
          <Segmented
            value={b.darkFallback}
            onChange={(v) => props.update("brand.darkFallback", v)}
            className="w-full [&>button]:flex-1"
            options={[
              { value: "light", label: "Use light logo" },
              { value: "text", label: "Show name" },
            ]}
          />
        </FieldRow>
        <div className="grid grid-cols-[4rem_1fr] items-center gap-2 text-[11px]">
          <span className="text-zinc-700">Height</span>
          <NumberField label="Logo height" value={b.logoHeight} unit="px" min={8} max={120} disabled={locked} onCommit={(v) => props.update("brand.logoHeight", v ?? 24)} />
        </div>
      </PanelSection>
      <PanelSection title="Mark">
        {fileRow("markLight")}
        {fileRow("markDark")}
        <div className="grid grid-cols-[4rem_1fr] items-center gap-2 text-[11px]">
          <span className="text-zinc-700">Height</span>
          <NumberField label="Mark height" value={b.markHeight} unit="px" min={8} max={160} disabled={locked} onCommit={(v) => props.update("brand.markHeight", v ?? 32)} />
        </div>
      </PanelSection>
      <PanelSection title="Favicon">
        {fileRow("favicon")}
        <p className="text-[11px] text-zinc-500">SVG files only. Uploads are saved to the repo with your next Save.</p>
      </PanelSection>
    </>
  )
}

/* ------------------------------------------------------------------ */
/* Style (menus)                                                       */
/* ------------------------------------------------------------------ */

export function StylePanel(props: InspectorProps & { onImport: () => void }) {
  const t = normalizeTokens(props.tokens)
  return (
    <>
      <PanelSection title="Base style">
        <div className="flex items-center justify-between text-[12px]">
          <span className="text-zinc-600">Style</span>
          <span className="font-medium text-zinc-900">Vega</span>
        </div>
        <p className="text-[11px] text-zinc-500">The component set this system was installed with (from DS Manager).</p>
      </PanelSection>
      <PanelSection title="Menus" action={<LockButton path="menu" isLocked={props.isLocked} toggleLock={props.toggleLock} />}>
        <FieldRow group label="Menu">
          <Segmented
            value={t.menu!.color}
            onChange={(v) => !props.isLocked("menu") && props.update("menu.color", v)}
            className="w-full [&>button]:flex-1"
            options={[
              { value: "default", label: "Default" },
              { value: "inverted", label: "Inverted" },
            ]}
          />
        </FieldRow>
        <FieldRow group label="Highlighted item">
          <Segmented
            value={t.menu!.accent}
            onChange={(v) => !props.isLocked("menu") && props.update("menu.accent", v)}
            className="w-full [&>button]:flex-1"
            options={[
              { value: "subtle", label: "Subtle" },
              { value: "bold", label: "Bold" },
            ]}
          />
        </FieldRow>
        <p className="text-[11px] text-zinc-500">Applies to dropdown, context, menubar, select and combobox menus.</p>
      </PanelSection>
      <PanelSection title="Import preset">
        <p className="text-[11px] text-zinc-500">Paste theme CSS from DS Manager, tweakcn or ui.shadcn.com/themes.</p>
        <ChromeButton onClick={props.onImport}>
          <Icons.upload /> Import CSS…
        </ChromeButton>
      </PanelSection>
    </>
  )
}

/* ------------------------------------------------------------------ */
/* Lint                                                                */
/* ------------------------------------------------------------------ */

export function LintPanel(props: InspectorProps) {
  const t = normalizeTokens(props.tokens)
  const rules = t.lint!.rules
  const preset = (Object.keys(LINT_PRESETS) as (keyof typeof LINT_PRESETS)[]).find((p) => JSON.stringify(LINT_PRESETS[p]) === JSON.stringify(rules))
  return (
    <>
      <PanelSection title="Strictness">
        <Segmented
          value={preset ?? ("custom" as string)}
          onChange={(v) => v !== "custom" && props.update("lint.rules", LINT_PRESETS[v as keyof typeof LINT_PRESETS])}
          className="w-full [&>button]:flex-1"
          options={[
            { value: "off", label: "Off" },
            { value: "relaxed", label: "Relaxed" },
            { value: "balanced", label: "Balanced" },
            { value: "strict", label: "Strict" },
          ]}
        />
        {!preset && <p className="text-[11px] text-zinc-500">Custom mix of rules.</p>}
      </PanelSection>
      <PanelSection title="Rules">
        {LINT_RULES.map((r) => (
          <div key={r.id} className="flex flex-col gap-1.5">
            <div className="flex items-center justify-between gap-2">
              <span className="text-[12px] font-medium text-zinc-800">{r.label}</span>
              <Segmented
                value={rules[r.id]}
                onChange={(v) => props.update(`lint.rules.${r.id}`, v as LintLevel)}
                options={[
                  { value: "off", label: "Off" },
                  { value: "warn", label: "Warn" },
                  { value: "error", label: "Error" },
                ]}
              />
            </div>
            <p className="text-[11px] text-zinc-500">{r.description}</p>
          </div>
        ))}
      </PanelSection>
      <PanelSection title="Where rules run">
        <p className="text-[11px] text-zinc-500">
          In <code>npm run lint</code>, in the Lint check on every push to GitHub, and for AI tools via AGENTS.md. Saved with the design system.
        </p>
      </PanelSection>
    </>
  )
}

/* ------------------------------------------------------------------ */
/* System overview                                                     */
/* ------------------------------------------------------------------ */

export function SystemPanel(props: InspectorProps & { onNavigate: (view: string) => void }) {
  const { tokens, mode } = props
  const t = normalizeTokens(tokens)
  const failsBy = (m: Mode) =>
    CONTRAST_PAIRS.filter(([s, tt]) => {
      const c = tokens.colors[m]
      const r = contrastRatio(c[tt], c[s], c.background)
      return r != null && r < 4.5
    }).length
  const locks = t.locks ?? []

  return (
    <>
      <PanelSection title="System">
        <FieldRow label="Name">
          <CommitInput value={tokens.name} aria-label="System name" validate={(v) => v.length > 0} onCommit={(v) => props.update("name", v)} />
        </FieldRow>
        <FieldRow label="Description">
          <CommitInput value={tokens.description ?? ""} aria-label="System description" onCommit={(v) => props.update("description", v)} />
        </FieldRow>
      </PanelSection>

      <PanelSection title="Quick edits">
        <ModeTabs mode={mode} setMode={props.setMode} />
        <ColorRow token="primary" label="Primary" props={props} />
        <ColorRow token="primary-foreground" label="Primary text" props={props} />
        <FieldRow label={`Radius · ${tokens.radius}rem`}>
          <RangeInput min={0} max={1.5} step={0.025} value={tokens.radius} disabled={props.isLocked("radius")} onChange={(e) => props.update("radius", Number(e.target.value), "radius")} />
        </FieldRow>
        <p className="text-[11px] text-zinc-500">Click any part of the canvas to edit that component.</p>
      </PanelSection>

      <PanelSection title="Health">
        <div className="flex flex-col gap-1.5 text-[12px]">
          {(["light", "dark"] as Mode[]).map((m) => {
            const n = failsBy(m)
            return (
              <button
                key={m}
                type="button"
                onClick={() => {
                  props.setMode(m)
                  props.onNavigate("foundation:colors")
                }}
                className="flex items-center justify-between rounded-[6px] px-2 py-1.5 text-left hover:bg-zinc-50"
              >
                <span className="text-zinc-700">{m === "light" ? "Light" : "Dark"} mode contrast</span>
                {n === 0 ? <span className="text-emerald-700">All pass</span> : <span className="text-amber-700">{n} below 4.5:1</span>}
              </button>
            )
          })}
          <button type="button" onClick={() => props.onNavigate("lint")} className="flex items-center justify-between rounded-[6px] px-2 py-1.5 text-left hover:bg-zinc-50">
            <span className="text-zinc-700">Locked values</span>
            <span className="text-zinc-500">{locks.length}</span>
          </button>
          <div className="flex items-center justify-between px-2 py-1.5">
            <span className="text-zinc-700">Component changes</span>
            <span className="text-zinc-500">{t.overrides?.length ?? 0}</span>
          </div>
        </div>
      </PanelSection>

      <PanelSection title="Libraries">
        {ADAPTERS.map((a) => (
          <div key={a.id} className="flex flex-col gap-0.5 rounded-[6px] border border-zinc-200 px-3 py-2">
            <span className="text-[12px] font-medium text-zinc-900">{a.name}</span>
            <span className="text-[11px] text-zinc-500">{a.description}</span>
          </div>
        ))}
        <p className="text-[11px] text-zinc-500">Tokens are stored library-neutral in design-system/tokens.json. Each library adapter writes its own theme file.</p>
      </PanelSection>
    </>
  )
}
