"use client"

import * as React from "react"

import initialTokens from "@/design-system/tokens.json"
import { ACTIVE_ADAPTER } from "@/lib/ds/adapters"
import classes from "@/design-system/component-classes.json"
import { BASE_PATH, type CanvasDisplay, type CanvasLayer, type CanvasToEditor, type ComponentsFilter, type EditorToCanvas } from "@/lib/ds/bridge"
import { googleFontUrls } from "@/lib/ds/fonts"
import { forcedStateCss } from "@/lib/ds/force-state"
import { setIconSettings } from "@/lib/ds/icons"
import { normalizeTokens, type DesignTokens, type Mode, type OverrideState } from "@/lib/ds/types"

import { BLOCK_CATEGORIES } from "@/components/blocks"

import { CHROME_CARD, chromeVars, MenuPreview, Section } from "./foundations"
import { CANVASES, FOUNDATIONS, renderFoundation } from "./registry"

const canvas = CANVASES[ACTIVE_ADAPTER.id]
const STATES: OverrideState[] = ["hover", "focus", "active", "disabled", "open"]

function post(msg: CanvasToEditor) {
  window.parent?.postMessage(msg, window.location.origin)
}

function applyTokens(tokens: DesignTokens, mode: Mode) {
  let style = document.getElementById("ds-preview") as HTMLStyleElement | null
  if (!style) {
    style = document.createElement("style")
    style.id = "ds-preview"
    document.head.appendChild(style)
  }
  style.textContent = ACTIVE_ADAPTER.previewCss ? ACTIVE_ADAPTER.previewCss(tokens) : ""
  const root = document.documentElement
  root.classList.toggle("dark", mode === "dark")
  root.style.colorScheme = mode
  setIconSettings({ library: tokens.icons?.library ?? "hugeicons", strokeWidth: tokens.icons?.strokeWidth ?? 2 })
  for (const href of googleFontUrls(tokens.fonts)) {
    if (!document.head.querySelector(`link[data-ds-font][href="${CSS.escape(href)}"]`)) {
      const link = document.createElement("link")
      link.rel = "stylesheet"
      link.href = href
      link.dataset.dsFont = ""
      document.head.appendChild(link)
    }
  }
}

/* ------------------------------------------------------------------ */
/* Layers and selection                                                */
/* ------------------------------------------------------------------ */

const isChrome = (el: Element) => !!el.closest("[data-ds-chrome]")

function scanLayers(): CanvasLayer[] {
  const map = new Map<string, CanvasLayer>()
  document.body.querySelectorAll<HTMLElement>("[data-slot]").forEach((el) => {
    if (isChrome(el)) return
    const slot = el.dataset.slot!
    let depth = 0
    for (let p = el.parentElement?.closest("[data-slot]"); p; p = p.parentElement?.closest("[data-slot]")) depth++
    const layer = map.get(slot) ?? { slot, depth, count: 0, variants: [], sizes: [] }
    layer.count++
    layer.depth = Math.min(layer.depth, depth)
    if (el.dataset.variant && !layer.variants.includes(el.dataset.variant)) layer.variants.push(el.dataset.variant)
    if (el.dataset.size && !layer.sizes.includes(el.dataset.size)) layer.sizes.push(el.dataset.size)
    map.set(slot, layer)
  })
  return Array.from(map.values())
}

interface Target {
  slot: string
  variant?: string
  size?: string
  /** Picked by the editor, not the user: drives the inspector but isn't outlined */
  auto?: boolean
}

function matches(el: HTMLElement, t: Target) {
  return el.dataset.slot === t.slot && (!t.variant || el.dataset.variant === t.variant) && (!t.size || el.dataset.size === t.size)
}

function Highlights({ target, hover }: { target: Target | null; hover: HTMLElement | null }) {
  const [, force] = React.useReducer((n: number) => n + 1, 0)
  React.useEffect(() => {
    if (!target && !hover) return
    let id = 0
    const tick = () => {
      force()
      id = requestAnimationFrame(tick)
    }
    id = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(id)
  }, [target, hover])

  const boxes: { rect: DOMRect; label?: string; kind: "selected" | "hover" }[] = []
  if (target) {
    const els = Array.from(document.body.querySelectorAll<HTMLElement>(`[data-slot="${CSS.escape(target.slot)}"]`))
      .filter((el) => !isChrome(el) && matches(el, target))
      .slice(0, 40)
    els.forEach((el, i) => {
      const rect = el.getBoundingClientRect()
      if (rect.width || rect.height)
        boxes.push({
          rect,
          kind: "selected",
          label: i === 0 ? `${target.slot}${target.variant ? ` · ${target.variant}` : ""}${target.size ? ` · ${target.size}` : ""}` : undefined,
        })
    })
  }
  if (hover && hover.isConnected) boxes.push({ rect: hover.getBoundingClientRect(), kind: "hover", label: hover.dataset.slot })

  return (
    <div data-ds-chrome="" className="pointer-events-none fixed inset-0 z-[2147483647]" style={{ fontFamily: "ui-sans-serif, system-ui, sans-serif" }}>
      {boxes.map((b, i) => (
        <div
          key={i}
          className="absolute"
          style={{
            left: b.rect.left - 2,
            top: b.rect.top - 2,
            width: b.rect.width + 4,
            height: b.rect.height + 4,
            border: b.kind === "selected" ? "2px solid #2563eb" : "1px dashed #2563eb",
            borderRadius: 4,
          }}
        >
          {b.label && (
            <span
              className="absolute -top-5 left-0 rounded-[3px] px-1.5 py-px text-[11px] whitespace-nowrap text-white"
              style={{ background: "#2563eb" }}
            >
              {b.label}
            </span>
          )}
          {b.kind === "selected" && b.label && (
            <span
              className="absolute -bottom-5 left-1/2 -translate-x-1/2 rounded-[3px] px-1.5 py-px text-[10px] whitespace-nowrap text-white"
              style={{ background: "#2563eb" }}
            >
              {Math.round(b.rect.width)} × {Math.round(b.rect.height)}
            </span>
          )}
        </div>
      ))}
    </div>
  )
}

/** Keeps one broken demo from taking down the whole canvas */
class DemoBoundary extends React.Component<{ children: React.ReactNode; resetKey: string }, { error: Error | null; key: string }> {
  state = { error: null as Error | null, key: this.props.resetKey }
  static getDerivedStateFromError(error: Error) {
    return { error }
  }
  static getDerivedStateFromProps(props: { resetKey: string }, state: { error: Error | null; key: string }) {
    return props.resetKey !== state.key ? { error: null, key: props.resetKey } : null
  }
  render() {
    if (this.state.error)
      return (
        <div className="text-muted-foreground flex min-h-40 flex-col items-center justify-center gap-1 rounded-xl border border-dashed p-6 text-center text-sm">
          <span className="text-foreground font-medium">This example couldn&apos;t be shown</span>
          <span className="font-mono text-xs">{this.state.error.message}</span>
        </div>
      )
    return this.props.children
  }
}

/* ------------------------------------------------------------------ */
/* Canvas                                                              */
/* ------------------------------------------------------------------ */

export function Canvas() {
  const [tokens, setTokens] = React.useState<DesignTokens>(() => normalizeTokens(initialTokens as DesignTokens))
  const [mode, setMode] = React.useState<Mode>("light")
  const [assets, setAssets] = React.useState<Record<string, string>>({})
  const [view, setView] = React.useState<string>("overview")
  const [display, setDisplay] = React.useState<CanvasDisplay>("demo")
  const [previewState, setPreviewState] = React.useState<OverrideState | null>(null)
  const [interact, setInteract] = React.useState(true)
  const [filter, setFilter] = React.useState<ComponentsFilter>({ tab: "all", q: "" })
  const [target, setTarget] = React.useState<Target | null>(null)
  const [hover, setHover] = React.useState<HTMLElement | null>(null)
  const interactRef = React.useRef(interact)
  React.useEffect(() => {
    interactRef.current = interact
  }, [interact])

  // Messages from the editor
  React.useEffect(() => {
    const v = new URLSearchParams(window.location.search).get("view")
    // eslint-disable-next-line react-hooks/set-state-in-effect -- read the URL once the static page is in the browser
    if (v) setView(v)
    const onMessage = (e: MessageEvent<EditorToCanvas>) => {
      if (e.origin !== window.location.origin || !e.data || typeof e.data !== "object") return
      const msg = e.data
      if (msg.type === "ds:ping") post({ type: "ds:ready" })
      else if (msg.type === "ds:tokens") {
        setTokens(msg.tokens)
        setMode(msg.mode)
        setAssets(msg.assets ?? {})
        applyTokens(msg.tokens, msg.mode)
      } else if (msg.type === "ds:view") {
        setView((prev) => {
          if (prev !== msg.view) window.scrollTo(0, 0)
          return msg.view
        })
        setDisplay(msg.display)
        setPreviewState(msg.state)
        setInteract(msg.interact)
        if (msg.filter) setFilter(msg.filter)
      } else if (msg.type === "ds:select") {
        setTarget(msg.slot ? { slot: msg.slot, variant: msg.variant, size: msg.size, auto: msg.auto } : null)
      }
    }
    window.addEventListener("message", onMessage)
    post({ type: "ds:ready" })
    return () => window.removeEventListener("message", onMessage)
  }, [])

  // State preview (hover, focus, …): your overrides for that state respond to the
  // root class, and every component's own state styles are forced from the stylesheets
  React.useEffect(() => {
    const root = document.documentElement
    for (const s of STATES) root.classList.toggle(`ds-preview-${s}`, previewState === s)
    let style = document.getElementById("ds-force-state") as HTMLStyleElement | null
    if (!previewState) {
      style?.remove()
      return
    }
    // Rebuild shortly after changes, so dragging a slider doesn't rescan on every step
    const id = window.setTimeout(() => {
      if (!style) {
        style = document.createElement("style")
        style.id = "ds-force-state"
      }
      style.textContent = ""
      style.textContent = forcedStateCss(document, previewState, ["ds-force-state"])
      document.head.appendChild(style) // last, so it follows the stylesheets it copies
    }, 60)
    return () => window.clearTimeout(id)
  }, [previewState, tokens])

  // Report layers whenever the page changes
  React.useEffect(() => {
    let last = ""
    let timer = 0
    const report = () => {
      const layers = scanLayers()
      const json = JSON.stringify(layers)
      if (json !== last) {
        last = json
        post({ type: "ds:layers", layers })
      }
    }
    const schedule = () => {
      window.clearTimeout(timer)
      timer = window.setTimeout(report, 150)
    }
    const obs = new MutationObserver((records) => {
      if (records.every((r) => isChrome(r.target as Element))) return
      schedule()
    })
    obs.observe(document.body, { subtree: true, childList: true, attributes: true, attributeFilter: ["data-slot", "data-variant", "data-size"] })
    schedule()
    return () => {
      obs.disconnect()
      window.clearTimeout(timer)
    }
  }, [view, display])

  // Click-to-select (when not interacting)
  React.useEffect(() => {
    const find = (e: Event) => {
      const el = (e.target as Element | null)?.closest?.("[data-slot]") as HTMLElement | null
      return el && !isChrome(el) ? el : null
    }
    const block = (e: Event) => {
      if (interactRef.current) return
      if (!find(e)) return
      e.preventDefault()
      e.stopPropagation()
    }
    const onClick = (e: MouseEvent) => {
      if (interactRef.current) return
      const el = find(e)
      if (!el) return
      e.preventDefault()
      e.stopPropagation()
      const t = { slot: el.dataset.slot!, variant: el.dataset.variant, size: el.dataset.size }
      setTarget(t)
      post({ type: "ds:selected", ...t })
    }
    const onMove = (e: MouseEvent) => {
      if (interactRef.current) {
        setHover(null)
        return
      }
      setHover(find(e))
    }
    const onLeave = () => setHover(null)
    document.addEventListener("pointerdown", block, true)
    document.addEventListener("mousedown", block, true)
    document.addEventListener("click", onClick, true)
    document.addEventListener("mousemove", onMove, true)
    document.documentElement.addEventListener("mouseleave", onLeave)
    return () => {
      document.removeEventListener("pointerdown", block, true)
      document.removeEventListener("mousedown", block, true)
      document.removeEventListener("click", onClick, true)
      document.removeEventListener("mousemove", onMove, true)
      document.documentElement.removeEventListener("mouseleave", onLeave)
    }
  }, [])

  const assetUrl = React.useCallback((path?: string) => (path ? (assets[path] ?? `${BASE_PATH}${path}`) : undefined), [assets])
  const fProps = { tokens, mode, assetUrl }

  let body: React.ReactNode
  if (view === "overview" || (view.startsWith("foundation:") && display === "preview")) {
    body = canvas.overview.render()
  } else if (view === "style") {
    body = (
      <>
        {canvas.overview.render()}
        <div className="mx-auto flex max-w-6xl flex-col gap-8 px-6 pb-16 md:px-10">
          <Section title="Menus" description="Menu colour and the highlighted item follow the Style settings.">
            <div className="bg-card flex justify-center rounded-2xl p-10">
              <MenuPreview />
            </div>
          </Section>
        </div>
      </>
    )
  } else if (view.startsWith("foundation:")) {
    const id = view.slice("foundation:".length)
    const f = FOUNDATIONS.find((x) => x.id === id)
    body = (
      <Page title={f?.name ?? id} description={f?.summary}>
        {renderFoundation(id, fProps)}
      </Page>
    )
  } else if (view === "components") {
    const edited = (id: string) => {
      const parts = Object.keys((classes as ClassesJson)[id]?.slots ?? {})
      return (tokens.overrides ?? []).some((o) => o.component === id || parts.includes(o.slot))
    }
    const hasVariants = (id: string, d: (typeof canvas.demos)[number]) => !!d.matrix || Object.keys((classes as ClassesJson)[id]?.cva ?? {}).length > 0
    const q = filter.q.trim().toLowerCase()
    const list = canvas.demos.filter(
      (d) =>
        (!q || d.name.toLowerCase().includes(q)) &&
        (filter.tab === "all" ||
          (filter.tab === "edited" && edited(d.id)) ||
          (filter.tab === "variants" && hasVariants(d.id, d)) ||
          (filter.tab === "custom" && canvas.customIds.includes(d.id)))
    )
    body = (
      <Page title="All components" description="Every component this system ships, with the ones you've changed marked. Click one to open it." header>
        {list.length === 0 ? (
          <p className="text-muted-foreground text-sm">No components match.</p>
        ) : (
          <div className="grid gap-6 lg:grid-cols-2">
            {list.map((demo) => (
              <div
                key={demo.id}
                role="link"
                tabIndex={0}
                onClick={() => post({ type: "ds:navigate", view: `component:${demo.id}` })}
                onKeyDown={(e) => {
                  if (e.key === "Enter") post({ type: "ds:navigate", view: `component:${demo.id}` })
                }}
                className="flex min-w-0 cursor-pointer flex-col gap-4 overflow-hidden rounded-xl border border-[var(--chrome-line)] bg-[var(--chrome-card)] p-5 text-left transition hover:border-[var(--chrome-fg-muted)]"
              >
                <div>
                  <div className="flex items-center gap-2 font-medium">
                    {demo.name}
                    {canvas.customIds.includes(demo.id) && (
                      <span className="bg-muted text-muted-foreground rounded-md px-1.5 py-0.5 text-xs font-normal">Custom</span>
                    )}
                    {edited(demo.id) && (
                      <span className="text-muted-foreground ml-auto flex items-center gap-1.5 text-xs font-normal">
                        <span className="bg-foreground size-1.5 rounded-full" /> Edited
                      </span>
                    )}
                  </div>
                  <div className="text-muted-foreground text-sm">{demo.description}</div>
                </div>
                <div className="pointer-events-none flex min-h-24 items-center justify-center">
                  <DemoBoundary resetKey={demo.id}>{demo.examples[0].render()}</DemoBoundary>
                </div>
              </div>
            ))}
          </div>
        )}
      </Page>
    )
  } else if (view === "blocks") {
    body = (
      <Page title="Blocks" description="Ready-made sections built only from your components and tokens, so they follow every change. Click one to open it." header>
        <div className="flex flex-col gap-12">
          {BLOCK_CATEGORIES.map((category) => {
            const list = canvas.blocks.filter((b) => b.category === category)
            if (!list.length) return null
            return (
              <section key={category} className="flex flex-col gap-6">
                <h2 className="text-[13px] leading-[22px] font-medium text-[var(--chrome-canvas-fg)]">{category}</h2>
                {list.map((block) => (
                  <div
                    key={block.id}
                    role="link"
                    tabIndex={0}
                    onClick={() => post({ type: "ds:navigate", view: `block:${block.id}` })}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") post({ type: "ds:navigate", view: `block:${block.id}` })
                    }}
                    className={`${CHROME_CARD} cursor-pointer transition hover:border-[var(--chrome-fg-muted)]`}
                  >
                    <div className="flex items-baseline justify-between gap-4 border-b border-[var(--chrome-line)] px-5 py-3 text-[var(--chrome-fg)]">
                      <span className="font-medium">{block.name}</span>
                      <span className="text-muted-foreground truncate text-sm">{block.description}</span>
                    </div>
                    <div className="pointer-events-none">
                      <DemoBoundary resetKey={block.id}>{block.render()}</DemoBoundary>
                    </div>
                  </div>
                ))}
              </section>
            )
          })}
        </div>
      </Page>
    )
  } else if (view.startsWith("block:")) {
    const block = canvas.blocks.find((b) => b.id === view.slice("block:".length))
    body = block ? block.render() : <Page title="Block not found" />
  } else if (view.startsWith("component:")) {
    const demo = canvas.demos.find((d) => d.id === view.slice("component:".length))
    if (!demo) body = <Page title="Component not found" />
    else if (display === "matrix" && demo.matrix) {
      const { rows, cols, render } = demo.matrix
      const colValues = cols?.values ?? [""]
      body = (
        <Page title={demo.name} description={`${rows.prop}${cols ? ` × ${cols.prop}` : ""} matrix`}>
          <div className="overflow-x-auto">
            <table className="border-separate border-spacing-2">
              <thead>
                <tr>
                  <th />
                  {cols &&
                    colValues.map((c) => (
                      <th key={c} className="text-muted-foreground px-2 text-center font-mono text-xs font-normal">
                        {c}
                      </th>
                    ))}
                </tr>
              </thead>
              <tbody>
                {rows.values.map((r) => (
                  <tr key={r}>
                    <th className="text-muted-foreground pr-3 text-right font-mono text-xs font-normal">{r}</th>
                    {colValues.map((c) => (
                      <td key={c} className="rounded-xl border border-[var(--chrome-line)] bg-[var(--chrome-card)] p-4 text-center align-middle">
                        <div className="flex items-center justify-center">{render({ [rows.prop]: r, ...(cols ? { [cols.prop]: c } : {}) })}</div>
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Page>
      )
    } else {
      body = (
        <Page title={demo.name} description={demo.description}>
          <div className="flex flex-col gap-10">
            {demo.examples.map((ex) => (
              <section key={ex.name} className="flex flex-col gap-3">
                <h2 className="text-[13px] leading-[22px] font-medium text-[var(--chrome-canvas-fg)]">{ex.name}</h2>
                <div className="flex min-h-40 items-center justify-center rounded-xl border border-[var(--chrome-line)] bg-[var(--chrome-card)] p-8 md:p-10">
                  <DemoBoundary resetKey={`${view}:${ex.name}`}>{ex.render()}</DemoBoundary>
                </div>
              </section>
            ))}
          </div>
        </Page>
      )
    }
  }

  return (
    <div className="min-h-screen bg-[var(--chrome-canvas)]" style={chromeVars(mode)}>
      <DemoBoundary resetKey={`${view}:${display}`}>{body}</DemoBoundary>
      {!interact && <Highlights target={target?.auto ? null : target} hover={hover} />}
      {interact && target && !target.auto && <Highlights target={target} hover={null} />}
    </div>
  )
}

/** A canvas page. The page name lives in the editor's toolbar; `header` adds a short intro (All components, Blocks). */
function Page({ title, description, header, children }: { title: string; description?: string; header?: boolean; children?: React.ReactNode }) {
  return (
    <div className="p-6">
      <div className="mx-auto flex w-full max-w-6xl flex-col gap-8">
        {header && (
          <div className="flex max-w-[353px] flex-col gap-1">
            <h1 className="text-[13px] leading-[22px] font-medium text-[var(--chrome-canvas-fg)]">{title}</h1>
            {description && <p className="text-[11px] leading-4 text-[var(--chrome-canvas-fg-muted)]">{description}</p>}
          </div>
        )}
        {children}
      </div>
    </div>
  )
}

type ClassesJson = Record<string, { slots?: Record<string, string[]>; cva?: Record<string, unknown> }>
