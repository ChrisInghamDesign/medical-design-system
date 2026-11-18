import type { Metadata } from "next"

import { Editor } from "@/components/editor/editor"

export const metadata: Metadata = { title: "Design system editor" }

export default function EditorPage() {
  return <Editor />
}
