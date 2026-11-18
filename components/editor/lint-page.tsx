"use client"

import * as React from "react"

import type { RepoConfig } from "@/lib/ds/github"
import { checkSource } from "@/lib/ds/lint-rules.mjs"
import { COLOR_TOKENS, LINT_RULES, normalizeTokens, type DesignTokens } from "@/lib/ds/types"

import { ChromeButton, cx, Icons, Segmented } from "./chrome"

interface FileFindings {
  path: string
  findings: { rule: string; line: number; column: number; message: string; excerpt: string }[]
}

/** Areas that can be locked as a whole */
export const LOCK_AREAS: { path: string; label: string; description: string }[] = [
  { path: "typeScale", label: "Type scale", description: "Sizes, weights and letter spacing" },
  { path: "radius", label: "Radius", description: "Base radius and steps" },
  { path: "spacing", label: "Spacing", description: "Base spacing unit" },
  { path: "controls", label: "Controls", description: "Heights and focus style" },
  { path: "icons", label: "Icons", description: "Stroke width" },
  { path: "brand", label: "Brand", description: "Logo, mark and favicon" },
  { path: "menu", label: "Menus", description: "Menu colour and highlight" },
  { path: "overrides", label: "Component styles", description: "Changes made on component pages" },
]

const SOURCE_RE = /^(app|components|lib|src)\/.*\.(tsx|ts|jsx|js)$/
const IGNORE_RE = /^(components\/ui\/|components\/editor\/|components\/brand\.tsx$|lib\/ds\/)/

export function LintPage({
  tokens,
  repo,
  token,
  isLocked,
  toggleLock,
}: {
  tokens: DesignTokens
  repo: RepoConfig
  token: string | null
  isLocked: (p: string) => boolean
  toggleLock: (p: string) => void
}) {
  const [tab, setTab] = React.useState<"check" | "locks">("check")
  const [status, setStatus] = React.useState<"idle" | "running" | "done" | "error">("idle")
  const [progress, setProgress] = React.useState({ done: 0, total: 0 })
  const [results, setResults] = React.useState<FileFindings[]>([])
  const [error, setError] = React.useState<string | null>(null)
  const [filter, setFilter] = React.useState<string>("all")
  const t = normalizeTokens(tokens)
  const rules = t.lint!.rules
  const locks = t.locks ?? []

  const run = async () => {
    setStatus("running")
    setError(null)
    setResults([])
    try {
      const res = await fetch(`https://api.github.com/repos/${repo.owner}/${repo.repo}/git/trees/${encodeURIComponent(repo.branch)}?recursive=1`, {
        headers: { Accept: "application/vnd.github+json", ...(token ? { Authorization: `Bearer ${token}` } : {}) },
        cache: "no-store",
      })
      if (!res.ok) throw new Error(res.status === 403 ? "GitHub rate limit reached. Connect a token in Save, or try again in an hour." : `GitHub ${res.status}`)
      const tree = (await res.json()) as { tree: { path: string; type: string }[] }
      const files = tree.tree.filter((f) => f.type === "blob" && SOURCE_RE.test(f.path) && !IGNORE_RE.test(f.path)).map((f) => f.path)
      setProgress({ done: 0, total: files.length })
      const colorTokens = [...COLOR_TOKENS, ...(t.customColors ?? []).map((c) => c.name)]
      const out: FileFindings[] = []
      let done = 0
      const queue = [...files]
      const worker = async () => {
        while (queue.length) {
          const path = queue.shift()!
          const r = await fetch(`https://raw.githubusercontent.com/${repo.owner}/${repo.repo}/${repo.branch}/${path}`, { cache: "no-store" })
          if (r.ok) {
            const findings = checkSource(await r.text(), { rules, colorTokens, filePath: path })
            if (findings.length) out.push({ path, findings })
          }
          done++
          setProgress({ done, total: files.length })
        }
      }
      await Promise.all(Array.from({ length: 6 }, worker))
      out.sort((a, b) => a.path.localeCompare(b.path))
      setResults(out)
      setStatus("done")
    } catch (e) {
      setError(e instanceof Error ? e.message : String(e))
      setStatus("error")
    }
  }

  const counts: Record<string, number> = {}
  for (const f of results) for (const x of f.findings) counts[x.rule] = (counts[x.rule] ?? 0) + 1
  const total = Object.values(counts).reduce((a, b) => a + b, 0)
  const shown = results
    .map((f) => ({ ...f, findings: f.findings.filter((x) => filter === "all" || x.rule === filter) }))
    .filter((f) => f.findings.length)

  return (
    <div className="mx-auto flex max-w-4xl flex-col gap-6 p-8 text-zinc-900">
      <div>
        <h1 className="text-[22px] font-semibold tracking-tight">Lint</h1>
        <p className="mt-1 text-[13px] text-zinc-500">Keep the app on-system: find code that skips the design system, and lock values so they can&apos;t be changed by accident.</p>
      </div>
      <Segmented
        value={tab}
        onChange={setTab}
        className="self-start"
        options={[
          { value: "check", label: "Check code" },
          { value: "locks", label: `Locks (${locks.length})` },
        ]}
      />

      {tab === "check" ? (
        <>
          <div className="flex flex-wrap items-center gap-3 rounded-[10px] border border-zinc-200 bg-white p-4">
            <div className="min-w-0 flex-1">
              <div className="text-[13px] font-medium">Check the code on GitHub</div>
              <div className="text-[12px] text-zinc-500">
                Scans app/, components/ and lib/ on {repo.branch} with the rules set on the right (component source in components/ui is skipped). Rule changes apply to the check right away; save to use them in npm run lint and the GitHub check.
              </div>
            </div>
            <ChromeButton variant="primary" onClick={run} disabled={status === "running"}>
              <Icons.play width={13} height={13} /> {status === "running" ? `Checking ${progress.done}/${progress.total}…` : status === "done" ? "Check again" : "Run check"}
            </ChromeButton>
          </div>

          {error && <p className="rounded-[6px] bg-red-50 px-3 py-2 text-[12px] text-red-700">{error}</p>}

          {status === "done" && (
            <>
              <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
                <button
                  type="button"
                  onClick={() => setFilter("all")}
                  className={cx("rounded-[8px] border bg-white px-3 py-2 text-left", filter === "all" ? "border-zinc-900" : "border-zinc-200 hover:border-zinc-300")}
                >
                  <div className="text-[18px] font-semibold">{total}</div>
                  <div className="text-[11px] text-zinc-500">All findings in {progress.total} files</div>
                </button>
                {LINT_RULES.filter((r) => rules[r.id] !== "off").map((r) => (
                  <button
                    key={r.id}
                    type="button"
                    onClick={() => setFilter(r.id)}
                    className={cx("rounded-[8px] border bg-white px-3 py-2 text-left", filter === r.id ? "border-zinc-900" : "border-zinc-200 hover:border-zinc-300")}
                  >
                    <div className="flex items-center gap-2 text-[18px] font-semibold">
                      {counts[r.id] ?? 0}
                      <span className={cx("rounded-[4px] px-1.5 py-0.5 text-[10px] font-medium", rules[r.id] === "error" ? "bg-red-100 text-red-700" : "bg-amber-100 text-amber-800")}>{rules[r.id]}</span>
                    </div>
                    <div className="text-[11px] text-zinc-500">{r.label}</div>
                  </button>
                ))}
              </div>
              {total === 0 ? (
                <div className="flex items-center gap-2 rounded-[8px] bg-emerald-50 px-3 py-2.5 text-[13px] text-emerald-900">
                  <Icons.check width={15} height={15} /> No problems found. The app follows the design system.
                </div>
              ) : (
                <div className="flex flex-col gap-3">
                  {shown.map((f) => (
                    <div key={f.path} className="overflow-hidden rounded-[8px] border border-zinc-200 bg-white">
                      <a
                        href={`https://github.com/${repo.owner}/${repo.repo}/blob/${repo.branch}/${f.path}`}
                        target="_blank"
                        rel="noopener"
                        className="flex items-center justify-between border-b border-zinc-100 bg-zinc-50 px-3 py-2 font-mono text-[12px] hover:underline"
                      >
                        {f.path} <span className="font-sans text-[11px] text-zinc-500">{f.findings.length}</span>
                      </a>
                      <ul>
                        {f.findings.map((x, i) => (
                          <li key={i} className="flex flex-col gap-1 border-b border-zinc-100 px-3 py-2 last:border-0">
                            <div className="flex items-center gap-2 text-[12px]">
                              <a
                                href={`https://github.com/${repo.owner}/${repo.repo}/blob/${repo.branch}/${f.path}#L${x.line}`}
                                target="_blank"
                                rel="noopener"
                                className="font-mono text-zinc-500 hover:underline"
                              >
                                {x.line}:{x.column}
                              </a>
                              <span className={cx("rounded-[4px] px-1.5 py-0.5 text-[10px] font-medium", rules[x.rule as keyof typeof rules] === "error" ? "bg-red-100 text-red-700" : "bg-amber-100 text-amber-800")}>
                                {LINT_RULES.find((r) => r.id === x.rule)?.label}
                              </span>
                              <span className="text-zinc-800">{x.message}</span>
                            </div>
                            <code className="truncate rounded-[4px] bg-zinc-50 px-2 py-1 font-mono text-[11px] text-zinc-600">{x.excerpt}</code>
                          </li>
                        ))}
                      </ul>
                    </div>
                  ))}
                </div>
              )}
            </>
          )}
        </>
      ) : (
        <div className="flex flex-col gap-4">
          <div className="overflow-hidden rounded-[10px] border border-zinc-200 bg-white">
            <div className="border-b border-zinc-100 px-4 py-2.5 text-[12px] font-semibold">Lock whole areas</div>
            {LOCK_AREAS.map((a) => {
              const on = isLocked(a.path)
              return (
                <div key={a.path} className="flex items-center gap-3 border-b border-zinc-100 px-4 py-2.5 last:border-0">
                  <div className="min-w-0 flex-1">
                    <div className="text-[13px]">{a.label}</div>
                    <div className="text-[11px] text-zinc-500">{a.description}</div>
                  </div>
                  <ChromeButton size="sm" variant={on ? "primary" : "default"} onClick={() => toggleLock(a.path)} aria-pressed={on}>
                    {on ? <Icons.lock width={13} height={13} /> : <Icons.unlock width={13} height={13} />} {on ? "Locked" : "Lock"}
                  </ChromeButton>
                </div>
              )
            })}
          </div>
          <div className="overflow-hidden rounded-[10px] border border-zinc-200 bg-white">
            <div className="border-b border-zinc-100 px-4 py-2.5 text-[12px] font-semibold">Locked values ({locks.length})</div>
            {locks.length === 0 ? (
              <p className="px-4 py-3 text-[12px] text-zinc-500">Nothing locked. Use the lock buttons next to any value in the panels to lock it.</p>
            ) : (
              locks.map((p) => (
                <div key={p} className="flex items-center gap-3 border-b border-zinc-100 px-4 py-2 last:border-0">
                  <span className="min-w-0 flex-1 truncate font-mono text-[12px]">{p}</span>
                  <ChromeButton size="sm" variant="ghost" onClick={() => toggleLock(p)}>
                    <Icons.unlock width={13} height={13} /> Unlock
                  </ChromeButton>
                </div>
              ))
            )}
          </div>
          <p className="text-[12px] text-zinc-500">Locks are saved with the design system, so they apply to everyone using this editor.</p>
        </div>
      )}
    </div>
  )
}
