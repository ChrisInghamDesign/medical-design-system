"use client"

import * as React from "react"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group"
import { Add01Icon, HugeiconsIcon, Image01Icon } from "@/lib/ds/icons"

import type { Block } from "./types"

const categories = ["All", "First aid", "Vitamins", "Skin care", "Devices"]

const products = [
  { name: "Digital thermometer", category: "Devices", price: "$18.00", rating: "4.8", reviews: 214, tag: "Bestseller" },
  { name: "Adhesive bandage pack", category: "First aid", price: "$6.50", rating: "4.7", reviews: 98, tag: null },
  { name: "Daily multivitamin, 90 tablets", category: "Vitamins", price: "$14.00", rating: "4.6", reviews: 156, tag: null },
  { name: "Fragrance-free moisturiser", category: "Skin care", price: "$11.25", rating: "4.9", reviews: 302, tag: "New" },
  { name: "Upper-arm blood pressure monitor", category: "Devices", price: "$54.00", rating: "4.7", reviews: 88, tag: null },
  { name: "Travel first aid kit", category: "First aid", price: "$24.00", rating: "4.8", reviews: 131, tag: null },
  { name: "Vitamin D3, 120 softgels", category: "Vitamins", price: "$9.75", rating: "4.5", reviews: 64, tag: null },
  { name: "Mineral sunscreen SPF 50", category: "Skin care", price: "$16.00", rating: "4.6", reviews: 120, tag: "Bestseller" },
]

export function ProductGridBlock() {
  const [category, setCategory] = React.useState("All")
  const visible = category === "All" ? products : products.filter((p) => p.category === category)

  return (
    <section className="bg-background px-6 py-12 md:py-16">
      <div className="mx-auto flex max-w-6xl flex-col gap-8">
        <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <div className="flex flex-col gap-1">
            <h2 className="font-heading text-2xl font-semibold tracking-tight md:text-3xl">Clinic pharmacy</h2>
            <p className="text-sm text-muted-foreground">Everyday health essentials, picked by our care team.</p>
          </div>
          <ToggleGroup
            variant="outline"
            size="sm"
            value={[category]}
            onValueChange={(next) => {
              if (next[0]) setCategory(String(next[0]))
            }}
            className="flex-wrap"
          >
            {categories.map((item) => (
              <ToggleGroupItem key={item} value={item}>
                {item}
              </ToggleGroupItem>
            ))}
          </ToggleGroup>
        </div>
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {visible.map((product) => (
            <article key={product.name} className="flex flex-col gap-3">
              <div className="relative flex aspect-square items-center justify-center rounded-xl bg-muted text-muted-foreground">
                <HugeiconsIcon icon={Image01Icon} className="size-8" />
                {product.tag ? (
                  <div className="absolute top-3 left-3">
                    <Badge variant="secondary">{product.tag}</Badge>
                  </div>
                ) : null}
              </div>
              <div className="flex flex-1 flex-col gap-1">
                <p className="text-xs text-muted-foreground">{product.category}</p>
                <h3 className="font-medium">{product.name}</h3>
                <p className="flex items-center gap-1 text-sm text-muted-foreground">
                  <span className="text-primary" aria-hidden="true">
                    ★
                  </span>
                  <span className="font-medium text-foreground">{product.rating}</span>
                  <span>({product.reviews})</span>
                </p>
              </div>
              <div className="flex items-center justify-between gap-2">
                <span className="font-heading text-lg font-semibold tabular-nums">{product.price}</span>
                <Button size="sm" variant="outline">
                  <HugeiconsIcon icon={Add01Icon} data-icon="inline-start" />
                  Add to cart
                </Button>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  )
}

export const block: Block = {
  id: "product-grid",
  name: "Product grid",
  category: "E-commerce",
  description: "Category filter chips above a responsive grid of product cards with price, rating and add to cart.",
  render: () => <ProductGridBlock />,
}
