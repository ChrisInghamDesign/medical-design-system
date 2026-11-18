import type { DesignTokens, Mode } from "./types"

/** Messages between the editor and the canvas iframe */
export type EditorToCanvas =
  | { type: "ds:tokens"; tokens: DesignTokens; mode: Mode }
  | { type: "ds:view"; view: string }

export type CanvasToEditor = { type: "ds:ready" } | { type: "ds:navigate"; view: string }

export const BASE_PATH = process.env.NEXT_PUBLIC_BASE_PATH ?? ""
