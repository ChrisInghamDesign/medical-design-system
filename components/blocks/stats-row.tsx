import { Badge } from "@/components/ui/badge"
import { Card, CardAction, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { ArrowDown02Icon, ArrowUp01Icon, HugeiconsIcon } from "@/lib/ds/icons"

import type { Block } from "./types"

const stats = [
  { label: "Patients this week", value: "1,284", change: "+8.2%", up: true, note: "Compared with last week" },
  { label: "Appointments today", value: "96", change: "+4", up: true, note: "12 still to check in" },
  { label: "Average wait time", value: "14 min", change: "-3 min", up: false, note: "Across all clinics" },
  { label: "Missed visits", value: "2.1%", change: "-0.4%", up: false, note: "Last 30 days" },
]

export function StatsRowBlock() {
  return (
    <section className="bg-background px-6 py-12 md:py-16">
      <div className="mx-auto flex max-w-6xl flex-col gap-6">
        <div className="flex flex-col gap-1">
          <h2 className="font-heading text-2xl font-semibold tracking-tight">Clinic overview</h2>
          <p className="text-sm text-muted-foreground">Key numbers for the current week.</p>
        </div>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {stats.map((stat) => (
            <Card key={stat.label} className="h-full">
              <CardHeader>
                <CardDescription>{stat.label}</CardDescription>
                <CardTitle className="text-3xl font-semibold tracking-tight tabular-nums">{stat.value}</CardTitle>
                <CardAction>
                  <Badge variant="outline">
                    <HugeiconsIcon icon={stat.up ? ArrowUp01Icon : ArrowDown02Icon} data-icon="inline-start" />
                    {stat.change}
                  </Badge>
                </CardAction>
              </CardHeader>
              <CardFooter>
                <p className="text-muted-foreground text-sm">{stat.note}</p>
              </CardFooter>
            </Card>
          ))}
        </div>
      </div>
    </section>
  )
}

export const block: Block = {
  id: "stats-row",
  name: "Stats row",
  category: "Application",
  description: "Four KPI cards with values, trend badges and notes.",
  render: () => <StatsRowBlock />,
}
