/**
 * Design system CLI.
 *
 *   npx tsx scripts/design-system.ts import   Read app/globals.css (e.g. after a DS Manager
 *                                             sync) into design-system/tokens.json, then build
 *   npx tsx scripts/design-system.ts build    Regenerate every library output from tokens.json
 */
import { existsSync, readFileSync, writeFileSync, mkdirSync } from "node:fs"
import { dirname } from "node:path"
import { ADAPTERS } from "../lib/ds/adapters"
import { importShadcnCss, patchGlobalsCss } from "../lib/ds/adapters/shadcn"
import { COLOR_TOKENS, SHADOW_LEVELS, type DesignTokens } from "../lib/ds/types"

const TOKENS = "design-system/tokens.json"
const GLOBALS = "app/globals.css"

function emptyTokens(): DesignTokens {
  const colors = Object.fromEntries(COLOR_TOKENS.map((t) => [t, "oklch(0.5 0 0)"])) as DesignTokens["colors"]["light"]
  const shadows = Object.fromEntries(SHADOW_LEVELS.map((l) => [l, "0 1px 2px 0 oklch(0 0 0 / 10%)"])) as DesignTokens["shadows"]["light"]
  return {
    version: 1,
    name: "Medical",
    description: "Medical design system",
    colors: { light: { ...colors }, dark: { ...colors } },
    fonts: { sans: "Inter", heading: "Fraunces", mono: "Geist Mono" },
    radius: 0.625,
    spacing: 0.25,
    shadows: { light: { ...shadows }, dark: { ...shadows } },
    locks: [],
  }
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
  write(GLOBALS, patchGlobalsCss(readFileSync(GLOBALS, "utf8")))
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
