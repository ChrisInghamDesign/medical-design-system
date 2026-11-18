// @ts-check
/**
 * Design system lint rules. Plain JavaScript so both ESLint (eslint.config.mjs)
 * and the editor's Lint page (in the browser) can run the same checks.
 *
 * Each rule scans a file's source text and returns findings with a line/column.
 */

/** @typedef {"restyling"|"raw-colors"|"made-up-sizes"|"inline-styles"|"typos"|"dynamic-classes"} RuleId */
/** @typedef {{ rule: RuleId, index: number, line: number, column: number, message: string, excerpt: string }} Finding */

const PALETTE = [
  "slate", "gray", "zinc", "neutral", "stone", "red", "orange", "amber", "yellow", "lime", "green", "emerald",
  "teal", "cyan", "sky", "blue", "indigo", "violet", "purple", "fuchsia", "pink", "rose",
]
const COLOR_PREFIXES = ["bg", "text", "border", "ring", "fill", "stroke", "from", "via", "to", "outline", "decoration", "divide", "placeholder", "caret", "accent"]

/** Non-colour words that can follow a colour prefix (text-sm, border-2, bg-cover…) */
const NON_COLOR = new Set([
  "xs", "sm", "base", "lg", "xl", "2xl", "3xl", "4xl", "5xl", "6xl", "7xl", "8xl", "9xl",
  "left", "center", "right", "justify", "start", "end", "balance", "pretty", "wrap", "nowrap", "clip", "ellipsis",
  "x", "y", "t", "b", "l", "r", "s", "e", "solid", "dashed", "dotted", "double", "hidden", "none", "collapse", "separate",
  "inset", "offset", "clip", "cover", "contain", "fixed", "local", "scroll", "no-repeat", "repeat", "auto",
  "transparent", "current", "inherit", "black", "white", "linear", "radial", "conic", "origin", "blend", "clip-padding",
  "clip-border", "clip-content", "clip-text", "top", "bottom", "opacity", "underline", "line-through", "overline",
  "from-font", "wavy", "shadow", "size", "spacing",
])

/** @param {string} text @param {number} index */
function position(text, index) {
  const before = text.slice(0, index)
  const line = before.split("\n").length
  const column = index - before.lastIndexOf("\n")
  return { line, column }
}

/** @param {string} text @param {number} index */
function excerptAt(text, index) {
  const start = text.lastIndexOf("\n", index) + 1
  const end = text.indexOf("\n", index)
  return text.slice(start, end < 0 ? undefined : end).trim().slice(0, 160)
}

/** Ranges of class strings: className="…", className={`…`}, cn("…", …), cva("…")
 * @param {string} text */
function classRanges(text) {
  /** @type {{ start: number, value: string }[]} */
  const ranges = []
  for (const m of text.matchAll(/className\s*=\s*"([^"]*)"/g)) ranges.push({ start: (m.index ?? 0) + m[0].indexOf('"') + 1, value: m[1] })
  for (const m of text.matchAll(/\b(?:cn|cva|clsx|twMerge)\s*\(/g)) {
    // collect string literals until the matching ")"
    let depth = 0
    let i = (m.index ?? 0) + m[0].length - 1
    for (; i < text.length; i++) {
      const c = text[i]
      if (c === "(") depth++
      else if (c === ")") {
        depth--
        if (depth === 0) break
      } else if (c === '"' || c === "'") {
        const end = text.indexOf(c, i + 1)
        if (end < 0) break
        ranges.push({ start: i + 1, value: text.slice(i + 1, end) })
        i = end
      } else if (c === "`") {
        const end = text.indexOf("`", i + 1)
        if (end < 0) break
        ranges.push({ start: i + 1, value: text.slice(i + 1, end) })
        i = end
      }
    }
  }
  for (const m of text.matchAll(/className\s*=\s*\{\s*`([^`]*)`/g)) ranges.push({ start: (m.index ?? 0) + m[0].indexOf("`") + 1, value: m[1] })
  return ranges
}

/** Each class token in a range with its absolute index
 * @param {string} text */
function* classTokens(text) {
  for (const r of classRanges(text)) {
    for (const m of r.value.matchAll(/[^\s]+/g)) yield { token: m[0], index: r.start + (m.index ?? 0) }
  }
}

/** Strip variant prefixes like hover:, dark:, md:, data-[x]: */
const bare = (/** @type {string} */ token) => token.replace(/^!/, "").split(":").pop() ?? token

/** @param {string} a @param {string} b */
function levenshtein(a, b) {
  const dp = Array.from({ length: a.length + 1 }, (_, i) => [i, ...Array(b.length).fill(0)])
  for (let j = 1; j <= b.length; j++) dp[0][j] = j
  for (let i = 1; i <= a.length; i++)
    for (let j = 1; j <= b.length; j++)
      dp[i][j] = Math.min(dp[i - 1][j] + 1, dp[i][j - 1] + 1, dp[i - 1][j - 1] + (a[i - 1] === b[j - 1] ? 0 : 1))
  return dp[a.length][b.length]
}

/**
 * Run the design system rules on one file.
 * @param {string} text  file contents
 * @param {{ rules: Partial<Record<RuleId, "off"|"warn"|"error">>, colorTokens: string[], filePath?: string }} options
 * @returns {Finding[]}
 */
export function checkSource(text, { rules, colorTokens, filePath = "" }) {
  /** @type {Finding[]} */
  const out = []
  const on = (/** @type {RuleId} */ id) => rules[id] && rules[id] !== "off"
  const add = (/** @type {RuleId} */ rule, /** @type {number} */ index, /** @type {string} */ message) =>
    out.push({ rule, index, ...position(text, index), message, excerpt: excerptAt(text, index) })
  const tokens = new Set(colorTokens)
  const colorAlt = COLOR_PREFIXES.join("|")

  if (on("inline-styles")) {
    for (const m of text.matchAll(/\bstyle\s*=\s*\{\{/g)) add("inline-styles", m.index ?? 0, "Inline style. Use Tailwind classes and theme tokens instead.")
  }

  if (on("dynamic-classes")) {
    for (const m of text.matchAll(/(?:className\s*=\s*\{|\b(?:cn|clsx)\s*\()\s*`[^`]*\$\{/g))
      add("dynamic-classes", m.index ?? 0, "Class name built with ${…}. Tailwind can't see it; map values to full class names instead.")
  }

  for (const { token, index } of classTokens(text)) {
    const t = bare(token)
    if (on("raw-colors")) {
      const palette = t.match(new RegExp(`^(?:${colorAlt})-(${PALETTE.join("|")})-(\\d{2,3})(?:/\\d+)?$`))
      const arbitrary = t.match(new RegExp(`^(?:${colorAlt})-\\[(#[0-9a-fA-F]{3,8}|rgba?\\(|hsla?\\(|oklch\\()`))
      const bw = t.match(new RegExp(`^(?:${colorAlt})-(black|white)(?:/\\d+)?$`))
      if (palette || arbitrary || bw)
        add("raw-colors", index, `Raw colour "${token}". Use a theme colour such as bg-primary or text-muted-foreground.`)
    }
    if (on("made-up-sizes")) {
      if (/^-?(?:p[xytrblse]?|m[xytrblse]?|gap(?:-[xy])?|w|h|size|min-w|min-h|max-w|max-h|text|leading|tracking|rounded(?:-[trblse]{1,2})?|top|left|right|bottom|inset(?:-[xy])?|space-[xy]|translate-[xy])-\[(?:-?[\d.]+(?:px|rem|em|%|vh|vw)?|calc\([^\]]*\))\]$/.test(t))
        add("made-up-sizes", index, `Made-up size "${token}". Use the spacing, type or radius scale instead.`)
    }
    if (on("typos")) {
      const m = t.match(new RegExp(`^(?:${colorAlt})-([a-z][a-z0-9-]*?)(?:/\\d+)?$`))
      if (m) {
        const name = m[1]
        const known =
          tokens.has(name) || NON_COLOR.has(name) || /^\d/.test(name) || PALETTE.some((p) => name === p || name.startsWith(p + "-"))
        if (!known) {
          const close = [...tokens].find((tok) => levenshtein(tok, name) <= 2 && Math.abs(tok.length - name.length) <= 2)
          if (close) add("typos", index, `"${token}" looks like a typo of the "${close}" colour.`)
        }
      }
    }
  }

  if (on("restyling") && !filePath.includes("components/ui/")) {
    const names = new Set()
    for (const m of text.matchAll(/import\s*\{([^}]*)\}\s*from\s*["']@\/components\/ui\/[^"']+["']/g))
      for (const n of m[1].split(",")) names.add(n.trim().split(/\s+as\s+/).pop())
    if (names.size) {
      const tagRe = new RegExp(`<(${[...names].filter(Boolean).join("|")})\\b[^>]*?className\\s*=\\s*(?:"([^"]*)"|\\{\\s*\`([^\`]*)\`)`, "g")
      for (const m of text.matchAll(tagRe)) {
        const classes = (m[2] ?? m[3] ?? "").split(/\s+/).filter(Boolean)
        const restyle = classes.filter((c) => {
          const b = bare(c)
          return (
            /^(?:bg|border|ring|shadow|rounded)(?:-|$)/.test(b) ||
            (b.startsWith("text-") && tokens.has(b.slice(5).split("/")[0]))
          )
        })
        if (restyle.length)
          add("restyling", m.index ?? 0, `<${m[1]}> restyled with ${restyle.join(" ")}. Change the component in the design system instead.`)
      }
    }
  }

  return out.sort((a, b) => a.index - b.index)
}
