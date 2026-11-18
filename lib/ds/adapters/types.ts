import type { DesignTokens } from "../types"

/**
 * An adapter turns library-neutral tokens into one component library's theme.
 *
 * To add a library (e.g. MUI):
 *   1. Create lib/ds/adapters/<library>.ts exporting a LibraryAdapter whose
 *      outputs generate that library's theme file (e.g. design-system/mui-theme.ts).
 *   2. Register it in lib/ds/adapters/index.ts.
 *   3. Add a canvas for its components in components/editor/canvas/<library>/
 *      and register it in components/editor/canvas/registry.tsx.
 * The editor, token model and GitHub saving don't change.
 */
export interface LibraryAdapter {
  id: string
  name: string
  description: string
  /** Files written to the repo when the design system is saved */
  outputs: { path: string; generate: (tokens: DesignTokens) => string }[]
  /** CSS injected into the canvas while editing, for a live preview (optional) */
  previewCss?: (tokens: DesignTokens) => string
}
