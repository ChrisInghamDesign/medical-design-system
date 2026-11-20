import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardAction, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress, ProgressLabel } from "@/components/ui/progress"
import { Separator } from "@/components/ui/separator"
import { HugeiconsIcon, InformationCircleIcon } from "@/lib/ds/icons"

import type { Block } from "./types"

const meters = [
  { label: "Assistant messages", used: 412, limit: 500, unit: "" },
  { label: "Visit summaries", used: 18, limit: 25, unit: "" },
  { label: "Document uploads", used: 1.2, limit: 5, unit: " GB" },
]

const pct = (used: number, limit: number) => Math.round((used / limit) * 100)

export function UsageMeterBlock() {
  return (
    <section className="bg-background px-6 py-12 md:py-16">
      <div className="mx-auto max-w-2xl">
        <Card>
          <CardHeader>
            <CardTitle className="text-xl">Plan usage</CardTitle>
            <CardDescription>Care assistant · Plus plan</CardDescription>
            <CardAction>
              <Badge variant="outline">Resets 1 Dec</Badge>
            </CardAction>
          </CardHeader>
          <CardContent className="gap-6">
            {meters.map((meter) => (
              <Progress key={meter.label} value={pct(meter.used, meter.limit)}>
                <ProgressLabel>{meter.label}</ProgressLabel>
                <span className="ml-auto text-sm text-muted-foreground tabular-nums">
                  {meter.used}
                  {meter.unit} of {meter.limit}
                  {meter.unit}
                </span>
              </Progress>
            ))}
            <div className="flex items-start gap-2 rounded-lg bg-muted p-3 text-sm text-muted-foreground">
              <HugeiconsIcon icon={InformationCircleIcon} className="mt-0.5 size-4 shrink-0" />
              <p>You&apos;ve used 82% of your messages. When you reach the limit, replies slow down until your plan resets.</p>
            </div>
          </CardContent>
          <Separator />
          <CardFooter className="flex-col items-stretch gap-3 sm:flex-row sm:items-center sm:justify-between">
            <p className="text-sm text-muted-foreground">Need more? Family includes 2,000 messages a month.</p>
            <Button className="w-full sm:w-auto">Upgrade plan</Button>
          </CardFooter>
        </Card>
      </div>
    </section>
  )
}

export const block: Block = {
  id: "usage-meter",
  name: "Usage meter",
  category: "AI",
  description: "Plan usage with progress bars, limits, reset date and an upgrade call to action.",
  render: () => <UsageMeterBlock />,
}
