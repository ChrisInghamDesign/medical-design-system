import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { Button } from "@/components/ui/button"

import type { Block } from "./types"

const faqs = [
  {
    question: "How do I book my first appointment?",
    answer: "Create an account, choose a clinic and pick an available time. You'll get a confirmation and a reminder the day before.",
  },
  {
    question: "Can I see a doctor virtually?",
    answer: "Yes. Many visits can happen by video. When booking, choose a virtual visit and we'll send you a secure link.",
  },
  {
    question: "How do I cancel or reschedule?",
    answer: "Open the appointment in the app and choose Reschedule or Cancel. Please let us know at least 24 hours ahead.",
  },
  {
    question: "Where can I find my test results?",
    answer: "Results appear in the Records section once your clinician has reviewed them. You'll get a notification when they're ready.",
  },
  {
    question: "Is my health information private?",
    answer: "Your information is encrypted and only shared with the care team you choose. You can review access in Settings.",
  },
]

export function FaqAccordionBlock() {
  return (
    <section className="bg-muted/40 px-6 py-12 md:py-16">
      <div className="mx-auto grid max-w-6xl gap-10 lg:grid-cols-3">
        <div className="flex flex-col gap-3">
          <h2 className="font-heading text-3xl font-semibold tracking-tight text-balance md:text-4xl">
            Frequently asked questions
          </h2>
          <p className="text-muted-foreground">Can&apos;t find what you&apos;re looking for? Our patient support team can help.</p>
          <div>
            <Button variant="outline">Contact support</Button>
          </div>
        </div>
        <Accordion defaultValue={[faqs[0].question]} className="lg:col-span-2">
          {faqs.map((faq) => (
            <AccordionItem key={faq.question} value={faq.question}>
              <AccordionTrigger>{faq.question}</AccordionTrigger>
              <AccordionContent>{faq.answer}</AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>
    </section>
  )
}

export const block: Block = {
  id: "faq-accordion",
  name: "FAQ",
  category: "Marketing",
  description: "Frequently asked questions in an accordion beside a short intro.",
  render: () => <FaqAccordionBlock />,
}
