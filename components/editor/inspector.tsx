"use client"

import * as React from "react"

import { ADAPTERS } from "@/lib/ds/adapters"
import {
  contrastLevel,
  contrastRatio,
  formatOklch,
  getAlpha,
  hexToRgb,
  parseColor,
  rgbToOklch,
  toHex,
  withAlpha,
  withHex,
} from "@/lib/ds/color"
import { FONT_OPTIONS, type FontCategory } from "@/lib/ds/fonts"
import { getPath } from "@/lib/ds/store"
import {
  COLOR_GROUPS,
  CONTRAST_PAIRS,
  SHADOW_LEVELS,
  type ColorToken,
  type DesignTokens,
  type FontTokens,
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

function LockButton({ path, isLocked, toggleLock }: { path: string } & Pick<InspectorProps, "isLocked" | "toggleLock">) {
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
function CommitInput({
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

function ModeTabs({ mode, setMode }: Pick<InspectorProps, "mode" | "setMode">) {
  return (
    <Segmented
      value={mode}
      onChange={setMode}
      className="w-full [&>button]:flex-1"
      options={[
        { value: "light", label: (<><Icons.sun width={13} height={13} /> Light</>) },
        { value: "dark", label: (<><Icons.moon width={13} height={13} /> Dark</>) },
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

/* ------------------------------------------------------------------ */
/* Colours                                                             */
/* ------------------------------------------------------------------ */

function ColorRow({
  token,
  label,
  props,
}: {
  token: ColorToken
  label: string
  props: InspectorProps
}) {
  const { tokens, mode, update, isLocked } = props
  const path = `colors.${mode}.${token}`
  const value = tokens.colors[mode][token]
  const locked = isLocked(path)
  const alpha = getAlpha(value)
  return (
    <div className="flex flex-col gap-1.5">
      <div className="flex items-center gap-2">
        <label
          className={cx(
            "relative size-8 shrink-0 overflow-hidden rounded-[6px] border border-zinc-200",
            locked ? "cursor-not-allowed" : "cursor-pointer"
          )}
          title={locked ? "Locked" : "Pick a colour"}
          style={{
            backgroundImage:
              "linear-gradient(45deg,#e4e4e7 25%,transparent 25%),linear-gradient(-45deg,#e4e4e7 25%,transparent 25%),linear-gradient(45deg,transparent 75%,#e4e4e7 75%),linear-gradient(-45deg,transparent 75%,#e4e4e7 75%)",
            backgroundSize: "8px 8px",
            backgroundPosition: "0 0,0 4px,4px -4px,-4px 0",
          }}
        >
          <span className="absolute inset-0" style={{ background: value }} />
          <input
            type="color"
            disabled={locked}
            aria-label={`${label} colour`}
            className="absolute inset-0 size-full cursor-pointer opacity-0 disabled:cursor-not-allowed"
            value={toHex(value)}
            onChange={(e) => update(path, withHex(value, e.target.value), path)}
          />
        </label>
        <div className="flex min-w-0 flex-1 flex-col">
          <div className="truncate text-[12px] font-medium text-zinc-800">{label}</div>
          <div className="truncate font-mono text-[10px] text-zinc-400">--{token}</div>
        </div>
        <LockButton path={path} isLocked={isLocked} toggleLock={props.toggleLock} />
      </div>
      <div className="flex items-center gap-1.5">
        <CommitInput
          value={value}
          disabled={locked}
          className="h-7 font-mono text-[11px]"
          aria-label={`${label} value`}
          validate={(v) => parseColor(v) != null}
          onCommit={(v) => {
            const rgb = parseColor(v)
            if (!rgb) return
            // Store everything as OKLCH so adapters get one consistent format
            update(path, v.trim().toLowerCase().startsWith("oklch") ? v : formatOklch(rgbToOklch(rgb)))
          }}
        />
        <CommitInput
          value={String(Math.round(alpha * 100))}
          disabled={locked}
          className="h-7 w-14 shrink-0 text-right font-mono text-[11px]"
          aria-label={`${label} opacity percent`}
          title="Opacity %"
          validate={(v) => /^\d{1,3}$/.test(v) && Number(v) <= 100}
          onCommit={(v) => update(path, withAlpha(value, Number(v) / 100))}
        />
      </div>
    </div>
  )
}

export function ColorsPanel(props: InspectorProps) {
  const { tokens, mode } = props
  const [open, setOpen] = React.useState<Record<string, boolean>>({ base: true, primary: true })
  const colors = tokens.colors[mode]
  const fails = CONTRAST_PAIRS.filter(([s, t]) => {
    const r = contrastRatio(colors[t], colors[s], colors.background)
    return r != null && r < 4.5
  })

  return (
    <>
      <PanelSection>
        <ModeTabs mode={mode} setMode={props.setMode} />
        <p className="text-[11px] text-zinc-500">
          Editing {mode} mode. The canvas switches to match.
        </p>
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
    </>
  )
}

/* ------------------------------------------------------------------ */
/* Typography                                                          */
/* ------------------------------------------------------------------ */

const CATEGORY_LABEL: Record<FontCategory, string> = {
  sans: "Sans serif",
  serif: "Serif",
  display: "Display",
  mono: "Monospace",
}

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
          if (e.target.value === "__custom") {
            setCustom(true)
          } else {
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
  return (
    <PanelSection title="Font families">
      <FontPicker role="sans" label="Body" props={props} />
      <FontPicker role="heading" label="Headings" props={props} />
      <FontPicker role="mono" label="Code" props={props} />
      <p className="text-[11px] text-zinc-500">
        Fonts load from Google Fonts. Pick &quot;Other Google font&quot; to use any family on fonts.google.com.
      </p>
    </PanelSection>
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
        <RangeInput
          min={min}
          max={max}
          step={step}
          value={value}
          disabled={locked}
          aria-label={label}
          onChange={(e) => props.update(path, Number(e.target.value), path)}
        />
        <div className="flex w-24 shrink-0 items-center gap-1">
          <CommitInput
            value={String(value)}
            disabled={locked}
            className="h-7 text-right font-mono text-[12px]"
            aria-label={`${label} in ${unit}`}
            validate={(v) => !Number.isNaN(Number(v)) && Number(v) >= 0 && Number(v) <= max * 2}
            onCommit={(v) => props.update(path, Number(v))}
          />
          <span className="text-[11px] text-zinc-500">{unit}</span>
        </div>
      </div>
      <div className="flex flex-wrap gap-1.5">
        {presets.map((p) => (
          <ChromeButton
            key={p}
            size="sm"
            disabled={locked}
            variant={p === value ? "primary" : "default"}
            onClick={() => props.update(path, p)}
          >
            {p}
          </ChromeButton>
        ))}
      </div>
      <p className="text-[11px] text-zinc-500">≈ {Math.round(value * 16 * 10) / 10}px at default browser size</p>
    </PanelSection>
  )
}

export function RadiusPanel(props: InspectorProps) {
  return (
    <NumberSlider
      path="radius"
      label="Base radius"
      min={0}
      max={1.5}
      step={0.025}
      unit="rem"
      presets={[0, 0.25, 0.5, 0.625, 0.75, 0.875, 1]}
      props={props}
    />
  )
}

export function SpacingPanel(props: InspectorProps) {
  return (
    <NumberSlider
      path="spacing"
      label="Base spacing unit"
      min={0.2}
      max={0.32}
      step={0.005}
      unit="rem"
      presets={[0.22, 0.25, 0.275, 0.3]}
      props={props}
    />
  )
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

function generateShadows(color: string, opacity: number, distance: number, softness: number) {
  const rgb = hexToRgb(color) ?? { r: 0, g: 0, b: 0, alpha: 1 }
  const out = {} as Record<ShadowLevel, string>
  for (const level of SHADOW_LEVELS) {
    const s = SHADOW_SHAPE[level]
    const c = formatOklch(rgbToOklch({ ...rgb, alpha: Math.min(1, (opacity / 100) * s.opacity) }))
    const r = (n: number) => Math.round(n * 10) / 10
    out[level] = `0px ${r(s.y * distance)}px ${r(s.blur * softness)}px 0px ${c}`
  }
  return out
}

export function ShadowsPanel(props: InspectorProps) {
  const { tokens, mode } = props
  const [color, setColor] = React.useState("#1b2a38")
  const [opacity, setOpacity] = React.useState(10)
  const [distance, setDistance] = React.useState(1)
  const [softness, setSoftness] = React.useState(1)
  const anyLocked = SHADOW_LEVELS.some((l) => props.isLocked(`shadows.${mode}.${l}`))

  const apply = (next: { color?: string; opacity?: number; distance?: number; softness?: number }) => {
    const c = next.color ?? color
    const o = next.opacity ?? opacity
    const d = next.distance ?? distance
    const s = next.softness ?? softness
    const gen = generateShadows(c, o, d, s)
    props.updateMany(
      SHADOW_LEVELS.filter((l) => !props.isLocked(`shadows.${mode}.${l}`)).map((l) => [`shadows.${mode}.${l}`, gen[l]]),
      `shadows-gen-${mode}`
    )
  }

  return (
    <>
      <PanelSection>
        <ModeTabs mode={mode} setMode={props.setMode} />
      </PanelSection>
      <PanelSection title="Generate a scale">
        <p className="text-[11px] text-zinc-500">
          Adjust these to rewrite every {mode}-mode shadow level at once{anyLocked ? " (locked levels are skipped)" : ""}.
        </p>
        <FieldRow label="Shadow colour">
          <div className="flex items-center gap-2">
            <input
              type="color"
              value={color}
              aria-label="Shadow colour"
              className="size-8 cursor-pointer rounded-[6px] border border-zinc-200"
              onChange={(e) => {
                setColor(e.target.value)
                apply({ color: e.target.value })
              }}
            />
            <span className="font-mono text-[11px] text-zinc-500">{color}</span>
          </div>
        </FieldRow>
        <FieldRow label={`Strength · ${opacity}%`}>
          <RangeInput min={0} max={40} step={1} value={opacity} onChange={(e) => { setOpacity(Number(e.target.value)); apply({ opacity: Number(e.target.value) }) }} />
        </FieldRow>
        <FieldRow label={`Distance · ${distance}×`}>
          <RangeInput min={0} max={3} step={0.1} value={distance} onChange={(e) => { setDistance(Number(e.target.value)); apply({ distance: Number(e.target.value) }) }} />
        </FieldRow>
        <FieldRow label={`Softness · ${softness}×`}>
          <RangeInput min={0.2} max={3} step={0.1} value={softness} onChange={(e) => { setSoftness(Number(e.target.value)); apply({ softness: Number(e.target.value) }) }} />
        </FieldRow>
      </PanelSection>
      <PanelSection title="Levels">
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
/* System overview (shown for the overview and components)            */
/* ------------------------------------------------------------------ */

export function SystemPanel(props: InspectorProps & { onNavigate: (view: string) => void }) {
  const { tokens, mode } = props
  const failsBy = (m: Mode) =>
    CONTRAST_PAIRS.filter(([s, t]) => {
      const c = tokens.colors[m]
      const r = contrastRatio(c[t], c[s], c.background)
      return r != null && r < 4.5
    }).length
  const primaryPath = `colors.${mode}.primary`
  const locks = tokens.locks ?? []

  return (
    <>
      <PanelSection title="System">
        <FieldRow label="Name">
          <CommitInput value={tokens.name} aria-label="System name" validate={(v) => v.length > 0} onCommit={(v) => props.update("name", v)} />
        </FieldRow>
        <FieldRow label="Description">
          <CommitInput
            value={tokens.description ?? ""}
            aria-label="System description"
            onCommit={(v) => props.update("description", v)}
          />
        </FieldRow>
      </PanelSection>

      <PanelSection title="Quick edits">
        <ModeTabs mode={mode} setMode={props.setMode} />
        <ColorRow token="primary" label="Primary" props={props} />
        <ColorRow token="primary-foreground" label="Primary text" props={props} />
        <FieldRow label={`Radius · ${tokens.radius}rem`}>
          <RangeInput
            min={0}
            max={1.5}
            step={0.025}
            value={tokens.radius}
            disabled={props.isLocked("radius")}
            onChange={(e) => props.update("radius", Number(e.target.value), "radius")}
          />
        </FieldRow>
        <ChromeButton size="sm" variant="ghost" className="self-start" onClick={() => props.onNavigate("foundation:colors")}>
          All colours <Icons.chevron width={12} height={12} />
        </ChromeButton>
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
                <span className="capitalize text-zinc-700">{m} mode contrast</span>
                {n === 0 ? (
                  <span className="text-emerald-700">All pass</span>
                ) : (
                  <span className="text-amber-700">
                    {n} below 4.5:1
                  </span>
                )}
              </button>
            )
          })}
          <div className="flex items-center justify-between px-2 py-1.5">
            <span className="text-zinc-700">Locked values</span>
            <span className="text-zinc-500">{locks.length}</span>
          </div>
          {props.isLocked(primaryPath) && <p className="px-2 text-[11px] text-amber-700">Primary is locked in {mode} mode.</p>}
        </div>
      </PanelSection>

      <PanelSection title="Libraries">
        {ADAPTERS.map((a) => (
          <div key={a.id} className="flex flex-col gap-0.5 rounded-[6px] border border-zinc-200 px-3 py-2">
            <span className="text-[12px] font-medium text-zinc-900">{a.name}</span>
            <span className="text-[11px] text-zinc-500">{a.description}</span>
          </div>
        ))}
        <p className="text-[11px] text-zinc-500">
          Tokens are stored library-neutral in design-system/tokens.json. Each library adapter writes its own theme file.
        </p>
      </PanelSection>
    </>
  )
}

export { getPath }
