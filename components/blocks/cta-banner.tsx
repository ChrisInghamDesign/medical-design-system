import { Button } from "@/components/ui/button"
import { ArrowRightIcon, HugeiconsIcon } from "@/lib/ds/icons"

import type { Block } from "./types"

export function CtaBannerBlock() {
  return (
    <section className="bg-background px-6 py-12 md:py-16">
      <div className="mx-auto flex max-w-6xl flex-col items-start gap-6 rounded-xl bg-primary p-8 text-primary-foreground shadow-sm md:flex-row md:items-center md:justify-between md:p-12">
        <div className="flex max-w-xl flex-col gap-2">
          <h2 className="font-heading text-2xl font-semibold tracking-tight text-balance md:text-3xl">
            Ready to see a doctor this week?
          </h2>
          <p className="text-primary-foreground/80">
            Find an available time at a clinic near you, or start a virtual visit from home.
          </p>
        </div>
        <div className="flex w-full flex-col gap-3 sm:w-auto sm:flex-row">
          <Button size="lg" variant="secondary" className="w-full sm:w-auto">
            Book an appointment
            <HugeiconsIcon icon={ArrowRightIcon} data-icon="inline-end" />
          </Button>
        </div>
      </div>
    </section>
  )
}

export const block: Block = {
  id: "cta-banner",
  name: "Call-to-action banner",
  category: "Landing page",
  description: "Primary-coloured banner with a headline and a single call to action.",
  render: () => <CtaBannerBlock />,
}
