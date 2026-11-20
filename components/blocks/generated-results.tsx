import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardAction, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group"
import { Copy01Icon, HugeiconsIcon } from "@/lib/ds/icons"

import type { Block } from "./types"

const sections = [
  {
    title: "Reason for visit",
    items: ["Follow-up on blood pressure after starting a new medication four weeks ago."],
  },
  {
    title: "What we found",
    items: [
      "Blood pressure is 128/82, down from 142/90 at the last visit.",
      "No side effects reported apart from mild tiredness in the first week.",
    ],
  },
  {
    title: "Plan",
    items: [
      "Continue the current dose once a day in the morning.",
      "Keep a home blood pressure log three times a week.",
      "Reduce salt and aim for 30 minutes of walking most days.",
    ],
  },
  {
    title: "Next steps",
    items: ["Book a follow-up in three months, or sooner if readings stay above 140/90."],
  },
]

export function GeneratedResultsBlock() {
  return (
    <section className="bg-background px-6 py-12 md:py-16">
      <div className="mx-auto max-w-3xl">
        <Card>
          <CardHeader>
            <CardTitle className="text-xl">Visit summary</CardTitle>
            <CardDescription>Dr. A. Patel · Family medicine · 14 Nov</CardDescription>
            <CardAction>
              <Badge variant="secondary">AI generated</Badge>
            </CardAction>
          </CardHeader>
          <CardContent className="gap-6">
            {sections.map((section) => (
              <div key={section.title} className="flex flex-col gap-2">
                <h3 className="font-heading font-medium">{section.title}</h3>
                <ul className="flex list-disc flex-col gap-1 pl-5 text-muted-foreground">
                  {section.items.map((item) => (
                    <li key={item}>{item}</li>
                  ))}
                </ul>
              </div>
            ))}
            <p className="rounded-lg bg-muted p-3 text-xs text-muted-foreground">
              Generated from your visit notes and reviewed by your clinician. Contact your care team if anything looks
              wrong.
            </p>
          </CardContent>
          <Separator />
          <CardFooter className="flex-col items-stretch gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex flex-wrap gap-2">
              <Button variant="outline" size="sm">
                <HugeiconsIcon icon={Copy01Icon} data-icon="inline-start" />
                Copy
              </Button>
              <Button variant="outline" size="sm">
                Regenerate
              </Button>
            </div>
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-sm text-muted-foreground">Was this helpful?</span>
              <ToggleGroup variant="outline" size="sm">
                <ToggleGroupItem value="yes">Yes</ToggleGroupItem>
                <ToggleGroupItem value="no">No</ToggleGroupItem>
              </ToggleGroup>
            </div>
          </CardFooter>
        </Card>
      </div>
    </section>
  )
}

export const block: Block = {
  id: "generated-results",
  name: "Generated results",
  category: "AI",
  description: "AI-generated visit summary in sections with copy, regenerate and feedback actions.",
  render: () => <GeneratedResultsBlock />,
}
