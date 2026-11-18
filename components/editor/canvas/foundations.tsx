"use client"

import * as React from "react"

import { contrastLevel, contrastRatio } from "@/lib/ds/color"
import { COLOR_GROUPS, SHADOW_LEVELS, type DesignTokens, type Mode } from "@/lib/ds/types"

function Section({ title, description, children }: { title: string; description?: string; children: React.ReactNode }) {
  return (
    <section className="flex flex-col gap-4">
      <div>
        <h2 className="font-heading text-xl font-semibold tracking-tight">{title}</h2>
        {description && <p className="text-muted-foreground text-sm">{description}</p>}
      </div>
      {children}
    </section>
  )
}

export function ColorsView({ tokens, mode }: { tokens: DesignTokens; mode: Mode }) {
  const colors = tokens.colors[mode]
  return (
    <div className="flex flex-col gap-10">
      {COLOR_GROUPS.map((group) => (
        <Section key={group.id} title={group.label} description={group.description}>
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
            {group.tokens.map(({ token, label }) => (
              <div key={token} className="flex flex-col gap-2">
                <div
                  className="h-20 rounded-lg border"
                  style={{ background: `var(--${token})` }}
                  title={colors[token]}
                />
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
    </div>
  )
}

const TYPE_SCALE = [
  { label: "Display", className: "font-heading text-5xl font-semibold tracking-tight" },
  { label: "Heading 1", className: "font-heading text-4xl font-semibold tracking-tight" },
  { label: "Heading 2", className: "font-heading text-3xl font-semibold tracking-tight" },
  { label: "Heading 3", className: "font-heading text-2xl font-semibold" },
  { label: "Heading 4", className: "font-heading text-xl font-semibold" },
  { label: "Body large", className: "text-lg" },
  { label: "Body", className: "text-base" },
  { label: "Small", className: "text-sm" },
  { label: "Caption", className: "text-muted-foreground text-xs" },
]

export function TypographyView({ tokens }: { tokens: DesignTokens }) {
  return (
    <div className="flex flex-col gap-10">
      <Section title="Families">
        <div className="grid gap-4 md:grid-cols-3">
          {(
            [
              ["Body", "sans", "font-sans"],
              ["Headings", "heading", "font-heading"],
              ["Code", "mono", "font-mono"],
            ] as const
          ).map(([label, key, cls]) => (
            <div key={key} className="bg-card flex min-w-0 flex-col gap-2 overflow-hidden rounded-xl border p-5">
              <div className="text-muted-foreground text-xs font-medium uppercase tracking-wide">{label}</div>
              <div className={`${cls} text-4xl`}>Aa</div>
              <div className={`${cls} text-lg`}>{tokens.fonts[key]}</div>
              <div className={`${cls} text-muted-foreground text-sm break-all`}>
                ABCDEFGHIJKLMNOPQRSTUVWXYZ abcdefghijklmnopqrstuvwxyz 0123456789
              </div>
            </div>
          ))}
        </div>
      </Section>
      <Section title="Scale">
        <div className="flex flex-col divide-y rounded-xl border">
          {TYPE_SCALE.map((t) => (
            <div key={t.label} className="flex items-baseline gap-6 px-5 py-4">
              <div className="text-muted-foreground w-24 shrink-0 text-xs">{t.label}</div>
              <div className={t.className}>Care that fits your life</div>
            </div>
          ))}
        </div>
      </Section>
      <Section title="In context">
        <article className="bg-card max-w-2xl rounded-xl border p-6">
          <h3 className="font-heading text-2xl font-semibold tracking-tight">Preparing for your visit</h3>
          <p className="text-muted-foreground mt-2">
            Bring your health card and a list of any medications you take. If you need to reschedule, let us know at
            least a day ahead.
          </p>
          <pre className="bg-muted mt-4 rounded-lg p-3 font-mono text-sm">appointment.confirm({"{ id: 20481 }"})</pre>
        </article>
      </Section>
    </div>
  )
}

const RADIUS_SCALE = [
  ["sm", "rounded-sm"],
  ["md", "rounded-md"],
  ["lg", "rounded-lg"],
  ["xl", "rounded-xl"],
  ["2xl", "rounded-2xl"],
  ["3xl", "rounded-3xl"],
  ["4xl", "rounded-4xl"],
] as const

export function RadiusView({ tokens }: { tokens: DesignTokens }) {
  return (
    <div className="flex flex-col gap-10">
      <Section title="Radius scale" description={`Base radius ${tokens.radius}rem. Every size is calculated from it.`}>
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-4 lg:grid-cols-7">
          {RADIUS_SCALE.map(([name, cls]) => (
            <div key={name} className="flex flex-col gap-2">
              <div className={`bg-primary/15 border-primary h-20 border-2 ${cls}`} />
              <div className="text-sm font-medium">{name}</div>
            </div>
          ))}
        </div>
      </Section>
    </div>
  )
}

export function ShadowsView({ tokens, mode }: { tokens: DesignTokens; mode: Mode }) {
  return (
    <Section title="Shadows" description="Elevation from subtle to strong">
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
  )
}

const SPACING_STEPS = [1, 2, 3, 4, 6, 8, 12, 16, 24]

export function SpacingView({ tokens }: { tokens: DesignTokens }) {
  return (
    <div className="flex flex-col gap-10">
      <Section title="Spacing scale" description={`Base unit ${tokens.spacing}rem. p-4 = 4 × base.`}>
        <div className="flex flex-col gap-3">
          {SPACING_STEPS.map((n) => (
            <div key={n} className="flex items-center gap-4">
              <div className="text-muted-foreground w-10 text-right font-mono text-xs">{n}</div>
              <div className="bg-primary h-4 rounded-sm" style={{ width: `calc(var(--spacing) * ${n})` }} />
              <div className="text-muted-foreground font-mono text-xs">{(tokens.spacing * n).toFixed(3).replace(/\.?0+$/, "")}rem</div>
            </div>
          ))}
        </div>
      </Section>
      <Section title="In context">
        <div className="bg-card flex max-w-md flex-col gap-4 rounded-xl border p-6">
          <div className="font-heading text-lg font-semibold">Padding and gaps follow the base unit</div>
          <div className="flex gap-2">
            <div className="bg-muted rounded-md px-3 py-2 text-sm">px-3 py-2</div>
            <div className="bg-muted rounded-md px-4 py-3 text-sm">px-4 py-3</div>
          </div>
        </div>
      </Section>
    </div>
  )
}
