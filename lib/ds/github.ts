/**
 * Save design system files to GitHub straight from the browser, as one commit,
 * using a fine-grained personal access token (Contents: read and write).
 */

export interface RepoConfig {
  owner: string
  repo: string
  branch: string
}

export const DEFAULT_REPO: RepoConfig = {
  owner: "ChrisInghamDesign",
  repo: "medical-design-system",
  branch: "main",
}

const API = "https://api.github.com"

/** Call the GitHub REST API. `need` names the token permission a 403/404 most likely means is missing. */
export async function githubApi<T>(path: string, token: string | null, init?: RequestInit, need: "Contents" | "Issues" = "Contents"): Promise<T> {
  const res = await fetch(`${API}${path}`, {
    ...init,
    headers: {
      Accept: "application/vnd.github+json",
      "X-GitHub-Api-Version": "2022-11-28",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...(init?.body ? { "Content-Type": "application/json" } : {}),
      ...init?.headers,
    },
    cache: "no-store",
  })
  if (!res.ok) {
    let detail = ""
    try {
      detail = ((await res.json()) as { message?: string }).message ?? ""
    } catch {}
    const hint =
      res.status === 401
        ? "The token is invalid or expired."
        : res.status === 403 || res.status === 404
          ? `The token can't ${need === "Issues" ? "post comments on" : "write to"} this repo. Give it ${need}: Read and write access to this repository.`
          : ""
    throw new Error([`GitHub ${res.status}`, detail, hint].filter(Boolean).join(" · "))
  }
  return (await res.json()) as T
}

/** Check a token can push to the repo. Returns the GitHub login. */
export async function verifyToken(token: string, repo: RepoConfig): Promise<string> {
  const info = await githubApi<{ permissions?: { push?: boolean } }>(`/repos/${repo.owner}/${repo.repo}`, token)
  if (!info.permissions?.push) {
    throw new Error("This token can read the repo but not write to it. Give it Contents: Read and write.")
  }
  const user = await githubApi<{ login: string }>(`/user`, token).catch(() => ({ login: "your account" }))
  return user.login
}

/** Read a text file from the branch (works without a token on public repos). */
export async function readRepoFile(path: string, repo: RepoConfig, token: string | null): Promise<string> {
  const res = await fetch(
    `${API}/repos/${repo.owner}/${repo.repo}/contents/${path}?ref=${encodeURIComponent(repo.branch)}`,
    {
      headers: {
        Accept: "application/vnd.github.raw+json",
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
      cache: "no-store",
    }
  )
  if (!res.ok) throw new Error(`GitHub ${res.status}`)
  return res.text()
}

/** Commit several files to the branch in one commit. Returns the commit URL. */
export async function commitFiles(
  files: { path: string; content: string }[],
  message: string,
  repo: RepoConfig,
  token: string
): Promise<string> {
  const base = `/repos/${repo.owner}/${repo.repo}`
  const ref = await githubApi<{ object: { sha: string } }>(`${base}/git/ref/heads/${repo.branch}`, token)
  const parent = await githubApi<{ tree: { sha: string } }>(`${base}/git/commits/${ref.object.sha}`, token)
  const tree = await githubApi<{ sha: string }>(`${base}/git/trees`, token, {
    method: "POST",
    body: JSON.stringify({
      base_tree: parent.tree.sha,
      tree: files.map((f) => ({ path: f.path, mode: "100644", type: "blob", content: f.content })),
    }),
  })
  const commit = await githubApi<{ sha: string; html_url: string }>(`${base}/git/commits`, token, {
    method: "POST",
    body: JSON.stringify({ message, tree: tree.sha, parents: [ref.object.sha] }),
  })
  await githubApi(`${base}/git/refs/heads/${repo.branch}`, token, {
    method: "PATCH",
    body: JSON.stringify({ sha: commit.sha }),
  })
  return commit.html_url
}
