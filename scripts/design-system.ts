/**
 * Design system CLI.
 *
 *   npx tsx scripts/design-system.ts import   Read app/globals.css (e.g. after a DS Manager
 *                                             sync) into design-system/tokens.json, then build
 *   npx tsx scripts/design-system.ts build    Regenerate every library output from tokens.json
 *
 * `build` runs automatically before `npm run dev` and `npm run build`.
 */
import { existsSync, readFileSync, writeFileSync, mkdirSync, readdirSync } from "node:fs"
import { dirname, join } from "node:path"
import { ADAPTERS } from "../lib/ds/adapters"
import { importShadcnCss, patchComponentSource, patchGlobalsCss } from "../lib/ds/adapters/shadcn"
import { parseComponentClasses, type ComponentClasses } from "../lib/ds/component-classes"
import { COLOR_TOKENS, SHADOW_LEVELS, normalizeTokens, type DesignTokens } from "../lib/ds/types"

const TOKENS = "design-system/tokens.json"
const GLOBALS = "app/globals.css"
const UI_DIR = "components/ui"
const CLASSES = "design-system/component-classes.json"
const BRAND = "components/brand.tsx"

/** components/brand.tsx: <Logo /> and <Mark /> from the Brand page */
function brandSource(input: DesignTokens): string {
  const b = normalizeTokens(input).brand!
  const img = (src: string | undefined, height: number, cls: string) =>
    src ? `<img src={\`\${BASE}${src}\`} alt={alt} style={{ height: ${height} }} className={cn("w-auto", ${JSON.stringify(cls)}, className)} />` : "null"
  const pair = (light: string | undefined, dark: string | undefined, height: number, fallback: string) => {
    if (!light && !dark) return fallback
    if (!dark) return img(light, height, "")
    if (!light) return img(dark, height, "")
    return `<>\n      ${img(light, height, "dark:hidden")}\n      ${img(dark, height, "hidden dark:block")}\n    </>`
  }
  const darkFallback = b.darkFallback === "text" && b.logoLight && !b.logoDark
  const logo = darkFallback
    ? `<>\n      ${img(b.logoLight, b.logoHeight, "dark:hidden")}\n      <span className={cn("hidden font-heading text-lg font-semibold dark:inline", className)}>{alt}</span>\n    </>`
    : pair(b.logoLight, b.logoDark, b.logoHeight, `<span className={cn("font-heading text-lg font-semibold", className)}>{alt}</span>`)
  return `/* eslint-disable @next/next/no-img-element -- static SVGs */
// Generated from design-system/tokens.json (brand) by scripts/design-system.ts. Edit on the editor's Brand page.
import { cn } from "@/lib/utils"

const BASE = process.env.NEXT_PUBLIC_BASE_PATH ?? ""

export function Logo({ className, alt = ${JSON.stringify(input.name)} }: { className?: string; alt?: string }) {
  return (
    ${logo}
  )
}

export function Mark({ className, alt = ${JSON.stringify(input.name)} }: { className?: string; alt?: string }) {
  return (
    ${pair(b.markLight, b.markDark, b.markHeight, "<Logo className={className} alt={alt} />")}
  )
}
`
}

function emptyTokens(): DesignTokens {
  const colors = Object.fromEntries(COLOR_TOKENS.map((t) => [t, "oklch(0.5 0 0)"])) as DesignTokens["colors"]["light"]
  const shadows = Object.fromEntries(SHADOW_LEVELS.map((l) => [l, "0 1px 2px 0 oklch(0 0 0 / 10%)"])) as DesignTokens["shadows"]["light"]
  return normalizeTokens({
    version: 1,
    name: "Medical",
    description: "Medical design system",
    colors: { light: { ...colors }, dark: { ...colors } },
    fonts: { sans: "Inter", heading: "Fraunces", mono: "Geist Mono" },
    radius: 0.625,
    spacing: 0.25,
    shadows: { light: { ...shadows }, dark: { ...shadows } },
  })
}

function write(path: string, content: string) {
  mkdirSync(dirname(path), { recursive: true })
  const old = existsSync(path) ? readFileSync(path, "utf8") : null
  if (old !== content) {
    writeFileSync(path, content)
    console.log(`wrote ${path}`)
  }
}

function build(tokens: DesignTokens) {
  for (const adapter of ADAPTERS) {
    for (const out of adapter.outputs) write(out.path, out.generate(tokens))
  }
  write(GLOBALS, patchGlobalsCss(readFileSync(GLOBALS, "utf8"), tokens))
  write(BRAND, brandSource(tokens))

  const classes: Record<string, ComponentClasses> = {}
  for (const file of readdirSync(UI_DIR).filter((f) => f.endsWith(".tsx")).sort()) {
    const path = join(UI_DIR, file)
    const src = readFileSync(path, "utf8")
    const patched = patchComponentSource(src)
    write(path, patched)
    classes[file.replace(/\.tsx$/, "")] = parseComponentClasses(patched)
  }
  write(CLASSES, JSON.stringify(classes, null, 1) + "\n")
}

const cmd = process.argv[2]
const current: DesignTokens = existsSync(TOKENS) ? JSON.parse(readFileSync(TOKENS, "utf8")) : emptyTokens()

if (cmd === "import") {
  const tokens = importShadcnCss(readFileSync(GLOBALS, "utf8"), current)
  write(TOKENS, JSON.stringify(tokens, null, 2) + "\n")
  build(tokens)
} else if (cmd === "build") {
  build(current)
} else {
  console.error("Usage: design-system.ts import | build")
  process.exit(1)
}
