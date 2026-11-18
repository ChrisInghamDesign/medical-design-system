import type { DesignTokens, Mode, OverrideState } from "./types"

export type CanvasDisplay = "demo" | "matrix" | "preview"

/** Filters on the All components page (set in the editor's toolbar) */
export interface ComponentsFilter {
  tab: "all" | "edited" | "variants" | "custom"
  q: string
}

/** Messages from the editor to the canvas iframe */
export type EditorToCanvas =
  /** Asks the canvas to (re)announce itself, in case its first ds:ready came before the editor was listening */
  | { type: "ds:ping" }
  | { type: "ds:tokens"; tokens: DesignTokens; mode: Mode; assets: Record<string, string> }
  | { type: "ds:view"; view: string; display: CanvasDisplay; state: OverrideState | null; interact: boolean; filter?: ComponentsFilter }
  | { type: "ds:select"; slot: string | null; variant?: string; size?: string; auto?: boolean }

export interface CanvasLayer {
  slot: string
  depth: number
  count: number
  variants: string[]
  sizes: string[]
}

/** Messages from the canvas back to the editor */
export type CanvasToEditor =
  | { type: "ds:ready" }
  | { type: "ds:navigate"; view: string }
  | { type: "ds:layers"; layers: CanvasLayer[] }
  | { type: "ds:selected"; slot: string; variant?: string; size?: string }

export const BASE_PATH = process.env.NEXT_PUBLIC_BASE_PATH ?? ""
