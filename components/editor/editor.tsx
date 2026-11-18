"use client"

import * as React from "react"

import initialTokens from "@/design-system/tokens.json"
import { ACTIVE_ADAPTER, ADAPTERS } from "@/lib/ds/adapters"
import { importShadcnCss } from "@/lib/ds/adapters/shadcn"
import { BASE_PATH, type CanvasDisplay, type CanvasLayer, type CanvasToEditor, type EditorToCanvas } from "@/lib/ds/bridge"
import { COMPONENT_CLASSES, SLOT_COMPONENT } from "@/lib/ds/classes"
import { commitFiles, DEFAULT_REPO, readRepoFile, verifyToken, type RepoConfig } from "@/lib/ds/github"
import type { AgentContext } from "@/lib/ds/agent"
import { decodeShare, SHARE_PREFIX } from "@/lib/ds/share"
import { cloneTokens, getPath, isPathLocked, sameTokens, setPath, storage, useTokenHistory } from "@/lib/ds/store"
import type { DesignTokens, Mode, OverrideState } from "@/lib/ds/types"

import { AgentPanel } from "./agent-panel"
import { CANVASES, FOUNDATIONS } from "./canvas/registry"
import { ChromeButton, cx, FieldRow, Icons, Modal, Segmented, TextInput, Toast } from "./chrome"
import { ComponentPanel, STATES, type Selection } from "./component-panel"
import {
  BrandPanel,
  ColorsPanel,
  ControlsPanel,
  IconsPanel,
  LintPanel,
  RadiusPanel,
  ShadowsPanel,
  SpacingPanel,
  StylePanel,
  SystemPanel,
  TypographyPanel,
  type InspectorProps,
  type PendingAsset,
} from "./inspector"
import { CommentsPanel, ShareDialog, useComments } from "./collab"
import { BlockPanel, NewComponentDialog } from "./library-panels"
import { LintPage } from "./lint-page"

const TOKENS_PATH = "design-system/tokens.json"
const canvas = CANVASES[ACTIVE_ADAPTER.id]

type Viewport = "desktop" | "tablet" | "mobile"
const VIEWPORT_WIDTH: Record<Viewport, string> = { desktop: "100%", tablet: "834px", mobile: "390px" }

type IconCmp = (p: React.SVGProps<SVGSVGElement>) => React.ReactElement
const FOUNDATION_ICONS: Record<string, IconCmp> = {
  colors: Icons.palette,
  typography: Icons.type,
  radius: Icons.radius,
  shadows: Icons.shadow,
  spacing: Icons.spacing,
  controls: Icons.toggle,
  icons: Icons.star,
  brand: Icons.image,
}

function NavItem({ id, label, icon: Icon, active, onSelect, badge }: { id: string; label: string; icon?: IconCmp; active: boolean; onSelect: (id: string) => void; badge?: React.ReactNode }) {
  return (
    <button
      type="button"
      onClick={() => onSelect(id)}
      aria-current={active ? "page" : undefined}
      className={cx(
        "flex h-7 w-full items-center gap-2 rounded-[6px] px-2 text-left text-[13px] transition-colors",
        active ? "bg-zinc-200/70 font-medium text-zinc-900" : "text-zinc-600 hover:bg-zinc-100 hover:text-zinc-900"
      )}
    >
      {Icon && <Icon width={14} height={14} className="shrink-0 text-zinc-500" />}
      <span className="flex-1 truncate">{label}</span>
      {badge}
    </button>
  )
}

/** Flat list of changed token paths between two token sets */
function diffTokens(a: DesignTokens, b: DesignTokens, prefix = ""): { path: string; before: string; after: string }[] {
  const out: { path: string; before: string; after: string }[] = []
  const walk = (x: unknown, y: unknown, path: string) => {
    // One entry per component change, not per field
    const atomic = /^overrides\.\d+$/.test(path) || path === "locks"
    if (atomic) {
      if (JSON.stringify(x) !== JSON.stringify(y))
        out.push({ path, before: x === undefined ? "–" : JSON.stringify(x), after: y === undefined ? "–" : JSON.stringify(y) })
      return
    }
    // Compare a missing section with an empty one so each new entry is listed
    if (x === undefined && typeof y === "object" && y) x = Array.isArray(y) ? [] : {}
    if (y === undefined && typeof x === "object" && x) y = Array.isArray(x) ? [] : {}
    if (typeof x === "object" && x && typeof y === "object" && y && Array.isArray(x) === Array.isArray(y)) {
      const keys = new Set([...Object.keys(x), ...Object.keys(y)])
      for (const k of keys) walk((x as Record<string, unknown>)[k], (y as Record<string, unknown>)[k], path ? `${path}.${k}` : k)
    } else if (JSON.stringify(x) !== JSON.stringify(y)) {
      out.push({ path, before: x === undefined ? "–" : JSON.stringify(x), after: y === undefined ? "–" : JSON.stringify(y) })
    }
  }
  walk(a, b, prefix)
  return out
}

function viewLabel(view: string) {
  if (view === "overview") return "Overview"
  if (view === "style") return "Style"
  if (view === "lint") return "Lint"
  if (view === "components") return "All components"
  if (view === "blocks") return "Blocks"
  if (view.startsWith("block:")) return canvas.blocks.find((b) => `block:${b.id}` === view)?.name ?? "Block"
  if (view.startsWith("foundation:")) return FOUNDATIONS.find((f) => `foundation:${f.id}` === view)?.name ?? "Foundation"
  if (view.startsWith("component:")) return canvas.demos.find((d) => `component:${d.id}` === view)?.name ?? "Component"
  return view
}

function download(name: string, content: string, type: string) {
  const url = URL.createObjectURL(new Blob([content], { type }))
  const a = document.createElement("a")
  a.href = url
  a.download = name
  a.click()
  setTimeout(() => URL.revokeObjectURL(url), 1000)
}

/** Views where clicking the canvas can select parts */
const selectable = (view: string) => view === "overview" || view === "style" || view.startsWith("component:") || view.startsWith("block:")

type SideTab = "inspect" | "agent" | "comments"

export function Editor() {
  const built = initialTokens as DesignTokens
  const history = useTokenHistory(built)
  const { tokens } = history
  const [baseline, setBaseline] = React.useState<DesignTokens>(built)
  const [mode, setMode] = React.useState<Mode>("light")
  const [view, setViewRaw] = React.useState("overview")
  const [display, setDisplay] = React.useState<CanvasDisplay>("demo")
  const [interact, setInteract] = React.useState(false)
  const [previewState, setPreviewState] = React.useState<OverrideState | null>(null)
  const [selection, setSelection] = React.useState<Selection | null>(null)
  const [layers, setLayers] = React.useState<CanvasLayer[]>([])
  const [assets, setAssets] = React.useState<Record<string, PendingAsset>>({})
  const [viewport, setViewport] = React.useState<Viewport>("desktop")
  const [zoom, setZoom] = React.useState(1)
  const [search, setSearch] = React.useState("")
  const [repo] = React.useState<RepoConfig>(DEFAULT_REPO)
  const [token, setToken] = React.useState<string | null>(null)
  const [saveOpen, setSaveOpen] = React.useState(false)
  const [exportOpen, setExportOpen] = React.useState<false | "css" | "import">(false)
  const [restored, setRestored] = React.useState(false)
  const [toast, setToast] = React.useState<{ message: React.ReactNode; tone?: "default" | "error" } | null>(null)
  // Counts ds:ready messages, so a reloaded canvas gets the tokens, view and selection again
  const [canvasReady, setCanvasReady] = React.useState(0)
  const [shareOpen, setShareOpen] = React.useState(false)
  const [newComponentOpen, setNewComponentOpen] = React.useState(false)
  const [sideTab, setSideTab] = React.useState<SideTab>("inspect")
  const [shared, setShared] = React.useState(false)
  const iframeRef = React.useRef<HTMLIFrameElement>(null)
  // The iframe loads once; later view changes are sent as messages
  const [canvasSrc] = React.useState(() => `${BASE_PATH}/editor/canvas/?view=overview`)
  const touched = React.useRef(false)
  const draftKey = `ds-editor:draft:${repo.owner}/${repo.repo}`
  const assetsKey = `${draftKey}:assets`
  const tokenKey = `ds-editor:github-token:${repo.owner}/${repo.repo}`

  const assetList = React.useMemo(() => Object.values(assets), [assets])
  const dirty = !sameTokens(tokens, baseline) || assetList.length > 0
  const changes = React.useMemo(() => (sameTokens(tokens, baseline) ? [] : diffTokens(baseline, tokens)), [baseline, tokens])
  const changeCount = changes.length + assetList.length

  const viewRef = React.useRef(view)
  React.useEffect(() => {
    viewRef.current = view
  }, [view])
  const setView = React.useCallback((v: string) => {
    if (v === viewRef.current) return
    viewRef.current = v
    setDisplay("demo")
    setPreviewState(null)
    setSelection(null)
    setLayers([])
    setViewRaw(v)
  }, [])

  /* ---------- share links ---------- */
  // Open a shared draft on top of yours (one undo gets yours back), then tidy the URL
  // so reloading doesn't apply it again over later edits
  const { set: setTokensForShare } = history
  const openShareLink = React.useCallback(
    (data: string) => {
      touched.current = true
      decodeShare(data).then((payload) => {
        const view = payload?.view ?? viewRef.current
        window.history.replaceState(null, "", window.location.pathname + window.location.search + (view === "overview" ? "" : `#${view}`))
        if (!payload) {
          setToast({ message: "This share link is damaged or incomplete, so it couldn't be opened.", tone: "error" })
          return
        }
        setTokensForShare(payload.tokens)
        setRestored(false)
        setShared(true)
        if (payload.view) setView(payload.view)
      })
    },
    [setTokensForShare, setView]
  )

  /* ---------- load: token, draft, latest tokens from GitHub ---------- */
  /* eslint-disable react-hooks/set-state-in-effect -- browser-only state (URL, localStorage) is read after the static page loads */
  React.useEffect(() => {
    const t = storage.get(tokenKey)
    if (t) setToken(t)
    const rawHash = window.location.hash.slice(1)
    const shareData = rawHash.startsWith(SHARE_PREFIX) ? rawHash.slice(SHARE_PREFIX.length) : null
    const hash = shareData ? "" : decodeURIComponent(rawHash)
    if (hash) setViewRaw(hash)
    if (shareData) openShareLink(shareData)

    const draftRaw = storage.get(draftKey)
    let draft: DesignTokens | null = null
    try {
      draft = draftRaw ? (JSON.parse(draftRaw) as DesignTokens) : null
    } catch {}
    let draftAssets: Record<string, PendingAsset> = {}
    try {
      draftAssets = JSON.parse(storage.get(assetsKey) ?? "{}")
    } catch {}
    if (Object.keys(draftAssets).length) setAssets(draftAssets)
    if (draft && !sameTokens(draft, built)) {
      history.replace(draft)
      setRestored(true)
    }

    readRepoFile(TOKENS_PATH, repo, t)
      .then((text) => {
        const remote = JSON.parse(text) as DesignTokens
        setBaseline(remote)
        if (!draft && !touched.current) history.replace(remote)
        if (draft && sameTokens(draft, remote) && !Object.keys(draftAssets).length) setRestored(false)
      })
      .catch(() => {
        /* offline or repo not reachable: keep the built-in tokens */
      })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])
  /* eslint-enable react-hooks/set-state-in-effect */

  // Follow links and back/forward that change the #view
  React.useEffect(() => {
    const onHash = () => {
      const h = window.location.hash.slice(1)
      if (h.startsWith(SHARE_PREFIX)) openShareLink(h.slice(SHARE_PREFIX.length))
      else setView(decodeURIComponent(h) || "overview")
    }
    window.addEventListener("hashchange", onHash)
    return () => window.removeEventListener("hashchange", onHash)
  }, [setView, openShareLink])

  /* ---------- persist draft ---------- */
  React.useEffect(() => {
    const id = setTimeout(() => {
      if (!sameTokens(tokens, baseline)) storage.set(draftKey, JSON.stringify(tokens))
      else storage.remove(draftKey)
      if (assetList.length) storage.set(assetsKey, JSON.stringify(assets))
      else storage.remove(assetsKey)
    }, 300)
    return () => clearTimeout(id)
  }, [tokens, baseline, assets, assetList.length, draftKey, assetsKey])

  /* ---------- canvas bridge ---------- */
  const postToCanvas = React.useCallback((msg: EditorToCanvas) => {
    iframeRef.current?.contentWindow?.postMessage(msg, window.location.origin)
  }, [])

  React.useEffect(() => {
    const onMessage = (e: MessageEvent<CanvasToEditor>) => {
      if (e.origin !== window.location.origin || !e.data || typeof e.data !== "object") return
      const msg = e.data
      if (msg.type === "ds:ready") setCanvasReady((n) => n + 1)
      else if (msg.type === "ds:navigate") setView(msg.view)
      else if (msg.type === "ds:layers") setLayers(msg.layers)
      else if (msg.type === "ds:selected") setSelection({ slot: msg.slot, variant: msg.variant, size: undefined })
    }
    window.addEventListener("message", onMessage)
    // The canvas may have said it was ready before this listener existed: ask again
    postToCanvas({ type: "ds:ping" })
    return () => window.removeEventListener("message", onMessage)
  }, [setView, postToCanvas])

  const assetUrls = React.useMemo(() => Object.fromEntries(Object.entries(assets).map(([p, a]) => [p, a.dataUrl])), [assets])

  React.useEffect(() => {
    if (canvasReady) postToCanvas({ type: "ds:tokens", tokens, mode, assets: assetUrls })
  }, [tokens, mode, assetUrls, canvasReady, postToCanvas])

  const canvasInteract = !selectable(view) || interact
  React.useEffect(() => {
    if (canvasReady) postToCanvas({ type: "ds:view", view, display, state: previewState, interact: canvasInteract })
    const hash = view === "overview" ? "" : `#${view}`
    if (window.location.hash !== hash) window.history.pushState(null, "", hash || window.location.pathname + window.location.search)
  }, [view, display, previewState, canvasInteract, canvasReady, postToCanvas])

  React.useEffect(() => {
    if (canvasReady) postToCanvas({ type: "ds:select", slot: selection?.slot ?? null, variant: selection?.variant, size: selection?.size })
  }, [selection, canvasReady, postToCanvas])

  // On a component page, select the component's main part once the canvas reports its layers
  const componentId = view.startsWith("component:") ? view.slice("component:".length) : null
  React.useEffect(() => {
    if (!componentId || selection || !layers.length) return
    const own = Object.keys(COMPONENT_CLASSES[componentId]?.slots ?? {})
    const first = own.find((s) => layers.some((l) => l.slot === s))
    // eslint-disable-next-line react-hooks/set-state-in-effect -- default selection depends on what the canvas reports
    if (first) setSelection({ slot: first })
  }, [componentId, layers, selection])

  /* ---------- editing ---------- */
  const locks = tokens.locks
  const isLocked = React.useCallback((path: string) => isPathLocked(locks, path), [locks])

  const update = React.useCallback(
    (path: string, value: unknown, key?: string) => {
      if (isLocked(path)) return
      if (JSON.stringify(getPath(tokens, path)) === JSON.stringify(value)) return
      touched.current = true
      let next: DesignTokens
      if (value === undefined) {
        next = cloneTokens(tokens)
        const keys = path.split(".")
        let o = next as unknown as Record<string, unknown>
        for (const k of keys.slice(0, -1)) {
          if (o[k] == null) o[k] = {}
          o = o[k] as Record<string, unknown>
        }
        delete o[keys[keys.length - 1]]
      } else {
        // Create missing parents (older tokens.json files lack the newer sections)
        next = cloneTokens(tokens)
        const keys = path.split(".")
        let o = next as unknown as Record<string, unknown>
        for (const k of keys.slice(0, -1)) {
          if (o[k] == null || typeof o[k] !== "object") o[k] = {}
          o = o[k] as Record<string, unknown>
        }
        o[keys[keys.length - 1]] = value
      }
      history.set(next, key)
    },
    [tokens, history, isLocked]
  )

  const updateMany = React.useCallback(
    (list: [string, unknown][], key?: string) => {
      let next = tokens
      for (const [path, value] of list) if (!isLocked(path)) next = setPath(next, path, value)
      touched.current = true
      history.set(next, key)
    },
    [tokens, history, isLocked]
  )

  const toggleLock = React.useCallback(
    (path: string) => {
      const set = new Set(tokens.locks ?? [])
      if (set.has(path)) set.delete(path)
      else if (isLocked(path)) return // locked by a whole-area lock
      else set.add(path)
      touched.current = true
      history.set({ ...cloneTokens(tokens), locks: Array.from(set).sort() })
    },
    [tokens, history, isLocked]
  )

  /* ---------- agent ---------- */
  // The agent may make several changes in one reply, so it reads the latest tokens synchronously
  const tokensRef = React.useRef(tokens)
  React.useEffect(() => {
    tokensRef.current = tokens
  }, [tokens])
  const { set: setHistory } = history
  const agentContext = React.useMemo<AgentContext>(
    () => ({
      getTokens: () => tokensRef.current,
      setTokens: (next) => {
        tokensRef.current = next
        touched.current = true
        setHistory(next)
      },
      navigate: (v) => setView(v),
      components: canvas.demos.map((d) => ({ id: d.id, name: d.name, custom: canvas.customIds.includes(d.id) })),
      blocks: canvas.blocks.map((b) => ({ id: b.id, name: b.name })),
      foundations: FOUNDATIONS.map((f) => ({ id: f.id, name: f.name })),
    }),
    [setHistory, setView]
  )

  /* ---------- comments ---------- */
  const comments = useComments(repo, token)
  const openComments = comments.threads.filter((t) => t.open)
  const pageComments = openComments.filter((t) => t.anchor.view === view).length

  /* ---------- keyboard ---------- */
  React.useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const target = e.target as HTMLElement | null
      const typing = target && (target.tagName === "INPUT" || target.tagName === "TEXTAREA" || target.tagName === "SELECT" || target.isContentEditable)
      if (e.key === "Escape" && !typing) {
        setSelection(null)
        return
      }
      const mod = e.metaKey || e.ctrlKey
      if (!mod) return
      const k = e.key.toLowerCase()
      if (k === "s") {
        e.preventDefault()
        setSaveOpen(true)
      } else if (!typing && k === "z" && !e.shiftKey) {
        e.preventDefault()
        history.undo()
      } else if (!typing && ((k === "z" && e.shiftKey) || k === "y")) {
        e.preventDefault()
        history.redo()
      }
    }
    window.addEventListener("keydown", onKey)
    return () => window.removeEventListener("keydown", onKey)
  }, [history])

  React.useEffect(() => {
    const onBeforeUnload = (e: BeforeUnloadEvent) => {
      if (dirty) e.preventDefault()
    }
    window.addEventListener("beforeunload", onBeforeUnload)
    return () => window.removeEventListener("beforeunload", onBeforeUnload)
  }, [dirty])

  /* ---------- inspector ---------- */
  const inspectorProps: InspectorProps = { tokens, mode, setMode, update, updateMany, isLocked, toggleLock }
  const demo = componentId ? canvas.demos.find((d) => d.id === componentId) : undefined
  // A part picked on the overview/style canvas opens that component's panel
  const pickedComponent = !componentId && selection && selectable(view) ? SLOT_COMPONENT[selection.slot] : undefined
  const panelComponent = componentId ?? pickedComponent
  const panelName = (panelComponent && canvas.demos.find((d) => d.id === panelComponent)?.name) || panelComponent || ""

  let inspector: React.ReactNode
  let inspectorTitle = "Design system"
  if (panelComponent) {
    inspectorTitle = "Component"
    inspector = (
      <ComponentPanel
        key={panelComponent}
        componentId={panelComponent}
        componentName={panelName}
        layers={layers}
        selection={selection}
        onSelect={setSelection}
        state={previewState}
        setState={setPreviewState}
        tokens={tokens}
        update={update}
        locked={isLocked("overrides")}
      />
    )
  } else if (view.startsWith("foundation:")) {
    inspectorTitle = viewLabel(view)
    const id = view.slice("foundation:".length)
    if (id === "colors") inspector = <ColorsPanel {...inspectorProps} />
    else if (id === "typography") inspector = <TypographyPanel {...inspectorProps} />
    else if (id === "radius") inspector = <RadiusPanel {...inspectorProps} />
    else if (id === "shadows") inspector = <ShadowsPanel {...inspectorProps} />
    else if (id === "spacing") inspector = <SpacingPanel {...inspectorProps} />
    else if (id === "controls") inspector = <ControlsPanel {...inspectorProps} />
    else if (id === "icons") inspector = <IconsPanel {...inspectorProps} />
    else if (id === "brand")
      inspector = (
        <BrandPanel
          {...inspectorProps}
          onAsset={(path, asset) => setAssets((a) => ({ ...a, [path]: asset }))}
          onError={(message) => setToast({ message, tone: "error" })}
        />
      )
  } else if (view === "style") {
    inspectorTitle = "Style"
    inspector = <StylePanel {...inspectorProps} onImport={() => setExportOpen("import")} />
  } else if (view === "lint") {
    inspectorTitle = "Lint rules"
    inspector = <LintPanel {...inspectorProps} />
  } else if (view.startsWith("block:") && canvas.blocks.some((b) => `block:${b.id}` === view)) {
    inspectorTitle = "Block"
    inspector = <BlockPanel block={canvas.blocks.find((b) => `block:${b.id}` === view)!} />
  } else {
    inspector = <SystemPanel {...inspectorProps} onNavigate={setView} />
  }

  const q = search.trim().toLowerCase()
  const demos = canvas.demos.filter((d) => !canvas.customIds.includes(d.id) && (!q || d.name.toLowerCase().includes(q)))
  const customDemos = canvas.demos.filter((d) => canvas.customIds.includes(d.id) && (!q || d.name.toLowerCase().includes(q)))
  const blocks = canvas.blocks.filter((b) => !q || b.name.toLowerCase().includes(q) || b.category.toLowerCase().includes(q))
  const foundations = FOUNDATIONS.filter((f) => !q || f.name.toLowerCase().includes(q))
  const overrideCount = (slotOrComponent: string) => (tokens.overrides ?? []).filter((o) => o.component === slotOrComponent).length

  /* ---------- canvas toolbar ---------- */
  const toolbar: React.ReactNode[] = []
  if (view.startsWith("foundation:")) {
    toolbar.push(
      <Segmented
        key="docs"
        value={display === "preview" ? "preview" : "demo"}
        onChange={(v) => setDisplay(v as CanvasDisplay)}
        options={[
          { value: "demo", label: "Docs", title: "Documentation for this foundation" },
          { value: "preview", label: "Preview", title: "See it on the overview screen" },
        ]}
      />
    )
  }
  if (demo?.matrix) {
    toolbar.push(
      <Segmented
        key="matrix"
        value={display === "matrix" ? "matrix" : "demo"}
        onChange={(v) => setDisplay(v as CanvasDisplay)}
        options={[
          { value: "demo", label: "Demo" },
          { value: "matrix", label: "Matrix", title: "Every variant and size" },
        ]}
      />
    )
  }
  if (selectable(view)) {
    toolbar.push(
      <Segmented
        key="interact"
        value={interact ? "interact" : "select"}
        onChange={(v) => setInteract(v === "interact")}
        options={[
          { value: "select", label: <><Icons.cursor width={13} height={13} /> Select</>, title: "Click a part to edit it" },
          { value: "interact", label: <><Icons.hand width={13} height={13} /> Interact</>, title: "Use the components normally" },
        ]}
      />
    )
    toolbar.push(
      <select
        key="state"
        value={previewState ?? "none"}
        onChange={(e) => setPreviewState(e.target.value === "none" ? null : (e.target.value as OverrideState))}
        aria-label="Preview state"
        title="Show components in this state"
        className="h-8 rounded-[6px] border border-zinc-200 bg-white px-2 text-[12px] text-zinc-800 outline-none"
      >
        {STATES.map((s) => (
          <option key={s.value} value={s.value}>
            State: {s.label}
          </option>
        ))}
      </select>
    )
  }

  if (view !== "lint") {
    toolbar.push(
      <select
        key="zoom"
        value={zoom}
        onChange={(e) => setZoom(Number(e.target.value))}
        aria-label="Zoom"
        title="Zoom"
        className="h-8 rounded-[6px] border border-zinc-200 bg-white px-2 text-[12px] text-zinc-800 outline-none"
      >
        {[0.5, 0.75, 1, 1.25, 1.5].map((z) => (
          <option key={z} value={z}>
            {Math.round(z * 100)}%
          </option>
        ))}
      </select>
    )
  }

  // "Accordion  3 parts, 1 yours"
  let viewMeta: string | null = null
  if (panelComponent) {
    const parts = Object.keys(COMPONENT_CLASSES[panelComponent]?.slots ?? {})
    const mine = (tokens.overrides ?? []).filter((o) => o.component === panelComponent || parts.includes(o.slot)).length
    viewMeta = `${parts.length} part${parts.length === 1 ? "" : "s"}, ${mine} yours`
  }

  return (
    <div className="flex h-dvh flex-col bg-zinc-50 text-zinc-900" style={{ fontFamily: "ui-sans-serif, system-ui, -apple-system, 'Segoe UI', sans-serif" }}>
      {/* Top bar */}
      <header className="flex h-12 shrink-0 items-center gap-3 border-b border-zinc-200 bg-white px-3">
        <div className="flex min-w-0 items-center gap-2">
          <span className="flex size-7 items-center justify-center rounded-[6px] bg-zinc-900 text-[11px] font-bold text-white">DS</span>
          <span className="truncate text-[13px] font-semibold">{tokens.name}</span>
          <span className="hidden rounded-[4px] bg-zinc-100 px-1.5 py-0.5 text-[11px] text-zinc-500 sm:inline">{ACTIVE_ADAPTER.name}</span>
        </div>
        <div className="ml-auto flex items-center gap-2">
          <Segmented
            value={mode}
            onChange={setMode}
            options={[
              { value: "light", label: <Icons.sun width={14} height={14} />, title: "Light mode" },
              { value: "dark", label: <Icons.moon width={14} height={14} />, title: "Dark mode" },
            ]}
          />
          <Segmented
            value={viewport}
            onChange={setViewport}
            className="hidden md:inline-flex"
            options={[
              { value: "desktop", label: <Icons.desktop width={14} height={14} />, title: "Desktop" },
              { value: "tablet", label: <Icons.tablet width={14} height={14} />, title: "Tablet (834px)" },
              { value: "mobile", label: <Icons.phone width={14} height={14} />, title: "Mobile (390px)" },
            ]}
          />
          <div className="mx-1 h-5 w-px bg-zinc-200" />
          <ChromeButton variant="ghost" size="icon" title="Undo (⌘Z)" aria-label="Undo" disabled={!history.canUndo} onClick={history.undo}>
            <Icons.undo />
          </ChromeButton>
          <ChromeButton variant="ghost" size="icon" title="Redo (⇧⌘Z)" aria-label="Redo" disabled={!history.canRedo} onClick={history.redo}>
            <Icons.redo />
          </ChromeButton>
          <ChromeButton
            variant="ghost"
            size="icon"
            title="Discard unsaved changes"
            aria-label="Discard unsaved changes"
            disabled={!dirty}
            onClick={() => {
              history.set(cloneTokens(baseline))
              setAssets({})
            }}
          >
            <Icons.reset />
          </ChromeButton>
          <ChromeButton onClick={() => setShareOpen(true)} title="Share a link to this draft">
            <Icons.share /> <span className="hidden sm:inline">Share</span>
          </ChromeButton>
          <ChromeButton onClick={() => setExportOpen("css")}>
            <Icons.download /> <span className="hidden sm:inline">Export</span>
          </ChromeButton>
          <ChromeButton variant="primary" onClick={() => setSaveOpen(true)} title="Save to GitHub (⌘S)">
            <Icons.github /> Save
            {dirty && <span className="ml-0.5 rounded-full bg-white/20 px-1.5 text-[11px]">{changeCount}</span>}
          </ChromeButton>
        </div>
      </header>

      {restored && dirty && (
        <div className="flex items-center justify-center gap-3 border-b border-amber-200 bg-amber-50 px-4 py-1.5 text-[12px] text-amber-900">
          Restored your unsaved changes from last time.
          <button
            type="button"
            className="font-medium underline"
            onClick={() => {
              history.replace(cloneTokens(baseline))
              setAssets({})
              setRestored(false)
            }}
          >
            Discard them
          </button>
          <button type="button" className="font-medium underline" onClick={() => setRestored(false)}>
            Keep
          </button>
        </div>
      )}

      {shared && (
        <div className="flex items-center justify-center gap-3 border-b border-blue-200 bg-blue-50 px-4 py-1.5 text-[12px] text-blue-900">
          You&apos;re looking at a shared draft. It isn&apos;t saved anywhere until you click Save.
          <button
            type="button"
            className="font-medium underline"
            onClick={() => {
              history.set(cloneTokens(baseline))
              setShared(false)
            }}
          >
            Go back to the saved version
          </button>
          <button type="button" className="font-medium underline" onClick={() => setShared(false)}>
            Keep it
          </button>
        </div>
      )}

      <div className="flex min-h-0 flex-1">
        {/* Sidebar */}
        <nav className="flex w-56 shrink-0 flex-col border-r border-zinc-200 bg-white" aria-label="Design system">
          {componentId ? (
            <>
              <div className="flex flex-col gap-1 border-b border-zinc-200 p-2">
                <button
                  type="button"
                  onClick={() => setView("components")}
                  className="flex h-7 items-center gap-1.5 rounded-[6px] px-2 text-[12px] text-zinc-500 hover:bg-zinc-100 hover:text-zinc-900"
                >
                  <Icons.back width={13} height={13} /> All components
                </button>
                <div className="flex items-center gap-2 px-2 pt-1 text-[13px] font-semibold">
                  <Icons.component width={14} height={14} className="text-zinc-500" /> {demo?.name ?? componentId}
                </div>
              </div>
              <div className="flex-1 overflow-y-auto p-2">
                <div className="mb-1 flex items-center gap-1.5 px-2 text-[11px] font-semibold tracking-wide text-zinc-400 uppercase">
                  <Icons.layers width={12} height={12} /> Layers
                </div>
                {layers.length === 0 ? (
                  <p className="px-2 text-[12px] text-zinc-400">Loading…</p>
                ) : (
                  <div className="flex flex-col gap-0.5">
                    {[...layers]
                      .sort((a, b) => {
                        const own = Object.keys(COMPONENT_CLASSES[componentId]?.slots ?? {})
                        const ao = own.includes(a.slot) ? 0 : 1
                        const bo = own.includes(b.slot) ? 0 : 1
                        return ao - bo || a.depth - b.depth || a.slot.localeCompare(b.slot)
                      })
                      .map((l) => {
                        const own = Object.keys(COMPONENT_CLASSES[componentId]?.slots ?? {}).includes(l.slot)
                        const active = selection?.slot === l.slot
                        return (
                          <button
                            key={l.slot}
                            type="button"
                            onClick={() => setSelection({ slot: l.slot })}
                            aria-pressed={active}
                            className={cx(
                              "flex h-7 w-full items-center gap-1.5 rounded-[6px] pr-2 text-left text-[12px] transition-colors",
                              active ? "bg-blue-50 font-medium text-blue-800" : own ? "text-zinc-700 hover:bg-zinc-100" : "text-zinc-400 hover:bg-zinc-100 hover:text-zinc-700"
                            )}
                            style={{ paddingLeft: 8 + Math.min(l.depth, 4) * 10 }}
                          >
                            <span className="flex-1 truncate font-mono">{l.slot}</span>
                            <span className="text-[10px] text-zinc-400">{l.count}</span>
                          </button>
                        )
                      })}
                  </div>
                )}
              </div>
            </>
          ) : (
            <>
              <div className="p-2">
                <div className="relative">
                  <Icons.search width={14} height={14} className="pointer-events-none absolute top-1/2 left-2 -translate-y-1/2 text-zinc-400" />
                  <TextInput placeholder="Search" value={search} onChange={(e) => setSearch(e.target.value)} className="h-7 pl-7" aria-label="Search" />
                </div>
              </div>
              <div className="flex-1 overflow-y-auto px-2 pb-4">
                {!q && (
                  <div className="flex flex-col gap-0.5">
                    <NavItem id="overview" active={view === "overview"} onSelect={setView} label="Overview" icon={Icons.home} />
                    <NavItem id="style" active={view === "style"} onSelect={setView} label="Style" icon={Icons.brush} />
                    <NavItem id="components" active={view === "components"} onSelect={setView} label="All components" icon={Icons.grid} />
                    <NavItem id="blocks" active={view === "blocks"} onSelect={setView} label="Blocks" icon={Icons.layers} />
                    <NavItem id="lint" active={view === "lint"} onSelect={setView} label="Lint" icon={Icons.shield} />
                  </div>
                )}
                {foundations.length > 0 && (
                  <>
                    <div className="mt-4 mb-1 px-2 text-[11px] font-semibold tracking-wide text-zinc-400 uppercase">Foundations</div>
                    <div className="flex flex-col gap-0.5">
                      {foundations.map((f) => (
                        <NavItem key={f.id} id={`foundation:${f.id}`} active={view === `foundation:${f.id}`} onSelect={setView} label={f.name} icon={FOUNDATION_ICONS[f.id]} />
                      ))}
                    </div>
                  </>
                )}
                {(customDemos.length > 0 || !q) && (
                  <>
                    <div className="mt-4 mb-1 flex items-center justify-between px-2 text-[11px] font-semibold tracking-wide text-zinc-400 uppercase">
                      Custom components
                      <button
                        type="button"
                        onClick={() => setNewComponentOpen(true)}
                        className="flex size-5 items-center justify-center rounded-[4px] text-zinc-500 hover:bg-zinc-100 hover:text-zinc-900"
                        title="New custom component"
                        aria-label="New custom component"
                      >
                        <Icons.plus width={12} height={12} />
                      </button>
                    </div>
                    <div className="flex flex-col gap-0.5">
                      {customDemos.map((d) => {
                        const n = overrideCount(d.id)
                        return (
                          <NavItem
                            key={d.id}
                            id={`component:${d.id}`}
                            active={false}
                            onSelect={setView}
                            label={d.name}
                            icon={Icons.component}
                            badge={n > 0 ? <span className="size-1.5 rounded-full bg-blue-500" title={`${n} change${n === 1 ? "" : "s"}`} /> : undefined}
                          />
                        )
                      })}
                      {customDemos.length === 0 && (
                        <button type="button" onClick={() => setNewComponentOpen(true)} className="px-2 py-1 text-left text-[12px] text-zinc-500 hover:text-zinc-900">
                          New component…
                        </button>
                      )}
                    </div>
                  </>
                )}
                {blocks.length > 0 && (
                  <>
                    <div className="mt-4 mb-1 px-2 text-[11px] font-semibold tracking-wide text-zinc-400 uppercase">Blocks</div>
                    <div className="flex flex-col gap-0.5">
                      {blocks.map((b) => (
                        <NavItem key={b.id} id={`block:${b.id}`} active={view === `block:${b.id}`} onSelect={setView} label={b.name} icon={Icons.layers} />
                      ))}
                    </div>
                  </>
                )}
                {demos.length > 0 && (
                  <>
                    <div className="mt-4 mb-1 px-2 text-[11px] font-semibold tracking-wide text-zinc-400 uppercase">Components</div>
                    <div className="flex flex-col gap-0.5">
                      {demos.map((d) => {
                        const n = overrideCount(d.id)
                        return (
                          <NavItem
                            key={d.id}
                            id={`component:${d.id}`}
                            active={false}
                            onSelect={setView}
                            label={d.name}
                            icon={Icons.component}
                            badge={n > 0 ? <span className="size-1.5 rounded-full bg-blue-500" title={`${n} change${n === 1 ? "" : "s"}`} /> : undefined}
                          />
                        )
                      })}
                    </div>
                  </>
                )}
              </div>
            </>
          )}
          <div className="border-t border-zinc-200 p-2">
            <a href={`${BASE_PATH}/`} target="_blank" rel="noopener" className="flex h-7 items-center gap-2 rounded-[6px] px-2 text-[12px] text-zinc-600 hover:bg-zinc-100">
              <Icons.external width={13} height={13} /> View the app
            </a>
            <a
              href={`https://github.com/${repo.owner}/${repo.repo}`}
              target="_blank"
              rel="noopener"
              className="flex h-7 items-center gap-2 rounded-[6px] px-2 text-[12px] text-zinc-600 hover:bg-zinc-100"
            >
              <Icons.github width={13} height={13} /> {repo.repo}
            </a>
          </div>
        </nav>

        {/* Canvas */}
        <main className="flex min-w-0 flex-1 flex-col bg-zinc-100">
          <div className="flex h-11 shrink-0 items-center gap-2 border-b border-zinc-200 bg-white/70 px-3">
            <span className="truncate text-[13px] font-medium text-zinc-800">{pickedComponent ? panelName : viewLabel(view)}</span>
            {viewMeta && <span className="truncate text-[12px] text-zinc-500">{viewMeta}</span>}
            <div className="ml-auto flex items-center gap-2">{toolbar}</div>
          </div>
          <div className={cx("min-h-0 flex-1 justify-center overflow-auto p-4", view === "lint" ? "hidden" : "flex")}>
            <div
              className="h-full overflow-hidden rounded-[10px] border border-zinc-200 bg-white shadow-[0_1px_3px_rgba(0,0,0,0.06)] transition-[width] duration-200"
              style={{ width: VIEWPORT_WIDTH[viewport], maxWidth: "100%" }}
            >
              <iframe
                ref={iframeRef}
                title="Design system canvas"
                src={canvasSrc}
                onLoad={() => postToCanvas({ type: "ds:ping" })}
                className="border-0"
                style={{ width: `${100 / zoom}%`, height: `${100 / zoom}%`, transform: `scale(${zoom})`, transformOrigin: "0 0" }}
              />
            </div>
          </div>
          {view === "lint" && (
            <div className="min-h-0 flex-1 overflow-auto">
              <LintPage tokens={tokens} repo={repo} token={token} isLocked={isLocked} toggleLock={toggleLock} />
            </div>
          )}
        </main>

        {/* Inspector */}
        <aside className="flex w-80 shrink-0 flex-col border-l border-zinc-200 bg-white" aria-label="Inspector">
          <div className="flex h-10 shrink-0 items-center gap-1 border-b border-zinc-200 px-2" role="tablist" aria-label="Panel">
            {(
              [
                { id: "inspect", label: "Inspect", icon: Icons.cursor },
                { id: "agent", label: "Agent", icon: Icons.sparkle },
                { id: "comments", label: "Comments", icon: Icons.chat },
              ] as const
            ).map((tab) => (
              <button
                key={tab.id}
                type="button"
                role="tab"
                aria-selected={sideTab === tab.id}
                onClick={() => setSideTab(tab.id)}
                className={cx(
                  "flex h-7 items-center gap-1.5 rounded-[6px] px-2 text-[12px] transition-colors",
                  sideTab === tab.id ? "bg-zinc-100 font-medium text-zinc-900" : "text-zinc-500 hover:bg-zinc-50 hover:text-zinc-900"
                )}
              >
                <tab.icon width={13} height={13} />
                {tab.label}
                {tab.id === "comments" && openComments.length > 0 && (
                  <span
                    className={cx("rounded-full px-1.5 text-[10px]", pageComments ? "bg-blue-600 text-white" : "bg-zinc-200 text-zinc-600")}
                    title={`${openComments.length} open, ${pageComments} on this page`}
                  >
                    {pageComments || openComments.length}
                  </span>
                )}
              </button>
            ))}
          </div>
          <div className={cx("min-h-0 flex-1 flex-col overflow-y-auto", sideTab === "inspect" ? "flex" : "hidden")} role="tabpanel" aria-label="Inspect">
            <div className="flex h-10 shrink-0 items-center justify-between border-b border-zinc-200 px-4 text-[12px] font-semibold text-zinc-900">
              {inspectorTitle}
              {pickedComponent && (
                <button type="button" className="text-[11px] font-normal text-zinc-500 underline" onClick={() => setSelection(null)}>
                  Done
                </button>
              )}
            </div>
            {inspector}
          </div>
          {/* The agent stays mounted so the chat survives switching tabs and pages */}
          <div className={cx("min-h-0 flex-1 flex-col", sideTab === "agent" ? "flex" : "hidden")} role="tabpanel" aria-label="Agent">
            <AgentPanel context={agentContext} view={view} viewName={pickedComponent ? panelName : viewLabel(view)} mode={mode} selection={selection} />
          </div>
          {sideTab === "comments" && (
            <div className="flex min-h-0 flex-1 flex-col" role="tabpanel" aria-label="Comments">
              <CommentsPanel
                api={comments}
                repo={repo}
                token={token}
                view={view}
                mode={mode}
                selection={selection}
                labelFor={viewLabel}
                onNavigate={setView}
                onNeedToken={() => setSaveOpen(true)}
              />
            </div>
          )}
        </aside>
      </div>

      <SaveDialog
        open={saveOpen}
        onClose={() => setSaveOpen(false)}
        tokens={tokens}
        changes={changes}
        assets={assetList}
        repo={repo}
        token={token}
        onToken={(t) => {
          if (t) storage.set(tokenKey, t)
          else storage.remove(tokenKey)
          setToken(t)
        }}
        onSaved={(url) => {
          setBaseline(cloneTokens(tokens))
          setAssets({})
          storage.remove(draftKey)
          storage.remove(assetsKey)
          setRestored(false)
          setSaveOpen(false)
          setToast({
            message: (
              <>
                Saved to GitHub. The live site updates in about 2 minutes.{" "}
                <a href={url} target="_blank" rel="noopener" className="underline">
                  View commit
                </a>
              </>
            ),
          })
        }}
      />

      <ExportDialog
        open={exportOpen !== false}
        initialTab={exportOpen || "css"}
        onClose={() => setExportOpen(false)}
        tokens={tokens}
        onImport={(next, count) => {
          touched.current = true
          history.set(next)
          setExportOpen(false)
          setToast({ message: `Imported ${count} value${count === 1 ? "" : "s"}. Undo with ⌘Z.` })
        }}
      />

      <ShareDialog open={shareOpen} onClose={() => setShareOpen(false)} tokens={tokens} view={view} changeCount={changeCount} />

      <NewComponentDialog
        open={newComponentOpen}
        onClose={() => setNewComponentOpen(false)}
        repo={repo}
        token={token}
        customIds={canvas.customIds}
        takenIds={[...canvas.demos.map((d) => d.id), ...Object.keys(COMPONENT_CLASSES)]}
        onNeedToken={() => {
          setNewComponentOpen(false)
          setSaveOpen(true)
        }}
        onCreated={(url, id) => {
          setNewComponentOpen(false)
          setToast({
            message: (
              <>
                Created {id}. It appears here once the site rebuilds (about 2 minutes), then reload.{" "}
                <a href={url} target="_blank" rel="noopener" className="underline">
                  View commit
                </a>
              </>
            ),
          })
        }}
      />

      {toast && <Toast message={toast.message} tone={toast.tone} onClose={() => setToast(null)} />}
    </div>
  )
}

/* ------------------------------------------------------------------ */
/* Save to GitHub                                                      */
/* ------------------------------------------------------------------ */

function newTokenUrl(repo: RepoConfig) {
  const p = new URLSearchParams({
    name: `${repo.repo} design system editor`,
    description: "Lets the design system editor save tokens to this repo",
    target_name: repo.owner,
    expires_in: "365",
    contents: "write",
    issues: "write",
  })
  return `https://github.com/settings/personal-access-tokens/new?${p.toString()}`
}

function SaveDialog({
  open,
  onClose,
  tokens,
  changes,
  assets,
  repo,
  token,
  onToken,
  onSaved,
}: {
  open: boolean
  onClose: () => void
  tokens: DesignTokens
  changes: { path: string; before: string; after: string }[]
  assets: PendingAsset[]
  repo: RepoConfig
  token: string | null
  onToken: (t: string | null) => void
  onSaved: (url: string) => void
}) {
  const [input, setInput] = React.useState("")
  const [busy, setBusy] = React.useState(false)
  const [error, setError] = React.useState<string | null>(null)
  const [message, setMessage] = React.useState("")
  const [login, setLogin] = React.useState<string | null>(null)

  React.useEffect(() => {
    if (!open) return
    // eslint-disable-next-line react-hooks/set-state-in-effect -- reset the form each time the dialog opens
    setError(null)
    const n = changes.length + assets.length
    setMessage(n ? `Update design system tokens (${n} change${n === 1 ? "" : "s"})` : "Update design system tokens")
  }, [open, changes.length, assets.length])

  const files = React.useMemo(
    () => [
      { path: TOKENS_PATH, content: JSON.stringify(tokens, null, 2) + "\n" },
      ...ADAPTERS.flatMap((a) => a.outputs.map((o) => ({ path: o.path, content: o.generate(tokens) }))),
      ...assets.map((a) => ({ path: a.repoPath, content: a.content })),
    ],
    [tokens, assets]
  )

  const connect = async () => {
    setBusy(true)
    setError(null)
    try {
      const name = await verifyToken(input.trim(), repo)
      onToken(input.trim())
      setLogin(name)
      setInput("")
    } catch (e) {
      setError(e instanceof Error ? e.message : String(e))
    } finally {
      setBusy(false)
    }
  }

  const save = async () => {
    if (!token) return
    setBusy(true)
    setError(null)
    try {
      const url = await commitFiles(files, message.trim() || "Update design system tokens", repo, token)
      onSaved(url)
    } catch (e) {
      setError(e instanceof Error ? e.message : String(e))
    } finally {
      setBusy(false)
    }
  }

  return (
    <Modal
      open={open}
      onClose={onClose}
      title="Save to GitHub"
      width={560}
      footer={
        token ? (
          <>
            <ChromeButton onClick={onClose}>Cancel</ChromeButton>
            <ChromeButton variant="primary" onClick={save} disabled={busy || changes.length + assets.length === 0}>
              {busy ? "Saving…" : changes.length + assets.length === 0 ? "Nothing to save" : "Commit to main"}
            </ChromeButton>
          </>
        ) : (
          <ChromeButton onClick={onClose}>Close</ChromeButton>
        )
      }
    >
      {!token ? (
        <div className="flex flex-col gap-4">
          <p>
            To save straight to <strong>{repo.owner}/{repo.repo}</strong>, connect a GitHub token once. It&apos;s stored
            only in this browser.
          </p>
          <ol className="flex list-decimal flex-col gap-1.5 pl-5">
            <li>
              <a href={newTokenUrl(repo)} target="_blank" rel="noopener" className="font-medium text-blue-600 underline">
                Create a fine-grained token on GitHub
              </a>
            </li>
            <li>
              Under <em>Repository access</em>, choose <em>Only select repositories</em> and pick <strong>{repo.repo}</strong>.
            </li>
            <li>
              Under <em>Permissions</em>, set <strong>Contents</strong> to <em>Read and write</em> (and <strong>Issues</strong> to{" "}
              <em>Read and write</em> if you want to post comments).
            </li>
            <li>Generate the token, copy it, and paste it here.</li>
          </ol>
          <FieldRow label="GitHub token">
            <div className="flex gap-2">
              <TextInput
                type="password"
                autoComplete="off"
                placeholder="github_pat_…"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && input.trim() && connect()}
              />
              <ChromeButton variant="primary" disabled={!input.trim() || busy} onClick={connect}>
                {busy ? "Checking…" : "Connect"}
              </ChromeButton>
            </div>
          </FieldRow>
        </div>
      ) : (
        <div className="flex flex-col gap-4">
          <div className="flex items-center justify-between gap-2 rounded-[6px] bg-zinc-50 px-3 py-2 text-[12px]">
            <span className="flex items-center gap-2">
              <Icons.github width={14} height={14} />
              {login ? `Connected as ${login}` : "GitHub connected"} · {repo.owner}/{repo.repo} · {repo.branch}
            </span>
            <button type="button" className="text-zinc-500 underline" onClick={() => onToken(null)}>
              Disconnect
            </button>
          </div>
          <FieldRow label="Commit message">
            <TextInput value={message} onChange={(e) => setMessage(e.target.value)} />
          </FieldRow>
          <div className="flex flex-col gap-1.5">
            <span className="text-[12px] text-zinc-600">Files</span>
            <ul className="flex flex-col gap-0.5 font-mono text-[11px] text-zinc-600">
              {files.map((f) => (
                <li key={f.path}>{f.path}</li>
              ))}
            </ul>
          </div>
          <div className="flex flex-col gap-1.5">
            <span className="text-[12px] text-zinc-600">
              Changes {changes.length > 0 && `(${changes.length})`}
            </span>
            {assets.length > 0 && (
              <p className="text-[12px] text-zinc-600">
                Uploaded files: {assets.map((a) => a.repoPath).join(", ")}
              </p>
            )}
            {changes.length === 0 ? (
              <p className="text-[12px] text-zinc-500">{assets.length ? "No token changes." : "No changes since the last save."}</p>
            ) : (
              <div className="max-h-56 overflow-y-auto rounded-[6px] border border-zinc-200">
                <table className="w-full text-left text-[11px]">
                  <tbody>
                    {changes.slice(0, 100).map((c) => (
                      <tr key={c.path} className="border-b border-zinc-100 last:border-0">
                        <td className="px-2 py-1.5 font-mono text-zinc-800">{c.path}</td>
                        <td className="px-2 py-1.5 font-mono break-all text-zinc-400 line-through">{c.before}</td>
                        <td className="px-2 py-1.5 font-mono break-all text-zinc-800">{c.after}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      )}
      {error && <p className="mt-4 rounded-[6px] bg-red-50 px-3 py-2 text-[12px] text-red-700">{error}</p>}
    </Modal>
  )
}

/* ------------------------------------------------------------------ */
/* Export / import                                                     */
/* ------------------------------------------------------------------ */

function ExportDialog({
  open,
  initialTab,
  onClose,
  tokens,
  onImport,
}: {
  open: boolean
  initialTab: "css" | "import"
  onClose: () => void
  tokens: DesignTokens
  onImport: (next: DesignTokens, count: number) => void
}) {
  const [tab, setTab] = React.useState<string>(initialTab)
  React.useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect -- open on the tab that was asked for
    if (open) setTab(initialTab)
  }, [open, initialTab])
  const [paste, setPaste] = React.useState("")
  const [copied, setCopied] = React.useState(false)
  const outputs = ADAPTERS.flatMap((a) => a.outputs.map((o) => ({ id: o.path, label: o.path.split("/").pop()!, content: o.generate(tokens) })))
  const json = JSON.stringify(tokens, null, 2) + "\n"
  const current =
    tab === "json" ? { name: "tokens.json", content: json, type: "application/json" } : { name: outputs[0].label, content: outputs[0].content, type: "text/css" }

  const preview = React.useMemo(() => {
    if (!paste.trim()) return null
    let next = importShadcnCss(paste.includes(":root") || paste.includes(".dark") ? paste : `:root {\n${paste}\n}`, tokens)
    // Keep locked values
    for (const path of tokens.locks ?? []) next = setPath(next, path, getPath(tokens, path))
    return { next, count: diffTokens(tokens, next).length }
  }, [paste, tokens])

  return (
    <Modal open={open} onClose={onClose} title="Export & import" width={680}>
      <div className="flex flex-col gap-3">
        <Segmented
          value={tab}
          onChange={(v) => {
            setTab(v)
            setCopied(false)
          }}
          options={[
            { value: "css", label: outputs[0].label },
            { value: "json", label: "tokens.json" },
            { value: "import", label: "Import CSS" },
          ]}
        />
        {tab !== "import" ? (
          <>
            <pre className="max-h-[50vh] overflow-auto rounded-[6px] bg-zinc-950 p-3 font-mono text-[11px] leading-relaxed text-zinc-100">
              {current.content}
            </pre>
            <div className="flex gap-2">
              <ChromeButton
                onClick={async () => {
                  try {
                    await navigator.clipboard.writeText(current.content)
                    setCopied(true)
                  } catch {}
                }}
              >
                {copied ? <Icons.check /> : <Icons.copy />} {copied ? "Copied" : "Copy"}
              </ChromeButton>
              <ChromeButton onClick={() => download(current.name, current.content, current.type)}>
                <Icons.download /> Download
              </ChromeButton>
            </div>
          </>
        ) : (
          <>
            <p className="text-[12px] text-zinc-600">
              Paste shadcn theme CSS (a <code>:root</code> and <code>.dark</code> block) from DS Manager&apos;s Get CSS,
              tweakcn, ui.shadcn.com/themes or another project. Matching colours, radius and shadows are imported; locked
              values are kept.
            </p>
            <textarea
              value={paste}
              onChange={(e) => setPaste(e.target.value)}
              placeholder={":root {\n  --primary: oklch(0.6 0.2 250);\n  ...\n}\n.dark {\n  ...\n}"}
              className="h-56 w-full rounded-[6px] border border-zinc-200 p-2 font-mono text-[11px] outline-none focus:border-blue-500"
            />
            <div className="flex items-center justify-between">
              <span className="text-[12px] text-zinc-500">{preview ? `${preview.count} value${preview.count === 1 ? "" : "s"} will change` : ""}</span>
              <ChromeButton
                variant="primary"
                disabled={!preview || preview.count === 0}
                onClick={() => {
                  if (!preview) return
                  onImport(preview.next, preview.count)
                  setPaste("")
                }}
              >
                <Icons.upload /> Import
              </ChromeButton>
            </div>
          </>
        )}
      </div>
    </Modal>
  )
}
