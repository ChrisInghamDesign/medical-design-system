import type { Metadata } from "next"

import { Canvas } from "@/components/editor/canvas/canvas"

export const metadata: Metadata = { title: "Design system canvas" }

export default function CanvasPage() {
  return <Canvas />
}
