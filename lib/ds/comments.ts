/**
 * Comments on the design system, stored as GitHub issues in the repo (label
 * "design-comment"), so they need no backend and show up for anyone on GitHub.
 * Each issue carries where it was left (page, part) in a hidden marker. Reading
 * works without a token on a public repo; posting needs a token with Issues: write.
 */
import { githubApi, type RepoConfig } from "./github"

export const COMMENT_LABEL = "design-comment"

export interface CommentAnchor {
  /** Editor view, e.g. "component:button" or "foundation:colors" */
  view: string
  /** Part (data-slot) the comment is about */
  slot?: string
  variant?: string
  mode?: "light" | "dark"
}

export interface CommentUser {
  login: string
  avatar_url: string
}

export interface CommentThread {
  number: number
  text: string
  anchor: CommentAnchor
  open: boolean
  user: CommentUser
  createdAt: string
  replies: number
  url: string
}

export interface CommentReply {
  id: number
  text: string
  user: CommentUser
  createdAt: string
}

interface Issue {
  number: number
  title: string
  body: string | null
  state: "open" | "closed"
  user: CommentUser
  created_at: string
  comments: number
  html_url: string
  pull_request?: unknown
}

const MARKER = /\n*<!--\s*ds-comment\s+(\{[\s\S]*?\})\s*-->\s*$/

function parseIssue(issue: Issue): CommentThread {
  const body = issue.body ?? ""
  const m = body.match(MARKER)
  let anchor: CommentAnchor = { view: "overview" }
  try {
    if (m) anchor = { ...anchor, ...JSON.parse(m[1]) }
  } catch {}
  return {
    number: issue.number,
    text: (m ? body.slice(0, m.index) : body).trim() || issue.title,
    anchor,
    open: issue.state === "open",
    user: issue.user,
    createdAt: issue.created_at,
    replies: issue.comments,
    url: issue.html_url,
  }
}

const base = (repo: RepoConfig) => `/repos/${repo.owner}/${repo.repo}`

export async function listThreads(repo: RepoConfig, token: string | null): Promise<CommentThread[]> {
  const issues = await githubApi<Issue[]>(
    `${base(repo)}/issues?labels=${COMMENT_LABEL}&state=all&per_page=100&sort=created&direction=desc`,
    token,
    undefined,
    "Issues"
  )
  return issues.filter((i) => !i.pull_request).map(parseIssue)
}

export async function listReplies(repo: RepoConfig, token: string | null, number: number): Promise<CommentReply[]> {
  const list = await githubApi<{ id: number; body: string | null; user: CommentUser; created_at: string }[]>(
    `${base(repo)}/issues/${number}/comments?per_page=100`,
    token,
    undefined,
    "Issues"
  )
  return list.map((c) => ({ id: c.id, text: c.body ?? "", user: c.user, createdAt: c.created_at }))
}

export async function createThread(repo: RepoConfig, token: string, anchor: CommentAnchor, text: string, where: string): Promise<CommentThread> {
  const firstLine = text.trim().split("\n")[0].slice(0, 60)
  const issue = await githubApi<Issue>(
    `${base(repo)}/issues`,
    token,
    {
      method: "POST",
      body: JSON.stringify({
        title: `${where}: ${firstLine}`,
        body: `${text.trim()}\n\n<!-- ds-comment ${JSON.stringify(anchor)} -->`,
        labels: [COMMENT_LABEL],
      }),
    },
    "Issues"
  )
  return parseIssue(issue)
}

export async function addReply(repo: RepoConfig, token: string, number: number, text: string): Promise<CommentReply> {
  const c = await githubApi<{ id: number; body: string | null; user: CommentUser; created_at: string }>(
    `${base(repo)}/issues/${number}/comments`,
    token,
    { method: "POST", body: JSON.stringify({ body: text.trim() }) },
    "Issues"
  )
  return { id: c.id, text: c.body ?? "", user: c.user, createdAt: c.created_at }
}

export async function setThreadOpen(repo: RepoConfig, token: string, number: number, open: boolean): Promise<void> {
  await githubApi(
    `${base(repo)}/issues/${number}`,
    token,
    { method: "PATCH", body: JSON.stringify({ state: open ? "open" : "closed", ...(open ? {} : { state_reason: "completed" }) }) },
    "Issues"
  )
}
