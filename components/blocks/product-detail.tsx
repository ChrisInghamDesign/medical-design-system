"use client"

import * as React from "react"

import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group"
import { Add01Icon, HugeiconsIcon, Image01Icon, MinusSignIcon } from "@/lib/ds/icons"

import type { Block } from "./types"

const sizes = [
  { value: "30", label: "30 tablets", price: 9 },
  { value: "60", label: "60 tablets", price: 15 },
  { value: "120", label: "120 tablets", price: 26 },
]

const details = [
  {
    title: "Description",
    body: "A gentle daily supplement to support bone and immune health. Small, easy-to-swallow tablets with no artificial colours.",
  },
  {
    title: "How to use",
    body: "Take one tablet a day with food, or as directed by your pharmacist. Do not exceed the recommended dose.",
  },
  {
    title: "Ingredients",
    body: "Vitamin D3, microcrystalline cellulose, calcium carbonate, plant-based coating.",
  },
  {
    title: "Shipping and returns",
    body: "Free shipping on orders over $40. Unopened items can be returned within 30 days.",
  },
]

export function ProductDetailBlock() {
  const [size, setSize] = React.useState("60")
  const [quantity, setQuantity] = React.useState(1)
  const selected = sizes.find((s) => s.value === size) ?? sizes[0]

  return (
    <section className="bg-background px-6 py-12 md:py-16">
      <div className="mx-auto grid max-w-6xl gap-10 lg:grid-cols-2">
        <div className="flex flex-col gap-3">
          <div className="flex aspect-square items-center justify-center rounded-xl bg-muted text-muted-foreground">
            <HugeiconsIcon icon={Image01Icon} className="size-10" />
          </div>
          <div className="grid grid-cols-4 gap-3">
            {[1, 2, 3, 4].map((n) => (
              <div
                key={n}
                className="flex aspect-square items-center justify-center rounded-lg bg-muted text-muted-foreground first:ring-2 first:ring-primary"
              >
                <HugeiconsIcon icon={Image01Icon} className="size-5" />
              </div>
            ))}
          </div>
        </div>
        <div className="flex min-w-0 flex-col gap-6">
          <div className="flex flex-col gap-2">
            <div>
              <Badge variant="secondary">Pharmacist recommended</Badge>
            </div>
            <h2 className="font-heading text-2xl font-semibold tracking-tight md:text-3xl">Vitamin D3 daily tablets</h2>
            <p className="flex items-center gap-1 text-sm text-muted-foreground">
              <span className="text-primary" aria-hidden="true">
                ★★★★★
              </span>
              <span className="font-medium text-foreground">4.8</span>
              <span>(212 reviews)</span>
            </p>
            <p className="font-heading text-3xl font-semibold tracking-tight tabular-nums">
              ${(selected.price * quantity).toFixed(2)}
            </p>
          </div>
          <div className="flex flex-col gap-3">
            <p className="text-sm font-medium">Size</p>
            <ToggleGroup
              variant="outline"
              value={[size]}
              onValueChange={(next) => {
                if (next[0]) setSize(String(next[0]))
              }}
              className="flex-wrap"
            >
              {sizes.map((s) => (
                <ToggleGroupItem key={s.value} value={s.value}>
                  {s.label}
                </ToggleGroupItem>
              ))}
            </ToggleGroup>
          </div>
          <div className="flex flex-col gap-3">
            <p className="text-sm font-medium">Quantity</p>
            <div className="flex w-fit items-center gap-1 rounded-md border border-border p-1">
              <Button
                variant="ghost"
                size="icon-sm"
                aria-label="Decrease quantity"
                disabled={quantity <= 1}
                onClick={() => setQuantity((q) => Math.max(1, q - 1))}
              >
                <HugeiconsIcon icon={MinusSignIcon} />
              </Button>
              <span className="w-8 text-center text-sm tabular-nums">{quantity}</span>
              <Button variant="ghost" size="icon-sm" aria-label="Increase quantity" onClick={() => setQuantity((q) => q + 1)}>
                <HugeiconsIcon icon={Add01Icon} />
              </Button>
            </div>
          </div>
          <div className="flex flex-col gap-2 sm:flex-row">
            <Button size="lg" className="w-full sm:flex-1">
              Add to cart
            </Button>
            <Button size="lg" variant="outline" className="w-full sm:flex-1">
              Buy now
            </Button>
          </div>
          <Accordion defaultValue={[details[0].title]}>
            {details.map((item) => (
              <AccordionItem key={item.title} value={item.title}>
                <AccordionTrigger>{item.title}</AccordionTrigger>
                <AccordionContent>{item.body}</AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </div>
    </section>
  )
}

export const block: Block = {
  id: "product-detail",
  name: "Product detail",
  category: "E-commerce",
  description: "Product page with image gallery, price, size and quantity choice, add to cart and a details accordion.",
  render: () => <ProductDetailBlock />,
}
