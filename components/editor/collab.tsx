"use client"

import * as React from "react"

import {
  addReply,
  createThread,
  listReplies,
  listThreads,
  setThreadOpen,
  type CommentAnchor,
  type CommentReply,
  type CommentThread,
} from "@/lib/ds/comments"
import type { RepoConfig } from "@/lib/ds/github"
import { shareUrl } from "@/lib/ds/share"
import type { DesignTokens, Mode } from "@/lib/ds/types"

import { ChromeButton, cx, Icons, Modal, Segmented, TextInput } from "./chrome"

/* ------------------------------------------------------------------ */
/* Share                                                               */
/* ------------------------------------------------------------------ */

export function ShareDialog({
  open,
  onClose,
  tokens,
  view,
  changeCount,
}: {
  open: boolean
  onClose: () => void
  tokens: DesignTokens
  view: string
  changeCount: number
}) {
  const [url, setUrl] = React.useState<string | null>(null)
  const [copied, setCopied] = React.useState(false)
  const [withView, setWithView] = React.useState(true)

  React.useEffect(() => {
    if (!open) return
    let live = true
    shareUrl({ v: 1, tokens, view: withView ? view : undefined }).then((u) => {
      if (live) {
        setUrl(u)
        setCopied(false)
      }
    })
    return () => {
      live = false
    }
  }, [open, tokens, view, withView])

  return (
    <Modal open={open} onClose={onClose} title="Share this draft" width={560} footer={<ChromeButton onClick={onClose}>Done</ChromeButton>}>
      <div className="flex flex-col gap-4">
        <p>
          Anyone with this link opens the editor with your current design system
          {changeCount ? ` (${changeCount} unsaved change${changeCount === 1 ? "" : "s"})` : ""} as their own draft. Nothing is uploaded or saved
          to GitHub: the whole draft is inside the link.
        </p>
        <div className="flex gap-2">
          <TextInput readOnly value={url ?? "Making link…"} onFocus={(e) => e.currentTarget.select()} aria-label="Share link" className="font-mono text-[11px]" />
          <ChromeButton
            variant="primary"
            disabled={!url}
            onClick={async () => {
              if (!url) return
              try {
                await navigator.clipboard.writeText(url)
                setCopied(true)
              } catch {}
            }}
          >
            {copied ? <Icons.check /> : <Icons.copy />} {copied ? "Copied" : "Copy"}
          </ChromeButton>
        </div>
        <label className="flex items-center gap-2 text-[12px] text-zinc-600">
          <input type="checkbox" checked={withView} onChange={(e) => setWithView(e.target.checked)} />
          Open on this page
        </label>
        {url && url.length > 8000 && (
          <p className="rounded-[6px] bg-amber-50 px-3 py-2 text-[12px] text-amber-900">
            This link is long ({Math.round(url.length / 1000)}k characters). It works in browsers, but some chat apps cut long links; use Export
            instead if it doesn&apos;t open.
          </p>
        )}
      </div>
    </Modal>
  )
}

/* ------------------------------------------------------------------ */
/* Comments (GitHub issues)                                            */
/* ------------------------------------------------------------------ */

export function useComments(repo: RepoConfig, token: string | null) {
  const [threads, setThreads] = React.useState<CommentThread[]>([])
  const [loaded, setLoaded] = React.useState(false)
  const [error, setError] = React.useState<string | null>(null)

  const refresh = React.useCallback(async () => {
    try {
      setThreads(await listThreads(repo, token))
      setError(null)
    } catch (e) {
      setError(e instanceof Error ? e.message : String(e))
    } finally {
      setLoaded(true)
    }
  }, [repo, token])

  React.useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect -- comments load from GitHub once the editor is open
    refresh()
  }, [refresh])

  const create = React.useCallback(
    async (anchor: CommentAnchor, text: string, where: string) => {
      if (!token) throw new Error("Connect GitHub to comment.")
      const thread = await createThread(repo, token, anchor, text, where)
      setThreads((t) => [thread, ...t])
      return thread
    },
    [repo, token]
  )

  const setOpen = React.useCallback(
    async (number: number, open: boolean) => {
      if (!token) throw new Error("Connect GitHub to resolve comments.")
      await setThreadOpen(repo, token, number, open)
      setThreads((t) => t.map((x) => (x.number === number ? { ...x, open } : x)))
    },
    [repo, token]
  )

  const bumpReplies = React.useCallback((number: number) => {
    setThreads((t) => t.map((x) => (x.number === number ? { ...x, replies: x.replies + 1 } : x)))
  }, [])

  return { threads, loaded, error, refresh, create, setOpen, bumpReplies }
}

export type CommentsApi = ReturnType<typeof useComments>

function ago(iso: string) {
  const s = (Date.now() - new Date(iso).getTime()) / 1000
  if (s < 60) return "just now"
  if (s < 3600) return `${Math.floor(s / 60)}m ago`
  if (s < 86400) return `${Math.floor(s / 3600)}h ago`
  if (s < 86400 * 30) return `${Math.floor(s / 86400)}d ago`
  return new Date(iso).toLocaleDateString()
}

function Avatar({ user }: { user: { login: string; avatar_url: string } }) {
  // eslint-disable-next-line @next/next/no-img-element -- GitHub avatar
  return <img src={`${user.avatar_url}${user.avatar_url.includes("?") ? "&" : "?"}s=40`} alt="" className="size-5 shrink-0 rounded-full bg-zinc-200" />
}

export function CommentsPanel({
  api,
  repo,
  token,
  view,
  mode,
  selection,
  labelFor,
  onNavigate,
  onNeedToken,
}: {
  api: CommentsApi
  repo: RepoConfig
  token: string | null
  view: string
  mode: Mode
  selection: { slot: string; variant?: string } | null
  labelFor: (view: string) => string
  onNavigate: (view: string) => void
  onNeedToken: () => void
}) {
  const [scope, setScope] = React.useState<"page" | "all">("page")
  const [showResolved, setShowResolved] = React.useState(false)
  const [text, setText] = React.useState("")
  const [onPart, setOnPart] = React.useState(true)
  const [busy, setBusy] = React.useState(false)
  const [error, setError] = React.useState<string | null>(null)
  const [openThread, setOpenThread] = React.useState<number | null>(null)

  const list = api.threads.filter((t) => (scope === "all" || t.anchor.view === view) && (showResolved || t.open))
  const resolvedHidden = api.threads.filter((t) => (scope === "all" || t.anchor.view === view) && !t.open).length

  const post = async () => {
    if (!text.trim()) return
    setBusy(true)
    setError(null)
    try {
      const anchor: CommentAnchor = { view, mode, ...(selection && onPart ? { slot: selection.slot, variant: selection.variant } : {}) }
      const where = `${labelFor(view)}${anchor.slot ? ` · ${anchor.slot}` : ""}`
      await api.create(anchor, text, where)
      setText("")
    } catch (e) {
      setError(e instanceof Error ? e.message : String(e))
    } finally {
      setBusy(false)
    }
  }

  return (
    <div className="flex min-h-0 flex-1 flex-col">
      <div className="flex flex-col gap-2 border-b border-zinc-200 p-3">
        <textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter" && (e.metaKey || e.ctrlKey)) post()
          }}
          placeholder={`Comment on ${labelFor(view)}…`}
          rows={3}
          className="w-full resize-none rounded-[6px] border border-zinc-200 p-2 text-[12px] outline-none focus:border-blue-500"
          aria-label="New comment"
        />
        {selection && (
          <label className="flex items-center gap-2 text-[11px] text-zinc-600">
            <input type="checkbox" checked={onPart} onChange={(e) => setOnPart(e.target.checked)} />
            About the selected part <span className="font-mono">{selection.slot}</span>
          </label>
        )}
        <div className="flex items-center justify-between gap-2">
          <span className="text-[11px] text-zinc-400">Saved as a GitHub issue · ⌘↵</span>
          {token ? (
            <ChromeButton variant="primary" disabled={!text.trim() || busy} onClick={post}>
              {busy ? "Posting…" : "Comment"}
            </ChromeButton>
          ) : (
            <ChromeButton variant="primary" onClick={onNeedToken}>
              <Icons.github /> Connect to comment
            </ChromeButton>
          )}
        </div>
        {error && <p className="rounded-[6px] bg-red-50 px-2 py-1.5 text-[11px] text-red-700">{error}</p>}
      </div>

      <div className="flex items-center justify-between gap-2 border-b border-zinc-200 px-3 py-2">
        <Segmented
          value={scope}
          onChange={setScope}
          options={[
            { value: "page", label: "This page" },
            { value: "all", label: "All" },
          ]}
        />
        <button type="button" onClick={() => api.refresh()} className="text-zinc-500 hover:text-zinc-900" title="Refresh" aria-label="Refresh comments">
          <Icons.reset width={13} height={13} />
        </button>
      </div>

      <div className="flex-1 overflow-y-auto">
        {!api.loaded ? (
          <p className="p-4 text-[12px] text-zinc-400">Loading comments…</p>
        ) : api.error ? (
          <p className="m-3 rounded-[6px] bg-red-50 px-3 py-2 text-[12px] text-red-700">Couldn&apos;t load comments. {api.error}</p>
        ) : list.length === 0 ? (
          <p className="p-4 text-[12px] text-zinc-500">
            {scope === "page" ? "No comments on this page yet." : "No comments yet."}
          </p>
        ) : (
          <ul className="flex flex-col">
            {list.map((t) => (
              <ThreadItem
                key={t.number}
                thread={t}
                expanded={openThread === t.number}
                onToggle={() => setOpenThread((n) => (n === t.number ? null : t.number))}
                api={api}
                repo={repo}
                token={token}
                labelFor={labelFor}
                showPlace={scope === "all"}
                onNavigate={onNavigate}
              />
            ))}
          </ul>
        )}
        {api.loaded && resolvedHidden > 0 && (
          <button type="button" onClick={() => setShowResolved((s) => !s)} className="m-3 text-[11px] text-zinc-500 underline">
            {showResolved ? "Hide resolved" : `Show ${resolvedHidden} resolved`}
          </button>
        )}
      </div>
      <a
        href={`https://github.com/${repo.owner}/${repo.repo}/issues?q=label%3Adesign-comment`}
        target="_blank"
        rel="noopener"
        className="flex items-center gap-1.5 border-t border-zinc-200 px-3 py-2 text-[11px] text-zinc-500 hover:text-zinc-900"
      >
        <Icons.external width={11} height={11} /> All comments on GitHub
      </a>
    </div>
  )
}

function ThreadItem({
  thread,
  expanded,
  onToggle,
  api,
  repo,
  token,
  labelFor,
  showPlace,
  onNavigate,
}: {
  thread: CommentThread
  expanded: boolean
  onToggle: () => void
  api: CommentsApi
  repo: RepoConfig
  token: string | null
  labelFor: (view: string) => string
  showPlace: boolean
  onNavigate: (view: string) => void
}) {
  const [replies, setReplies] = React.useState<CommentReply[] | null>(null)
  const [reply, setReply] = React.useState("")
  const [busy, setBusy] = React.useState(false)
  const [error, setError] = React.useState<string | null>(null)

  React.useEffect(() => {
    if (!expanded || replies || !thread.replies) return
    listReplies(repo, token, thread.number)
      .then(setReplies)
      .catch((e) => setError(e instanceof Error ? e.message : String(e)))
  }, [expanded, replies, thread.replies, thread.number, repo, token])

  const act = async (fn: () => Promise<void>) => {
    setBusy(true)
    setError(null)
    try {
      await fn()
    } catch (e) {
      setError(e instanceof Error ? e.message : String(e))
    } finally {
      setBusy(false)
    }
  }

  return (
    <li className={cx("border-b border-zinc-100 px-3 py-2.5", !thread.open && "opacity-60")}>
      <button type="button" onClick={onToggle} className="flex w-full flex-col gap-1 text-left" aria-expanded={expanded}>
        <span className="flex items-center gap-2 text-[11px] text-zinc-500">
          <Avatar user={thread.user} />
          <span className="font-medium text-zinc-800">{thread.user.login}</span>
          <span>{ago(thread.createdAt)}</span>
          {!thread.open && <span className="rounded-[4px] bg-zinc-100 px-1">Resolved</span>}
        </span>
        {(showPlace || thread.anchor.slot) && (
          <span className="truncate text-[11px] text-blue-700">
            {showPlace ? labelFor(thread.anchor.view) : ""}
            {showPlace && thread.anchor.slot ? " · " : ""}
            {thread.anchor.slot && <span className="font-mono">{thread.anchor.slot}</span>}
          </span>
        )}
        <span className={cx("text-[12px] whitespace-pre-wrap text-zinc-800", !expanded && "line-clamp-3")}>{thread.text}</span>
        {thread.replies > 0 && !expanded && (
          <span className="text-[11px] text-zinc-500">
            {thread.replies} repl{thread.replies === 1 ? "y" : "ies"}
          </span>
        )}
      </button>
      {expanded && (
        <div className="mt-2 flex flex-col gap-2 border-l-2 border-zinc-100 pl-3">
          {thread.replies > 0 && !replies && !error && <p className="text-[11px] text-zinc-400">Loading replies…</p>}
          {replies?.map((r) => (
            <div key={r.id} className="flex flex-col gap-0.5">
              <span className="flex items-center gap-2 text-[11px] text-zinc-500">
                <Avatar user={r.user} />
                <span className="font-medium text-zinc-800">{r.user.login}</span>
                {ago(r.createdAt)}
              </span>
              <span className="text-[12px] whitespace-pre-wrap text-zinc-800">{r.text}</span>
            </div>
          ))}
          {token && (
            <div className="flex gap-1.5">
              <TextInput
                value={reply}
                onChange={(e) => setReply(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && reply.trim() && !busy)
                    act(async () => {
                      const r = await addReply(repo, token, thread.number, reply)
                      setReplies((list) => [...(list ?? []), r])
                      api.bumpReplies(thread.number)
                      setReply("")
                    })
                }}
                placeholder="Reply…"
                className="h-7"
                aria-label="Reply"
              />
            </div>
          )}
          <div className="flex flex-wrap items-center gap-3 text-[11px]">
            {thread.anchor.view && (
              <button type="button" className="text-zinc-600 underline" onClick={() => onNavigate(thread.anchor.view)}>
                Go to page
              </button>
            )}
            {token && (
              <button type="button" disabled={busy} className="text-zinc-600 underline" onClick={() => act(() => api.setOpen(thread.number, !thread.open))}>
                {thread.open ? "Resolve" : "Reopen"}
              </button>
            )}
            <a href={thread.url} target="_blank" rel="noopener" className="text-zinc-600 underline">
              Open on GitHub
            </a>
          </div>
          {error && <p className="rounded-[6px] bg-red-50 px-2 py-1.5 text-[11px] text-red-700">{error}</p>}
        </div>
      )}
    </li>
  )
}
