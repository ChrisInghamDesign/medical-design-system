/**
 * Colour helpers: parse CSS colours, convert between OKLCH and sRGB hex,
 * and measure WCAG contrast. No dependencies.
 */

export interface Oklch {
  l: number // 0..1
  c: number // 0..~0.4
  h: number // 0..360
  alpha: number // 0..1
}

export interface Rgb {
  r: number // 0..1
  g: number
  b: number
  alpha: number
}

const clamp = (n: number, min = 0, max = 1) => Math.min(max, Math.max(min, n))

function parseAlpha(raw: string | undefined): number {
  if (!raw) return 1
  const s = raw.trim()
  if (s.endsWith("%")) return clamp(parseFloat(s) / 100)
  return clamp(parseFloat(s))
}

function parseNum(raw: string, percentScale = 1): number {
  const s = raw.trim()
  if (s.endsWith("%")) return (parseFloat(s) / 100) * percentScale
  return parseFloat(s)
}

/** Parse oklch(), hex and rgb() colours. Returns null if unrecognised. */
export function parseColor(input: string): Rgb | null {
  const s = input.trim().toLowerCase()
  if (s.startsWith("#")) return hexToRgb(s)
  const ok = s.match(/^oklch\(\s*([^\s/]+)\s+([^\s/]+)\s+([^\s/)]+)\s*(?:\/\s*([^)]+))?\)$/)
  if (ok) {
    const l = parseNum(ok[1], 1)
    const c = parseNum(ok[2], 0.4)
    const h = ok[3] === "none" ? 0 : parseFloat(ok[3])
    return oklchToRgb({ l, c, h, alpha: parseAlpha(ok[4]) })
  }
  const rgb = s.match(/^rgba?\(\s*([^,\s]+)[,\s]+([^,\s]+)[,\s]+([^,\s/)]+)\s*(?:[,/]\s*([^)]+))?\)$/)
  if (rgb) {
    const ch = (v: string) => (v.endsWith("%") ? parseFloat(v) / 100 : parseFloat(v) / 255)
    return { r: ch(rgb[1]), g: ch(rgb[2]), b: ch(rgb[3]), alpha: parseAlpha(rgb[4]) }
  }
  return null
}

export function parseOklch(input: string): Oklch | null {
  const s = input.trim().toLowerCase()
  const ok = s.match(/^oklch\(\s*([^\s/]+)\s+([^\s/]+)\s+([^\s/)]+)\s*(?:\/\s*([^)]+))?\)$/)
  if (ok) {
    return {
      l: parseNum(ok[1], 1),
      c: parseNum(ok[2], 0.4),
      h: ok[3] === "none" ? 0 : parseFloat(ok[3]),
      alpha: parseAlpha(ok[4]),
    }
  }
  const rgb = parseColor(s)
  return rgb ? rgbToOklch(rgb) : null
}

export function hexToRgb(hex: string): Rgb | null {
  let h = hex.replace("#", "")
  if (h.length === 3 || h.length === 4) h = h.split("").map((c) => c + c).join("")
  if (h.length !== 6 && h.length !== 8) return null
  const n = (i: number) => parseInt(h.slice(i, i + 2), 16) / 255
  return { r: n(0), g: n(2), b: n(4), alpha: h.length === 8 ? n(6) : 1 }
}

export function rgbToHex(rgb: Rgb, withAlpha = false): string {
  const to = (v: number) => Math.round(clamp(v) * 255).toString(16).padStart(2, "0")
  return `#${to(rgb.r)}${to(rgb.g)}${to(rgb.b)}${withAlpha && rgb.alpha < 1 ? to(rgb.alpha) : ""}`
}

const toLinear = (c: number) => (c <= 0.04045 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4))
const fromLinear = (c: number) => (c <= 0.0031308 ? 12.92 * c : 1.055 * Math.pow(c, 1 / 2.4) - 0.055)

function oklabToLinearRgb(L: number, a: number, b: number): [number, number, number] {
  const l_ = L + 0.3963377774 * a + 0.2158037573 * b
  const m_ = L - 0.1055613458 * a - 0.0638541728 * b
  const s_ = L - 0.0894841775 * a - 1.291485548 * b
  const l = l_ ** 3
  const m = m_ ** 3
  const s = s_ ** 3
  return [
    4.0767416621 * l - 3.3077115913 * m + 0.2309699292 * s,
    -1.2684380046 * l + 2.6097574011 * m - 0.3413193965 * s,
    -0.0041960863 * l - 0.7034186147 * m + 1.707614701 * s,
  ]
}

function inGamut([r, g, b]: [number, number, number]) {
  const e = 0.0001
  return r >= -e && r <= 1 + e && g >= -e && g <= 1 + e && b >= -e && b <= 1 + e
}

/** OKLCH to sRGB, reducing chroma until the colour fits in sRGB. */
export function oklchToRgb({ l, c, h, alpha }: Oklch): Rgb {
  const hr = (h * Math.PI) / 180
  let chroma = c
  let lin = oklabToLinearRgb(l, chroma * Math.cos(hr), chroma * Math.sin(hr))
  if (!inGamut(lin)) {
    let lo = 0
    let hi = c
    for (let i = 0; i < 24; i++) {
      chroma = (lo + hi) / 2
      lin = oklabToLinearRgb(l, chroma * Math.cos(hr), chroma * Math.sin(hr))
      if (inGamut(lin)) lo = chroma
      else hi = chroma
    }
    lin = oklabToLinearRgb(l, lo * Math.cos(hr), lo * Math.sin(hr))
  }
  return { r: clamp(fromLinear(lin[0])), g: clamp(fromLinear(lin[1])), b: clamp(fromLinear(lin[2])), alpha }
}

export function rgbToOklch({ r, g, b, alpha }: Rgb): Oklch {
  const lr = toLinear(r)
  const lg = toLinear(g)
  const lb = toLinear(b)
  const l = Math.cbrt(0.4122214708 * lr + 0.5363325363 * lg + 0.0514459929 * lb)
  const m = Math.cbrt(0.2119034982 * lr + 0.6806995451 * lg + 0.1073969566 * lb)
  const s = Math.cbrt(0.0883024619 * lr + 0.2817188376 * lg + 0.6299787005 * lb)
  const L = 0.2104542553 * l + 0.793617785 * m - 0.0040720468 * s
  const A = 1.9779984951 * l - 2.428592205 * m + 0.4505937099 * s
  const B = 0.0259040371 * l + 0.7827717662 * m - 0.808675766 * s
  const C = Math.sqrt(A * A + B * B)
  let H = (Math.atan2(B, A) * 180) / Math.PI
  if (H < 0) H += 360
  return { l: L, c: C < 0.0002 ? 0 : C, h: C < 0.0002 ? 0 : H, alpha }
}

const round = (n: number, d: number) => {
  const f = 10 ** d
  return Math.round(n * f) / f
}

export function formatOklch({ l, c, h, alpha }: Oklch): string {
  const base = `oklch(${round(l, 4)} ${round(c, 4)} ${round(h, 3)}`
  return alpha < 1 ? `${base} / ${round(alpha * 100, 1)}%)` : `${base})`
}

/** Hex (no alpha) for a CSS colour string, for native colour inputs. */
export function toHex(color: string): string {
  const rgb = parseColor(color)
  return rgb ? rgbToHex(rgb) : "#000000"
}

/** Replace the RGB part of a colour from a hex value, keeping its alpha. */
export function withHex(color: string, hex: string): string {
  const rgb = hexToRgb(hex)
  if (!rgb) return color
  const alpha = parseColor(color)?.alpha ?? 1
  return formatOklch(rgbToOklch({ ...rgb, alpha }))
}

export function withAlpha(color: string, alpha: number): string {
  const ok = parseOklch(color)
  if (!ok) return color
  return formatOklch({ ...ok, alpha: clamp(alpha) })
}

export function getAlpha(color: string): number {
  return parseColor(color)?.alpha ?? 1
}

/** Composite a translucent colour over a background. */
function over(fg: Rgb, bg: Rgb): Rgb {
  const a = fg.alpha
  return {
    r: fg.r * a + bg.r * (1 - a),
    g: fg.g * a + bg.g * (1 - a),
    b: fg.b * a + bg.b * (1 - a),
    alpha: 1,
  }
}

function luminance({ r, g, b }: Rgb) {
  return 0.2126 * toLinear(r) + 0.7152 * toLinear(g) + 0.0722 * toLinear(b)
}

/** WCAG 2 contrast ratio between a text colour and a surface. */
export function contrastRatio(text: string, surface: string, page = "#ffffff"): number | null {
  const pageRgb = parseColor(page) ?? { r: 1, g: 1, b: 1, alpha: 1 }
  const s = parseColor(surface)
  const t = parseColor(text)
  if (!s || !t) return null
  const sOpaque = s.alpha < 1 ? over(s, pageRgb) : s
  const tOpaque = t.alpha < 1 ? over(t, sOpaque) : t
  const a = luminance(sOpaque)
  const b = luminance(tOpaque)
  const [hi, lo] = a > b ? [a, b] : [b, a]
  return (hi + 0.05) / (lo + 0.05)
}

export type ContrastLevel = "AAA" | "AA" | "AA Large" | "Fail"

export function contrastLevel(ratio: number): ContrastLevel {
  if (ratio >= 7) return "AAA"
  if (ratio >= 4.5) return "AA"
  if (ratio >= 3) return "AA Large"
  return "Fail"
}
