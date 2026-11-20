import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { HugeiconsIcon, Tick02Icon } from "@/lib/ds/icons"

import type { Block } from "./types"

const plans = [
  {
    name: "Essential",
    price: "$0",
    period: "/month",
    description: "Book and manage visits with your clinic.",
    features: ["Online booking", "Appointment reminders", "Visit summaries"],
    cta: "Get started",
    featured: false,
  },
  {
    name: "Plus",
    price: "$12",
    period: "/month",
    description: "Faster access and virtual care for you.",
    features: ["Everything in Essential", "Same-day virtual visits", "Secure messaging", "Prescription renewals"],
    cta: "Choose Plus",
    featured: true,
  },
  {
    name: "Family",
    price: "$29",
    period: "/month",
    description: "Cover up to five family members.",
    features: ["Everything in Plus", "Up to 5 profiles", "Shared calendar", "Child health records"],
    cta: "Choose Family",
    featured: false,
  },
]

export function PricingPlansBlock() {
  return (
    <section className="bg-background px-6 py-12 md:py-16">
      <div className="mx-auto flex max-w-6xl flex-col gap-10">
        <div className="mx-auto flex max-w-2xl flex-col gap-3 text-center">
          <h2 className="font-heading text-3xl font-semibold tracking-tight text-balance md:text-4xl">
            Plans for every household
          </h2>
          <p className="text-balance text-muted-foreground">Change or cancel at any time. No sign-up fees.</p>
        </div>
        <div className="grid items-stretch gap-4 lg:grid-cols-3">
          {plans.map((plan) => (
            <Card key={plan.name} className="h-full">
              <CardHeader>
                <div className="flex items-center justify-between gap-2">
                  <CardTitle>{plan.name}</CardTitle>
                  {plan.featured ? <Badge>Most popular</Badge> : null}
                </div>
                <CardDescription>{plan.description}</CardDescription>
              </CardHeader>
              <CardContent className="flex-1 gap-6">
                <p className="flex items-baseline gap-1">
                  <span className="font-heading text-4xl font-semibold tracking-tight">{plan.price}</span>
                  <span className="text-muted-foreground">{plan.period}</span>
                </p>
                <ul className="flex flex-col gap-2">
                  {plan.features.map((feature) => (
                    <li key={feature} className="flex items-center gap-2">
                      <HugeiconsIcon icon={Tick02Icon} className="size-4 shrink-0 text-primary" />
                      {feature}
                    </li>
                  ))}
                </ul>
              </CardContent>
              <CardFooter>
                <Button className="w-full" variant={plan.featured ? "default" : "outline"}>
                  {plan.cta}
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      </div>
    </section>
  )
}

export const block: Block = {
  id: "pricing-plans",
  name: "Pricing plans",
  category: "Landing page",
  description: "Three membership plans with a highlighted recommended option.",
  render: () => <PricingPlansBlock />,
}
