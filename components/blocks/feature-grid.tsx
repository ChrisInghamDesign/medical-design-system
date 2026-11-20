import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import {
  Calendar03Icon,
  CheckmarkCircle02Icon,
  File01Icon,
  HugeiconsIcon,
  InformationCircleIcon,
  SearchIcon,
  Settings02Icon,
} from "@/lib/ds/icons"

import type { Block } from "./types"

const features = [
  { icon: Calendar03Icon, title: "Online booking", description: "Choose a time that suits you and get reminders before every visit." },
  { icon: File01Icon, title: "Records in one place", description: "Visit notes, prescriptions and lab results, available whenever you need them." },
  { icon: SearchIcon, title: "Find the right specialist", description: "Search by condition, language or location to find the clinician for you." },
  { icon: CheckmarkCircle02Icon, title: "Prescription renewals", description: "Request a refill in a few taps and pick it up at your preferred pharmacy." },
  { icon: InformationCircleIcon, title: "Clear guidance", description: "Plain-language care plans and follow-up instructions after each appointment." },
  { icon: Settings02Icon, title: "Privacy controls", description: "Decide who can see your information and update your preferences any time." },
] as const

export function FeatureGridBlock() {
  return (
    <section className="bg-muted/40 px-6 py-12 md:py-16">
      <div className="mx-auto flex max-w-6xl flex-col gap-10">
        <div className="mx-auto flex max-w-2xl flex-col gap-3 text-center">
          <p className="text-sm font-medium text-primary">Everything in one app</p>
          <h2 className="font-heading text-3xl font-semibold tracking-tight text-balance md:text-4xl">
            Simple tools for everyday care
          </h2>
          <p className="text-balance text-muted-foreground">
            From your first appointment to ongoing follow-ups, the patient app keeps your care organised.
          </p>
        </div>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {features.map((feature) => (
            <Card key={feature.title} className="h-full">
              <CardHeader className="gap-3">
                <div className="flex size-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
                  <HugeiconsIcon icon={feature.icon} className="size-5" />
                </div>
                <CardTitle>{feature.title}</CardTitle>
                <CardDescription>{feature.description}</CardDescription>
              </CardHeader>
            </Card>
          ))}
        </div>
      </div>
    </section>
  )
}

export const block: Block = {
  id: "feature-grid",
  name: "Feature grid",
  category: "Landing page",
  description: "Section heading with a responsive grid of six icon cards.",
  render: () => <FeatureGridBlock />,
}
