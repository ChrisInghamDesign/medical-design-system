import { Button } from "@/components/ui/button"
import { Empty, EmptyContent, EmptyDescription, EmptyHeader, EmptyMedia, EmptyTitle } from "@/components/ui/empty"
import { Calendar03Icon, HugeiconsIcon } from "@/lib/ds/icons"

import type { Block } from "./types"

export function EmptyStateBlock() {
  return (
    <section className="bg-muted/40 px-6 py-12 md:py-16">
      <div className="mx-auto max-w-3xl">
        <Empty>
          <EmptyHeader>
            <EmptyMedia variant="icon">
              <HugeiconsIcon icon={Calendar03Icon} />
            </EmptyMedia>
            <EmptyTitle>No upcoming appointments</EmptyTitle>
            <EmptyDescription>
              You don&apos;t have any visits booked. Schedule a check-up or a virtual visit with your care team.
            </EmptyDescription>
          </EmptyHeader>
          <EmptyContent>
            <div className="flex w-full flex-col gap-2 sm:w-auto sm:flex-row">
              <Button>Book an appointment</Button>
              <Button variant="outline">View past visits</Button>
            </div>
          </EmptyContent>
        </Empty>
      </div>
    </section>
  )
}

export const block: Block = {
  id: "empty-state",
  name: "Empty state",
  category: "Application",
  description: "Placeholder for an empty list with an icon, message and actions.",
  render: () => <EmptyStateBlock />,
}
