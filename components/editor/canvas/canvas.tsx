"use client"

import * as React from "react"

import { ACTIVE_ADAPTER } from "@/lib/ds/adapters"
import type { CanvasToEditor, EditorToCanvas } from "@/lib/ds/bridge"
import { googleFontUrls } from "@/lib/ds/fonts"
import type { DesignTokens, Mode } from "@/lib/ds/types"
import initialTokens from "@/design-system/tokens.json"

import { CANVASES, FOUNDATIONS, renderFoundation } from "./registry"

const canvas = CANVASES[ACTIVE_ADAPTER.id]

function applyTokens(tokens: DesignTokens, mode: Mode) {
  const root = document.documentElement
  const vars = ACTIVE_ADAPTER.previewVars
    ? { ...ACTIVE_ADAPTER.previewVars(tokens, "light"), ...ACTIVE_ADAPTER.previewVars(tokens, mode) }
    : {}
  for (const [k, v] of Object.entries(vars)) root.style.setProperty(k, v)
  root.classList.toggle("dark", mode === "dark")
  root.style.colorScheme = mode

  // Load any fonts not already on the page
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

function post(msg: CanvasToEditor) {
  window.parent?.postMessage(msg, window.location.origin)
}

export function Canvas() {
  const [tokens, setTokens] = React.useState<DesignTokens>(initialTokens as DesignTokens)
  const [mode, setMode] = React.useState<Mode>("light")
  const [view, setView] = React.useState<string>("overview")

  React.useEffect(() => {
    const v = new URLSearchParams(window.location.search).get("view")
    // eslint-disable-next-line react-hooks/set-state-in-effect -- read the URL once the static page is in the browser
    if (v) setView(v)
    const onMessage = (e: MessageEvent<EditorToCanvas>) => {
      if (e.origin !== window.location.origin || !e.data || typeof e.data !== "object") return
      if (e.data.type === "ds:tokens") {
        setTokens(e.data.tokens)
        setMode(e.data.mode)
        applyTokens(e.data.tokens, e.data.mode)
      } else if (e.data.type === "ds:view") {
        setView(e.data.view)
        window.scrollTo(0, 0)
      }
    }
    window.addEventListener("message", onMessage)
    post({ type: "ds:ready" })
    return () => window.removeEventListener("message", onMessage)
  }, [])

  let content: React.ReactNode = null
  let title = ""
  let description = ""

  if (view === "overview") {
    return <div className="bg-background min-h-screen">{canvas.overview.render()}</div>
  } else if (view.startsWith("foundation:")) {
    const id = view.slice("foundation:".length)
    title = FOUNDATIONS.find((f) => f.id === id)?.name ?? id
    content = renderFoundation(id, tokens, mode)
  } else if (view === "components") {
    return (
      <div className="bg-background min-h-screen p-6 md:p-10">
        <div className="mx-auto flex max-w-5xl flex-col gap-8">
          <h1 className="font-heading text-3xl font-semibold tracking-tight">All components</h1>
          <div className="grid gap-6 lg:grid-cols-2">
            {canvas.demos.map((demo) => (
              <div
                key={demo.id}
                role="link"
                tabIndex={0}
                onClick={() => post({ type: "ds:navigate", view: `component:${demo.id}` })}
                onKeyDown={(e) => {
                  if (e.key === "Enter") post({ type: "ds:navigate", view: `component:${demo.id}` })
                }}
                className="bg-card hover:ring-primary/40 flex min-w-0 cursor-pointer flex-col gap-4 overflow-hidden rounded-xl border p-5 text-left transition hover:ring-2"
              >
                <div>
                  <div className="font-medium">{demo.name}</div>
                  <div className="text-muted-foreground text-sm">{demo.description}</div>
                </div>
                <div className="pointer-events-none flex min-h-24 items-center justify-center">{demo.render()}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    )
  } else if (view.startsWith("component:")) {
    const demo = canvas.demos.find((d) => d.id === view.slice("component:".length))
    title = demo?.name ?? "Component"
    description = demo?.description ?? ""
    content = demo ? (
      <div className="bg-card flex min-h-64 items-center justify-center rounded-xl border p-10">{demo.render()}</div>
    ) : null
  }

  return (
    <div className="bg-background min-h-screen p-6 md:p-10">
      <div className="mx-auto flex max-w-5xl flex-col gap-8">
        <div>
          <h1 className="font-heading text-3xl font-semibold tracking-tight">{title}</h1>
          {description && <p className="text-muted-foreground mt-1">{description}</p>}
        </div>
        {content}
      </div>
    </div>
  )
}
