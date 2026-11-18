/**
 * Reads the Tailwind classes each shadcn component ships with, straight from
 * components/ui/*.tsx. Used at build time to produce
 * design-system/component-classes.json, which the editor's Utilities tab shows.
 */

export interface CvaInfo {
  base: string[]
  groups: Record<string, Record<string, string[]>>
  defaults: Record<string, string>
}

export interface ComponentClasses {
  /** data-slot name → classes on that part */
  slots: Record<string, string[]>
  /** slot → name of the cva() it uses, if any */
  slotCva: Record<string, string>
  cva: Record<string, CvaInfo>
}

const splitClasses = (s: string) =>
  s
    .split(/\s+/)
    .map((c) => c.trim())
    .filter(Boolean)

function stringsIn(text: string): string[] {
  const out: string[] = []
  for (const m of text.matchAll(/"((?:[^"\\]|\\.)*)"/g)) out.push(m[1])
  return out
}

/** Find the matching close bracket for the opener at `start` */
function matchBracket(src: string, start: number, open = "{", close = "}"): number {
  let depth = 0
  let inStr: string | null = null
  for (let i = start; i < src.length; i++) {
    const c = src[i]
    if (inStr) {
      if (c === "\\") i++
      else if (c === inStr) inStr = null
      continue
    }
    if (c === '"' || c === "'" || c === "`") inStr = c
    else if (c === open) depth++
    else if (c === close) {
      depth--
      if (depth === 0) return i
    }
  }
  return src.length - 1
}

function parseObjectGroups(body: string): Record<string, Record<string, string[]>> {
  // body is the text inside `variants: { ... }`
  const groups: Record<string, Record<string, string[]>> = {}
  const re = /([\w"-]+)\s*:\s*\{/g
  let m: RegExpExecArray | null
  let i = 0
  while ((m = re.exec(body))) {
    if (m.index < i) continue
    const open = m.index + m[0].length - 1
    const end = matchBracket(body, open)
    const name = m[1].replace(/"/g, "")
    const inner = body.slice(open + 1, end)
    const values: Record<string, string[]> = {}
    for (const vm of inner.matchAll(/([\w"-]+)\s*:\s*("(?:[^"\\]|\\.)*"|\[[\s\S]*?\])/g)) {
      values[vm[1].replace(/"/g, "")] = splitClasses(stringsIn(vm[2]).join(" "))
    }
    groups[name] = values
    i = end
    re.lastIndex = end
  }
  return groups
}

export function parseComponentClasses(src: string): ComponentClasses {
  const result: ComponentClasses = { slots: {}, slotCva: {}, cva: {} }

  // cva definitions
  for (const m of src.matchAll(/const (\w+) = cva\(/g)) {
    const open = (m.index ?? 0) + m[0].length - 1
    const end = matchBracket(src, open, "(", ")")
    const args = src.slice(open + 1, end)
    const vIdx = args.search(/\bvariants\s*:\s*\{/)
    const baseText = vIdx >= 0 ? args.slice(0, args.lastIndexOf("{", vIdx)) : args
    const info: CvaInfo = { base: splitClasses(stringsIn(baseText).join(" ")), groups: {}, defaults: {} }
    if (vIdx >= 0) {
      const vOpen = args.indexOf("{", vIdx)
      const vEnd = matchBracket(args, vOpen)
      info.groups = parseObjectGroups(args.slice(vOpen + 1, vEnd))
      const dIdx = args.search(/\bdefaultVariants\s*:\s*\{/)
      if (dIdx >= 0) {
        const dOpen = args.indexOf("{", dIdx)
        const dEnd = matchBracket(args, dOpen)
        for (const dm of args.slice(dOpen + 1, dEnd).matchAll(/([\w"-]+)\s*:\s*"([^"]*)"/g)) info.defaults[dm[1].replace(/"/g, "")] = dm[2]
      }
    }
    result.cva[m[1]] = info
  }

  // Slots: data-slot="x" in JSX, or slot: "x" in useRender state
  const slotRe = /data-slot="([\w-]+)"|\bslot:\s*"([\w-]+)"/g
  const hits = Array.from(src.matchAll(slotRe)).map((m) => ({ index: m.index ?? 0, slot: m[1] ?? m[2] }))
  hits.forEach((hit, i) => {
    // Window: from the start of this JSX element (or function) to the next slot
    const fnStart = src.lastIndexOf("\nfunction ", hit.index)
    const elStart = Math.max(src.lastIndexOf("<", hit.index), fnStart)
    const next = hits[i + 1]?.index ?? src.length
    const fnEnd = src.indexOf("\nfunction ", hit.index)
    const end = Math.min(next, fnEnd > 0 ? fnEnd : src.length)
    const windowText = src.slice(Math.max(elStart, fnStart), end)
    const classes: string[] = []
    for (const cm of windowText.matchAll(/\bcn\(/g)) {
      const open = (cm.index ?? 0) + cm[0].length - 1
      const close = matchBracket(windowText, open, "(", ")")
      const call = windowText.slice(open + 1, close)
      const ref = call.match(/(\w+Variants)\(/)
      if (ref) result.slotCva[hit.slot] = ref[1]
      classes.push(...splitClasses(stringsIn(call.replace(/\w+Variants\([^)]*\)/g, "")).join(" ")))
    }
    const ref = windowText.match(/className[^]*?(\w+Variants)\(/)
    if (ref && !result.slotCva[hit.slot] && result.cva[ref[1]]) result.slotCva[hit.slot] = ref[1]
    if (!result.slots[hit.slot]) result.slots[hit.slot] = Array.from(new Set(classes))
  })
  return result
}
