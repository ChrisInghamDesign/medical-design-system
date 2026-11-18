"use client"

import * as React from "react"

import initialTokens from "@/design-system/tokens.json"
import { ACTIVE_ADAPTER, ADAPTERS } from "@/lib/ds/adapters"
import { importShadcnCss } from "@/lib/ds/adapters/shadcn"
import { BASE_PATH, type CanvasToEditor, type EditorToCanvas } from "@/lib/ds/bridge"
import { commitFiles, DEFAULT_REPO, readRepoFile, verifyToken, type RepoConfig } from "@/lib/ds/github"
import { cloneTokens, getPath, sameTokens, setPath, storage, useTokenHistory } from "@/lib/ds/store"
import type { DesignTokens, Mode } from "@/lib/ds/types"

import { CANVASES, FOUNDATIONS } from "./canvas/registry"
import { ChromeButton, cx, FieldRow, Icons, Modal, Segmented, TextInput, Toast } from "./chrome"
import {
  ColorsPanel,
  RadiusPanel,
  ShadowsPanel,
  SpacingPanel,
  SystemPanel,
  TypographyPanel,
  type InspectorProps,
} from "./inspector"

const TOKENS_PATH = "design-system/tokens.json"
const canvas = CANVASES[ACTIVE_ADAPTER.id]

type Viewport = "desktop" | "tablet" | "mobile"
const VIEWPORT_WIDTH: Record<Viewport, string> = { desktop: "100%", tablet: "834px", mobile: "390px" }

const FOUNDATION_ICONS: Record<string, (p: React.SVGProps<SVGSVGElement>) => React.ReactElement> = {
  colors: Icons.palette,
  typography: Icons.type,
  radius: Icons.radius,
  shadows: Icons.shadow,
  spacing: Icons.spacing,
}

function NavItem({
  id,
  label,
  icon: Icon,
  active,
  onSelect,
}: {
  id: string
  label: string
  icon?: (p: React.SVGProps<SVGSVGElement>) => React.ReactElement
  active: boolean
  onSelect: (id: string) => void
}) {
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
      <span className="truncate">{label}</span>
    </button>
  )
}

/** Flat list of changed token paths between two token sets */
function diffTokens(a: DesignTokens, b: DesignTokens, prefix = ""): { path: string; before: string; after: string }[] {
  const out: { path: string; before: string; after: string }[] = []
  const walk = (x: unknown, y: unknown, path: string) => {
    if (typeof x === "object" && x && typeof y === "object" && y && !Array.isArray(x)) {
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
  if (view === "components") return "All components"
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

export function Editor() {
  const built = initialTokens as DesignTokens
  const history = useTokenHistory(built)
  const { tokens } = history
  const [baseline, setBaseline] = React.useState<DesignTokens>(built)
  const [mode, setMode] = React.useState<Mode>("light")
  const [view, setView] = React.useState("overview")
  const [viewport, setViewport] = React.useState<Viewport>("desktop")
  const [search, setSearch] = React.useState("")
  const [repo] = React.useState<RepoConfig>(DEFAULT_REPO)
  const [token, setToken] = React.useState<string | null>(null)
  const [saveOpen, setSaveOpen] = React.useState(false)
  const [exportOpen, setExportOpen] = React.useState(false)
  const [restored, setRestored] = React.useState(false)
  const [toast, setToast] = React.useState<{ message: React.ReactNode; tone?: "default" | "error" } | null>(null)
  const [canvasReady, setCanvasReady] = React.useState(false)
  const iframeRef = React.useRef<HTMLIFrameElement>(null)
  // The iframe loads once; later view changes are sent as messages
  const [canvasSrc] = React.useState(() => `${BASE_PATH}/editor/canvas/?view=overview`)
  const touched = React.useRef(false)
  const draftKey = `ds-editor:draft:${repo.owner}/${repo.repo}`
  const tokenKey = `ds-editor:github-token:${repo.owner}/${repo.repo}`

  const dirty = !sameTokens(tokens, baseline)
  const changes = React.useMemo(() => (dirty ? diffTokens(baseline, tokens) : []), [baseline, tokens, dirty])

  /* ---------- load: token, draft, latest tokens from GitHub ---------- */
  /* eslint-disable react-hooks/set-state-in-effect -- browser-only state (URL, localStorage) is read after the static page loads */
  React.useEffect(() => {
    const t = storage.get(tokenKey)
    if (t) setToken(t)
    const hash = decodeURIComponent(window.location.hash.slice(1))
    if (hash) setView(hash)

    const draftRaw = storage.get(draftKey)
    let draft: DesignTokens | null = null
    try {
      draft = draftRaw ? (JSON.parse(draftRaw) as DesignTokens) : null
    } catch {}
    if (draft && !sameTokens(draft, built)) {
      history.replace(draft)
      setRestored(true)
    }

    readRepoFile(TOKENS_PATH, repo, t)
      .then((text) => {
        const remote = JSON.parse(text) as DesignTokens
        setBaseline(remote)
        if (!draft && !touched.current) history.replace(remote)
        if (draft && sameTokens(draft, remote)) setRestored(false)
      })
      .catch(() => {
        /* offline or repo not reachable: keep the built-in tokens */
      })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])
  /* eslint-enable react-hooks/set-state-in-effect */

  /* ---------- persist draft ---------- */
  React.useEffect(() => {
    const id = setTimeout(() => {
      if (dirty) storage.set(draftKey, JSON.stringify(tokens))
      else storage.remove(draftKey)
    }, 300)
    return () => clearTimeout(id)
  }, [tokens, dirty, draftKey])

  /* ---------- canvas bridge ---------- */
  const postToCanvas = React.useCallback((msg: EditorToCanvas) => {
    iframeRef.current?.contentWindow?.postMessage(msg, window.location.origin)
  }, [])

  React.useEffect(() => {
    const onMessage = (e: MessageEvent<CanvasToEditor>) => {
      if (e.origin !== window.location.origin || !e.data || typeof e.data !== "object") return
      if (e.data.type === "ds:ready") setCanvasReady(true)
      if (e.data.type === "ds:navigate") setView(e.data.view)
    }
    window.addEventListener("message", onMessage)
    return () => window.removeEventListener("message", onMessage)
  }, [])

  React.useEffect(() => {
    if (canvasReady) postToCanvas({ type: "ds:tokens", tokens, mode })
  }, [tokens, mode, canvasReady, postToCanvas])

  React.useEffect(() => {
    if (canvasReady) postToCanvas({ type: "ds:view", view })
    const hash = view === "overview" ? "" : `#${view}`
    if (window.location.hash !== hash) window.history.replaceState(null, "", hash || window.location.pathname)
  }, [view, canvasReady, postToCanvas])

  /* ---------- editing ---------- */
  const isLocked = React.useCallback((path: string) => (tokens.locks ?? []).includes(path), [tokens.locks])

  const update = React.useCallback(
    (path: string, value: unknown, key?: string) => {
      if (isLocked(path)) return
      if (JSON.stringify(getPath(tokens, path)) === JSON.stringify(value)) return
      touched.current = true
      history.set(setPath(tokens, path, value), key)
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
      const locks = new Set(tokens.locks ?? [])
      if (locks.has(path)) locks.delete(path)
      else locks.add(path)
      touched.current = true
      history.set({ ...cloneTokens(tokens), locks: Array.from(locks).sort() })
    },
    [tokens, history]
  )

  /* ---------- keyboard ---------- */
  React.useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const mod = e.metaKey || e.ctrlKey
      if (!mod) return
      const target = e.target as HTMLElement | null
      const typing = target && (target.tagName === "INPUT" || target.tagName === "TEXTAREA" || target.isContentEditable)
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
  let inspector: React.ReactNode
  if (view === "foundation:colors") inspector = <ColorsPanel {...inspectorProps} />
  else if (view === "foundation:typography") inspector = <TypographyPanel {...inspectorProps} />
  else if (view === "foundation:radius") inspector = <RadiusPanel {...inspectorProps} />
  else if (view === "foundation:shadows") inspector = <ShadowsPanel {...inspectorProps} />
  else if (view === "foundation:spacing") inspector = <SpacingPanel {...inspectorProps} />
  else inspector = <SystemPanel {...inspectorProps} onNavigate={setView} />

  const q = search.trim().toLowerCase()
  const demos = canvas.demos.filter((d) => !q || d.name.toLowerCase().includes(q))
  const foundations = FOUNDATIONS.filter((f) => !q || f.name.toLowerCase().includes(q))


  return (
    <div
      className="flex h-dvh flex-col bg-zinc-50 text-zinc-900"
      style={{ fontFamily: "ui-sans-serif, system-ui, -apple-system, 'Segoe UI', sans-serif" }}
    >
      {/* Top bar */}
      <header className="flex h-12 shrink-0 items-center gap-3 border-b border-zinc-200 bg-white px-3">
        <div className="flex min-w-0 items-center gap-2">
          <span className="flex size-7 items-center justify-center rounded-[6px] bg-zinc-900 text-[11px] font-bold text-white">DS</span>
          <span className="truncate text-[13px] font-semibold">{tokens.name}</span>
          <span className="hidden rounded-[4px] bg-zinc-100 px-1.5 py-0.5 text-[11px] text-zinc-500 sm:inline">{ACTIVE_ADAPTER.name}</span>
          <span className="hidden text-[13px] text-zinc-400 md:inline">/ {viewLabel(view)}</span>
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
          <ChromeButton variant="ghost" size="icon" title="Discard unsaved changes" aria-label="Discard unsaved changes" disabled={!dirty} onClick={() => history.set(cloneTokens(baseline))}>
            <Icons.reset />
          </ChromeButton>
          <ChromeButton onClick={() => setExportOpen(true)}>
            <Icons.download /> <span className="hidden sm:inline">Export</span>
          </ChromeButton>
          <ChromeButton variant="primary" onClick={() => setSaveOpen(true)} title="Save to GitHub (⌘S)">
            <Icons.github /> Save
            {dirty && <span className="ml-0.5 rounded-full bg-white/20 px-1.5 text-[11px]">{changes.length}</span>}
          </ChromeButton>
        </div>
      </header>

      {restored && dirty && (
        <div className="flex items-center justify-center gap-3 border-b border-amber-200 bg-amber-50 px-4 py-1.5 text-[12px] text-amber-900">
          Restored your unsaved changes from last time.
          <button type="button" className="font-medium underline" onClick={() => { history.replace(cloneTokens(baseline)); setRestored(false) }}>
            Discard them
          </button>
          <button type="button" className="font-medium underline" onClick={() => setRestored(false)}>
            Keep
          </button>
        </div>
      )}

      <div className="flex min-h-0 flex-1">
        {/* Sidebar */}
        <nav className="flex w-56 shrink-0 flex-col border-r border-zinc-200 bg-white" aria-label="Design system">
          <div className="p-2">
            <div className="relative">
              <Icons.search width={14} height={14} className="pointer-events-none absolute top-1/2 left-2 -translate-y-1/2 text-zinc-400" />
              <TextInput placeholder="Search" value={search} onChange={(e) => setSearch(e.target.value)} className="h-7 pl-7" aria-label="Search" />
            </div>
          </div>
          <div className="flex-1 overflow-y-auto px-2 pb-4">
            {!q && (
              <div className="flex flex-col gap-0.5">
                <NavItem id={"overview"} active={view === "overview"} onSelect={setView} label="Overview" icon={Icons.home} />
                <NavItem id={"components"} active={view === "components"} onSelect={setView} label="All components" icon={Icons.grid} />
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
            {demos.length > 0 && (
              <>
                <div className="mt-4 mb-1 px-2 text-[11px] font-semibold tracking-wide text-zinc-400 uppercase">Components</div>
                <div className="flex flex-col gap-0.5">
                  {demos.map((d) => (
                    <NavItem key={d.id} id={`component:${d.id}`} active={view === `component:${d.id}`} onSelect={setView} label={d.name} icon={Icons.component} />
                  ))}
                </div>
              </>
            )}
          </div>
          <div className="border-t border-zinc-200 p-2">
            <a
              href={`${BASE_PATH}/`}
              target="_blank"
              rel="noopener"
              className="flex h-7 items-center gap-2 rounded-[6px] px-2 text-[12px] text-zinc-600 hover:bg-zinc-100"
            >
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
        <main className="flex min-w-0 flex-1 justify-center overflow-auto bg-zinc-100 p-4">
          <div
            className="h-full overflow-hidden rounded-[10px] border border-zinc-200 bg-white shadow-[0_1px_3px_rgba(0,0,0,0.06)] transition-[width] duration-200"
            style={{ width: VIEWPORT_WIDTH[viewport], maxWidth: "100%" }}
          >
            <iframe
              ref={iframeRef}
              title="Design system canvas"
              src={canvasSrc}
              className="size-full border-0"
            />
          </div>
        </main>

        {/* Inspector */}
        <aside className="flex w-80 shrink-0 flex-col overflow-y-auto border-l border-zinc-200 bg-white" aria-label="Inspector">
          <div className="flex h-10 shrink-0 items-center border-b border-zinc-200 px-4 text-[12px] font-semibold text-zinc-900">
            {view.startsWith("foundation:") ? viewLabel(view) : "Design system"}
          </div>
          {inspector}
        </aside>
      </div>

      <SaveDialog
        open={saveOpen}
        onClose={() => setSaveOpen(false)}
        tokens={tokens}
        changes={changes}
        repo={repo}
        token={token}
        onToken={(t) => {
          if (t) storage.set(tokenKey, t)
          else storage.remove(tokenKey)
          setToken(t)
        }}
        onSaved={(url) => {
          setBaseline(cloneTokens(tokens))
          storage.remove(draftKey)
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
        open={exportOpen}
        onClose={() => setExportOpen(false)}
        tokens={tokens}
        onImport={(next, count) => {
          touched.current = true
          history.set(next)
          setExportOpen(false)
          setToast({ message: `Imported ${count} value${count === 1 ? "" : "s"}. Undo with ⌘Z.` })
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
  })
  return `https://github.com/settings/personal-access-tokens/new?${p.toString()}`
}

function SaveDialog({
  open,
  onClose,
  tokens,
  changes,
  repo,
  token,
  onToken,
  onSaved,
}: {
  open: boolean
  onClose: () => void
  tokens: DesignTokens
  changes: { path: string; before: string; after: string }[]
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
    const n = changes.length
    setMessage(n ? `Update design system tokens (${n} change${n === 1 ? "" : "s"})` : "Update design system tokens")
  }, [open, changes.length])

  const files = React.useMemo(
    () => [
      { path: TOKENS_PATH, content: JSON.stringify(tokens, null, 2) + "\n" },
      ...ADAPTERS.flatMap((a) => a.outputs.map((o) => ({ path: o.path, content: o.generate(tokens) }))),
    ],
    [tokens]
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
            <ChromeButton variant="primary" onClick={save} disabled={busy || changes.length === 0}>
              {busy ? "Saving…" : changes.length === 0 ? "Nothing to save" : "Commit to main"}
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
              Under <em>Permissions</em>, set <strong>Contents</strong> to <em>Read and write</em>.
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
            {changes.length === 0 ? (
              <p className="text-[12px] text-zinc-500">No changes since the last save.</p>
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
  onClose,
  tokens,
  onImport,
}: {
  open: boolean
  onClose: () => void
  tokens: DesignTokens
  onImport: (next: DesignTokens, count: number) => void
}) {
  const [tab, setTab] = React.useState<string>("css")
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
