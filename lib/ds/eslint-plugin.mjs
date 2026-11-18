// @ts-check
/**
 * ESLint plugin wrapping the design system lint rules (lib/ds/lint-rules.mjs).
 * Rule levels come from design-system/tokens.json → lint.rules, set on the
 * editor's Lint page.
 */
import { readFileSync } from "node:fs"
import { checkSource } from "./lint-rules.mjs"

const RULE_IDS = ["restyling", "raw-colors", "made-up-sizes", "inline-styles", "typos", "dynamic-classes"]

function colorTokens() {
  try {
    const t = JSON.parse(readFileSync(new URL("../../design-system/tokens.json", import.meta.url), "utf8"))
    return [...Object.keys(t.colors.light), ...(t.customColors ?? []).map((c) => c.name)]
  } catch {
    return []
  }
}

const TOKENS = colorTokens()

/** @type {import("eslint").ESLint.Plugin} */
const plugin = {
  meta: { name: "design-system" },
  rules: Object.fromEntries(
    RULE_IDS.map((id) => [
      id,
      {
        meta: { type: "suggestion", docs: { description: `Design system: ${id}` }, schema: [] },
        create(context) {
          return {
            Program() {
              const text = context.sourceCode.text
              for (const f of checkSource(text, { rules: { [id]: "error" }, colorTokens: TOKENS, filePath: context.filename })) {
                context.report({ loc: { line: f.line, column: Math.max(0, f.column - 1) }, message: f.message })
              }
            },
          }
        },
      },
    ])
  ),
}

/** Flat-config entries using the levels saved in tokens.json */
export function designSystemLintConfig() {
  let levels = {}
  try {
    levels = JSON.parse(readFileSync(new URL("../../design-system/tokens.json", import.meta.url), "utf8")).lint?.rules ?? {}
  } catch {}
  return {
    files: ["app/**/*.{ts,tsx}", "components/**/*.{ts,tsx}"],
    ignores: ["components/ui/**", "components/editor/**", "components/brand.tsx"],
    plugins: { "design-system": plugin },
    rules: Object.fromEntries(RULE_IDS.map((id) => [`design-system/${id}`, levels[id] ?? "off"])),
  }
}

export default plugin
