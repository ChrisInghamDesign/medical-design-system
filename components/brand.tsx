/* eslint-disable @next/next/no-img-element -- static SVGs */
// Generated from design-system/tokens.json (brand) by scripts/design-system.ts. Edit on the editor's Brand page.
import { cn } from "@/lib/utils"

const BASE = process.env.NEXT_PUBLIC_BASE_PATH ?? ""

export function Logo({ className, alt = "Medical" }: { className?: string; alt?: string }) {
  return (
    <img src={`${BASE}/logo.svg`} alt={alt} style={{ height: 24 }} className={cn("w-auto", "", className)} />
  )
}

export function Mark({ className, alt = "Medical" }: { className?: string; alt?: string }) {
  return (
    <Logo className={className} alt={alt} />
  )
}
