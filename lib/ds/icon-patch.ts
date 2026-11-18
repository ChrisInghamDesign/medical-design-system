/**
 * Point a component's icon imports at lib/ds/icons so its icons follow the design
 * system's icon library. Used by scripts/design-system.ts on components/ui (which
 * the DS Manager sync replaces with HugeIcons imports) and safe to run repeatedly.
 */
const ICON_MODULES = ["@hugeicons/react", "@hugeicons/core-free-icons", "@/lib/ds/icons"]
const IMPORT_RE = /import\s*\{([^}]*)\}\s*from\s*"([^"]+)"[ \t]*;?[ \t]*\n?/g

export function patchIconImports(src: string, available: Set<string>): { src: string; missing: string[] } {
  const found: { start: number; end: number }[] = []
  const names: string[] = []
  for (const m of src.matchAll(IMPORT_RE)) {
    if (!ICON_MODULES.includes(m[2])) continue
    found.push({ start: m.index!, end: m.index! + m[0].length })
    for (const raw of m[1].split(",")) {
      const name = raw.replace(/^\s*type\s+/, "").trim()
      if (name && !names.includes(name)) names.push(name)
    }
  }
  if (!found.length) return { src, missing: [] }

  const missing = names.filter((n) => n !== "HugeiconsIcon" && !available.has(n))
  const ordered = [...names.filter((n) => n === "HugeiconsIcon"), ...names.filter((n) => n !== "HugeiconsIcon")]
  const oneLine = `import { ${ordered.join(", ")} } from "@/lib/ds/icons"\n`
  const statement = oneLine.length <= 100 ? oneLine : `import {\n${ordered.map((n) => `  ${n},\n`).join("")}} from "@/lib/ds/icons"\n`

  let out = ""
  let last = 0
  found.forEach((f, i) => {
    out += src.slice(last, f.start) + (i === 0 ? statement : "")
    last = f.end
  })
  out += src.slice(last)
  return { src: out, missing }
}

/** Icon names lib/ds/icons.tsx exports (read from its source, so the CLI doesn't load React) */
export function iconNamesFromSource(iconsSource: string): Set<string> {
  return new Set(Array.from(iconsSource.matchAll(/export const (\w+Icon) = "/g), (m) => m[1]))
}
