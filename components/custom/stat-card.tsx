import * as React from "react"

import type { Demo } from "@/components/editor/canvas/shadcn/types"
import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"

/**
 * A single metric with its label and change since the last period.
 *
 * Custom component: built from components/ui and theme tokens, with a data-slot on
 * each part so it can be selected and restyled in the editor.
 */
export function StatCard({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="stat-card"
      className={cn("bg-card text-card-foreground flex flex-col gap-1 rounded-xl border p-5 shadow-sm", className)}
      {...props}
    />
  )
}

export function StatCardLabel({ className, ...props }: React.ComponentProps<"p">) {
  return <p data-slot="stat-card-label" className={cn("text-muted-foreground text-sm", className)} {...props} />
}

export function StatCardValue({ className, ...props }: React.ComponentProps<"p">) {
  return <p data-slot="stat-card-value" className={cn("font-heading text-3xl font-semibold tracking-tight", className)} {...props} />
}

export function StatCardChange({
  trend = "up",
  children,
}: {
  trend?: "up" | "down" | "flat"
  children: React.ReactNode
}) {
  return (
    <div data-slot="stat-card-change" className="flex items-center gap-2 text-sm">
      <Badge variant={trend === "down" ? "destructive" : trend === "up" ? "default" : "secondary"}>{children}</Badge>
      <span className="text-muted-foreground">vs last week</span>
    </div>
  )
}

export const demo: Demo = {
  id: "stat-card",
  name: "Stat card",
  description: "A single metric with its label and change since the last period",
  examples: [
    {
      name: "Default",
      render: () => (
        <StatCard className="w-full max-w-xs">
          <StatCardLabel>Appointments today</StatCardLabel>
          <StatCardValue>48</StatCardValue>
          <StatCardChange>+12%</StatCardChange>
        </StatCard>
      ),
    },
    {
      name: "Trends",
      render: () => (
        <div className="grid w-full gap-4 sm:grid-cols-3">
          <StatCard>
            <StatCardLabel>New patients</StatCardLabel>
            <StatCardValue>126</StatCardValue>
            <StatCardChange>+8%</StatCardChange>
          </StatCard>
          <StatCard>
            <StatCardLabel>No-shows</StatCardLabel>
            <StatCardValue>5</StatCardValue>
            <StatCardChange trend="down">-2%</StatCardChange>
          </StatCard>
          <StatCard>
            <StatCardLabel>Average wait</StatCardLabel>
            <StatCardValue>14 min</StatCardValue>
            <StatCardChange trend="flat">0%</StatCardChange>
          </StatCard>
        </div>
      ),
    },
  ],
}
