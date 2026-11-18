import { shadcnAdapter } from "./shadcn"
import type { LibraryAdapter } from "./types"

/** Every library this design system is exported to. Add new adapters here. */
export const ADAPTERS: LibraryAdapter[] = [shadcnAdapter]

/** The library the editor canvas previews */
export const ACTIVE_ADAPTER = shadcnAdapter

export type { LibraryAdapter }
