import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { ArrowRightIcon, Calendar03Icon, HugeiconsIcon } from "@/lib/ds/icons"

import type { Block } from "./types"

export function HeroCenteredBlock() {
  return (
    <section className="bg-background px-6 py-16 md:py-24">
      <div className="mx-auto flex max-w-3xl flex-col items-center gap-6 text-center">
        <Badge variant="secondary">Now accepting new patients</Badge>
        <h1 className="font-heading text-4xl font-semibold tracking-tight text-balance md:text-5xl lg:text-6xl">
          Care that fits around your life
        </h1>
        <p className="max-w-xl text-lg text-balance text-muted-foreground">
          Book visits, message your care team and see your results in one place. Same-week appointments with
          family doctors and specialists.
        </p>
        <div className="flex w-full flex-col gap-3 sm:w-auto sm:flex-row">
          <Button size="lg" className="w-full sm:w-auto">
            <HugeiconsIcon icon={Calendar03Icon} data-icon="inline-start" />
            Book an appointment
          </Button>
          <Button size="lg" variant="outline" className="w-full sm:w-auto">
            Find a clinic
            <HugeiconsIcon icon={ArrowRightIcon} data-icon="inline-end" />
          </Button>
        </div>
        <p className="text-sm text-muted-foreground">Most major insurance plans accepted</p>
      </div>
    </section>
  )
}

export const block: Block = {
  id: "hero-centered",
  name: "Hero, centered",
  category: "Landing page",
  description: "Centered headline with a badge, supporting copy and two calls to action.",
  render: () => <HeroCenteredBlock />,
}
