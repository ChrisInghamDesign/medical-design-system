/**
 * State preview for the editor canvas: show every component as if it were hovered,
 * focused, pressed, disabled or open, without touching it.
 *
 * It reads the page's own stylesheets and copies each rule that depends on the
 * state (e.g. `.hover\:bg-primary\/80:hover`) with the state condition removed,
 * scoped to `:root.ds-preview-<state>`. The copies are wrapped in :where() so they
 * keep the original rule's weight: your own state overrides (theme.css) still win,
 * exactly as they do on the live site.
 */
import type { OverrideState } from "./types"

/** What each state looks like in a selector */
const STATE_PATTERNS: Record<OverrideState, RegExp[]> = {
  hover: [/:hover\b/g],
  focus: [/:focus-visible\b/g, /:focus-within\b/g, /:focus\b(?!-)/g],
  active: [/:active\b/g],
  disabled: [
    /:where\(\[data-disabled\][^()]*(?:\([^()]*\))?[^()]*\)/g,
    /\[data-disabled(?:=[^\]]*)?\]/g,
    /\[aria-disabled=["']?true["']?\]/g,
    /:disabled\b/g,
  ],
  open: [
    /:where\(\[data-(?:state=open|open|popup-open|panel-open)\][^()]*(?:\([^()]*\))?[^()]*\)/g,
    /\[data-(?:open|popup-open|panel-open)(?:=[^\]]*)?\]/g,
    /\[data-state=["']?open["']?\]/g,
    /\[aria-expanded=["']?true["']?\]/g,
  ],
}

/** Split a selector list on top-level commas */
function splitSelectors(list: string): string[] {
  const out: string[] = []
  let depth = 0
  let start = 0
  for (let i = 0; i < list.length; i++) {
    const c = list[i]
    if (c === "(" || c === "[") depth++
    else if (c === ")" || c === "]") depth--
    else if (c === "," && depth === 0) {
      out.push(list.slice(start, i))
      start = i + 1
    }
  }
  out.push(list.slice(start))
  return out.map((s) => s.trim()).filter(Boolean)
}

/** One selector with the state removed and scoped to the preview class, or null if it has no state */
function forceSelector(selector: string, state: OverrideState): string | null {
  let s = selector
  let hit = false
  for (const re of STATE_PATTERNS[state]) {
    re.lastIndex = 0
    if (re.test(s)) {
      hit = true
      re.lastIndex = 0
      s = s.replace(re, "")
    }
  }
  if (!hit) return null
  s = s.replace(/:(?:is|where|not)\(\s*\)/g, "").trim()
  // A compound left empty (".group:hover > .x" is fine; ":hover" alone isn't)
  if (!s || /[>+~]$/.test(s)) s = `${s} *`.trim()
  const scope = `:where(:root.ds-preview-${state})`
  // Rules on the root element itself (":root:hover …") scope the root, not a descendant
  if (/^(?::root|html)(?![\w-])/.test(s)) return s.replace(/^(?::root|html)/, scope)
  return `${scope} ${s}`
}

function collect(rules: CSSRuleList, state: OverrideState, out: string[], parent?: string) {
  for (const rule of Array.from(rules)) {
    if (rule instanceof CSSStyleRule) {
      // Resolve CSS nesting (`&:hover` inside `.x { … }`) against the parent selector
      const selectorText = parent && rule.selectorText.includes("&") ? rule.selectorText.replace(/&/g, `:is(${parent})`) : parent ? `:is(${parent}) ${rule.selectorText}` : rule.selectorText
      const forced = splitSelectors(selectorText)
        .map((sel) => forceSelector(sel, state))
        .filter((x): x is string => !!x)
      const decls = rule.style.cssText
      if (forced.length && decls) out.push(`${forced.join(", ")} { ${decls} }`)
      if (rule.cssRules?.length) collect(rule.cssRules, state, out, selectorText)
    } else if ("cssRules" in rule && (rule as CSSGroupingRule).cssRules) {
      // @media, @supports, @layer: forced copies apply regardless of the condition
      collect((rule as CSSGroupingRule).cssRules, state, out, parent)
    }
  }
}

/** CSS that forces `state` on the whole document, built from its stylesheets */
export function forcedStateCss(doc: Document, state: OverrideState, skipIds: string[] = []): string {
  const out: string[] = []
  for (const sheet of Array.from(doc.styleSheets)) {
    const owner = sheet.ownerNode as HTMLElement | null
    if (owner?.id && skipIds.includes(owner.id)) continue
    let rules: CSSRuleList
    try {
      rules = sheet.cssRules
    } catch {
      continue // cross-origin sheet (e.g. Google Fonts)
    }
    collect(rules, state, out)
  }
  return out.join("\n")
}
