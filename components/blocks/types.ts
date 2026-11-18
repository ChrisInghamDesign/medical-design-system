import type * as React from "react"

export const BLOCK_CATEGORIES = ["Marketing", "Application", "Forms"] as const
export type BlockCategory = (typeof BLOCK_CATEGORIES)[number]

/**
 * A ready-made page section built only from components/ui and theme tokens.
 * Each block lives in components/blocks/<id>.tsx (the file name is its id); the
 * editor shows its source from design-system/blocks-source.json, which
 * scripts/design-system.ts generates from those files.
 */
export interface Block {
  id: string
  name: string
  category: BlockCategory
  description: string
  render: () => React.ReactNode
}
