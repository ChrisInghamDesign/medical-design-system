import Link from "next/link"

import { MedicalOverview } from "@/components/showcase/medical-overview"

export default function Home() {
  return (
    <>
      <div className="bg-foreground text-background flex items-center justify-center gap-3 px-4 py-2 text-sm">
        <span>Medical design system</span>
        <Link href="/editor/" className="font-medium underline underline-offset-4">
          Open the editor
        </Link>
      </div>
      <MedicalOverview />
    </>
  )
}
