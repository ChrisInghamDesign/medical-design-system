/**
 * Share links: the whole draft (tokens plus the page being viewed) packed into the
 * URL's #fragment, so nothing is uploaded anywhere and the link works on the static
 * site. Fragments aren't sent to the server.
 */
import type { DesignTokens } from "./types"

export interface SharePayload {
  v: 1
  tokens: DesignTokens
  view?: string
}

export const SHARE_PREFIX = "share="

function toBase64Url(bytes: Uint8Array) {
  let bin = ""
  for (let i = 0; i < bytes.length; i += 0x8000) bin += String.fromCharCode(...bytes.subarray(i, i + 0x8000))
  return btoa(bin).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "")
}

function fromBase64Url(s: string) {
  const bin = atob(s.replace(/-/g, "+").replace(/_/g, "/") + "===".slice((s.length + 3) % 4))
  return Uint8Array.from(bin, (c) => c.charCodeAt(0))
}

async function pipe(bytes: Uint8Array, stream: CompressionStream | DecompressionStream) {
  const out = new Response(new Blob([bytes as BlobPart]).stream().pipeThrough(stream))
  return new Uint8Array(await out.arrayBuffer())
}

/** "z…" = deflate-compressed JSON, "j…" = plain JSON (browsers without CompressionStream) */
export async function encodeShare(payload: SharePayload): Promise<string> {
  const json = new TextEncoder().encode(JSON.stringify(payload))
  if (typeof CompressionStream !== "undefined") return "z" + toBase64Url(await pipe(json, new CompressionStream("deflate-raw")))
  return "j" + toBase64Url(json)
}

export async function decodeShare(data: string): Promise<SharePayload | null> {
  try {
    const kind = data[0]
    let bytes = fromBase64Url(data.slice(1))
    if (kind === "z") bytes = await pipe(bytes, new DecompressionStream("deflate-raw"))
    else if (kind !== "j") return null
    const payload = JSON.parse(new TextDecoder().decode(bytes)) as SharePayload
    if (payload?.v !== 1 || !payload.tokens?.colors) return null
    return payload
  } catch {
    return null
  }
}

/** Full editor URL for a payload */
export async function shareUrl(payload: SharePayload): Promise<string> {
  const { origin, pathname, search } = window.location
  return `${origin}${pathname}${search}#${SHARE_PREFIX}${await encodeShare(payload)}`
}
