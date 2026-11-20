"use client"

import * as React from "react"

import { Button } from "@/components/ui/button"
import { InputGroup, InputGroupAddon, InputGroupButton, InputGroupTextarea } from "@/components/ui/input-group"
import { NativeSelect, NativeSelectOption } from "@/components/ui/native-select"
import { ArrowRightIcon, FileAttachmentIcon, HugeiconsIcon } from "@/lib/ds/icons"

import type { Block } from "./types"

const helpers = [
  "Summarise my last visit",
  "Explain my lab results",
  "Prepare questions for my doctor",
  "Check a medication interaction",
]

export function PromptInputBlock() {
  const [prompt, setPrompt] = React.useState("")

  return (
    <section className="bg-background px-6 py-12 md:py-16">
      <div className="mx-auto flex max-w-2xl flex-col gap-6">
        <div className="flex flex-col gap-2 text-center">
          <h2 className="font-heading text-2xl font-semibold tracking-tight text-balance md:text-3xl">
            How can I help with your care today?
          </h2>
          <p className="text-sm text-balance text-muted-foreground">
            Ask about visits, results or medications. Your care team can see what you share.
          </p>
        </div>
        <form className="flex flex-col gap-4" onSubmit={(event) => event.preventDefault()}>
          <InputGroup>
            <label htmlFor="prompt-input" className="sr-only">
              Message the care assistant
            </label>
            <InputGroupTextarea
              id="prompt-input"
              value={prompt}
              onChange={(event) => setPrompt(event.target.value)}
              placeholder="Describe your question in your own words…"
              className="min-h-28"
            />
            <InputGroupAddon align="block-end" className="justify-between gap-2">
              <div className="flex min-w-0 items-center gap-1">
                <InputGroupButton size="icon-sm" aria-label="Attach a file">
                  <HugeiconsIcon icon={FileAttachmentIcon} />
                </InputGroupButton>
                <NativeSelect size="sm" defaultValue="standard" aria-label="Model">
                  <NativeSelectOption value="standard">Standard</NativeSelectOption>
                  <NativeSelectOption value="detailed">Detailed</NativeSelectOption>
                  <NativeSelectOption value="quick">Quick</NativeSelectOption>
                </NativeSelect>
              </div>
              <InputGroupButton type="submit" variant="default" size="icon-sm" aria-label="Send" disabled={!prompt.trim()}>
                <HugeiconsIcon icon={ArrowRightIcon} />
              </InputGroupButton>
            </InputGroupAddon>
          </InputGroup>
          <div className="flex flex-wrap justify-center gap-2">
            {helpers.map((helper) => (
              <Button key={helper} type="button" variant="outline" size="sm" onClick={() => setPrompt(helper)}>
                {helper}
              </Button>
            ))}
          </div>
          <p className="text-center text-xs text-muted-foreground">
            The assistant can make mistakes. In an emergency, call your local emergency number.
          </p>
        </form>
      </div>
    </section>
  )
}

export const block: Block = {
  id: "prompt-input",
  name: "Prompt input",
  category: "AI",
  description: "Large message composer with attach and send buttons, a model select and helper prompts.",
  render: () => <PromptInputBlock />,
}
