"use client"

import * as React from "react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { Add01Icon, Delete02Icon, HugeiconsIcon, Image01Icon, MinusSignIcon } from "@/lib/ds/icons"

import type { Block } from "./types"

const initialItems = [
  { id: "thermometer", name: "Digital thermometer", variant: "Standard", price: 18, quantity: 1 },
  { id: "vitamin-d", name: "Vitamin D3 daily tablets", variant: "60 tablets", price: 15, quantity: 2 },
  { id: "bandages", name: "Adhesive bandage pack", variant: "Assorted sizes", price: 6.5, quantity: 1 },
]

const money = (n: number) => `$${n.toFixed(2)}`

export function CartBlock() {
  const [items, setItems] = React.useState(initialItems)

  const setQuantity = (id: string, quantity: number) =>
    setItems((list) => list.map((item) => (item.id === id ? { ...item, quantity: Math.max(1, quantity) } : item)))
  const remove = (id: string) => setItems((list) => list.filter((item) => item.id !== id))

  const subtotal = items.reduce((sum, item) => sum + item.price * item.quantity, 0)
  const shipping = subtotal === 0 || subtotal >= 40 ? 0 : 5
  const total = subtotal + shipping

  return (
    <section className="bg-background px-6 py-12 md:py-16">
      <div className="mx-auto flex max-w-6xl flex-col gap-8">
        <div className="flex flex-col gap-1">
          <h2 className="font-heading text-2xl font-semibold tracking-tight md:text-3xl">Your cart</h2>
          <p className="text-sm text-muted-foreground">
            {items.length} {items.length === 1 ? "item" : "items"} ready for checkout.
          </p>
        </div>
        <div className="grid items-start gap-8 lg:grid-cols-3">
          <ul className="flex flex-col lg:col-span-2">
            {items.length === 0 ? (
              <li className="rounded-xl border border-dashed border-border p-8 text-center text-sm text-muted-foreground">
                Your cart is empty.
              </li>
            ) : null}
            {items.map((item) => (
              <li key={item.id} className="flex gap-4 border-b border-border py-5 first:pt-0">
                <div className="flex size-20 shrink-0 items-center justify-center rounded-lg bg-muted text-muted-foreground">
                  <HugeiconsIcon icon={Image01Icon} className="size-6" />
                </div>
                <div className="flex min-w-0 flex-1 flex-col gap-3">
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex min-w-0 flex-col gap-0.5">
                      <h3 className="font-medium">{item.name}</h3>
                      <p className="text-sm text-muted-foreground">{item.variant}</p>
                    </div>
                    <span className="font-medium tabular-nums">{money(item.price * item.quantity)}</span>
                  </div>
                  <div className="flex items-center justify-between gap-3">
                    <div className="flex items-center gap-1 rounded-md border border-border p-0.5">
                      <Button
                        variant="ghost"
                        size="icon-xs"
                        aria-label={"Decrease quantity of " + item.name}
                        disabled={item.quantity <= 1}
                        onClick={() => setQuantity(item.id, item.quantity - 1)}
                      >
                        <HugeiconsIcon icon={MinusSignIcon} />
                      </Button>
                      <span className="w-6 text-center text-sm tabular-nums">{item.quantity}</span>
                      <Button
                        variant="ghost"
                        size="icon-xs"
                        aria-label={"Increase quantity of " + item.name}
                        onClick={() => setQuantity(item.id, item.quantity + 1)}
                      >
                        <HugeiconsIcon icon={Add01Icon} />
                      </Button>
                    </div>
                    <Button variant="ghost" size="sm" onClick={() => remove(item.id)}>
                      <HugeiconsIcon icon={Delete02Icon} data-icon="inline-start" />
                      Remove
                    </Button>
                  </div>
                </div>
              </li>
            ))}
          </ul>
          <Card>
            <CardHeader>
              <CardTitle>Order summary</CardTitle>
            </CardHeader>
            <CardContent>
              <dl className="flex flex-col gap-2 text-sm">
                <div className="flex justify-between gap-4">
                  <dt className="text-muted-foreground">Subtotal</dt>
                  <dd className="tabular-nums">{money(subtotal)}</dd>
                </div>
                <div className="flex justify-between gap-4">
                  <dt className="text-muted-foreground">Shipping</dt>
                  <dd className="tabular-nums">{shipping === 0 ? "Free" : money(shipping)}</dd>
                </div>
                <Separator className="my-2" />
                <div className="flex justify-between gap-4 text-base font-semibold">
                  <dt>Total</dt>
                  <dd className="tabular-nums">{money(total)}</dd>
                </div>
              </dl>
              <p className="text-xs text-muted-foreground">Taxes are calculated at checkout. Free shipping over $40.</p>
            </CardContent>
            <CardFooter className="flex-col gap-2">
              <Button className="w-full" disabled={items.length === 0}>
                Go to checkout
              </Button>
              <Button variant="ghost" className="w-full">
                Continue shopping
              </Button>
            </CardFooter>
          </Card>
        </div>
      </div>
    </section>
  )
}

export const block: Block = {
  id: "cart",
  name: "Cart",
  category: "E-commerce",
  description: "Cart line items with quantity steppers and remove, beside an order summary.",
  render: () => <CartBlock />,
}
