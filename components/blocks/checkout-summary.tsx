import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox"
import { Field, FieldGroup, FieldLabel, FieldSet, FieldLegend } from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import { NativeSelect, NativeSelectOption } from "@/components/ui/native-select"
import { Separator } from "@/components/ui/separator"
import { HugeiconsIcon, Image01Icon } from "@/lib/ds/icons"

import type { Block } from "./types"

const items = [
  { name: "Digital thermometer", detail: "Qty 1", price: "$18.00" },
  { name: "Vitamin D3 daily tablets", detail: "60 tablets · Qty 2", price: "$30.00" },
  { name: "Adhesive bandage pack", detail: "Qty 1", price: "$6.50" },
]

const totals = [
  { label: "Subtotal", value: "$54.50" },
  { label: "Shipping", value: "Free" },
  { label: "Estimated tax", value: "$4.36" },
]

export function CheckoutSummaryBlock() {
  return (
    <section className="bg-background px-6 py-12 md:py-16">
      <div className="mx-auto flex max-w-6xl flex-col gap-8">
        <h2 className="font-heading text-2xl font-semibold tracking-tight md:text-3xl">Checkout</h2>
        <div className="grid items-start gap-8 lg:grid-cols-5">
          <form className="flex flex-col gap-8 lg:col-span-3">
            <FieldSet>
              <FieldLegend>Contact</FieldLegend>
              <FieldGroup className="gap-5">
                <Field>
                  <FieldLabel htmlFor="checkout-email">Email</FieldLabel>
                  <Input id="checkout-email" type="email" autoComplete="email" placeholder="you@example.com" />
                </Field>
                <Field>
                  <FieldLabel htmlFor="checkout-phone">Phone</FieldLabel>
                  <Input id="checkout-phone" type="tel" autoComplete="tel" placeholder="For delivery updates" />
                </Field>
              </FieldGroup>
            </FieldSet>
            <FieldSet>
              <FieldLegend>Shipping address</FieldLegend>
              <FieldGroup className="gap-5">
                <div className="grid gap-5 sm:grid-cols-2">
                  <Field>
                    <FieldLabel htmlFor="checkout-first">First name</FieldLabel>
                    <Input id="checkout-first" autoComplete="given-name" />
                  </Field>
                  <Field>
                    <FieldLabel htmlFor="checkout-last">Last name</FieldLabel>
                    <Input id="checkout-last" autoComplete="family-name" />
                  </Field>
                </div>
                <Field>
                  <FieldLabel htmlFor="checkout-address">Address</FieldLabel>
                  <Input id="checkout-address" autoComplete="street-address" placeholder="Street and number" />
                </Field>
                <div className="grid gap-5 sm:grid-cols-3">
                  <Field>
                    <FieldLabel htmlFor="checkout-city">City</FieldLabel>
                    <Input id="checkout-city" autoComplete="address-level2" />
                  </Field>
                  <Field>
                    <FieldLabel htmlFor="checkout-region">Province</FieldLabel>
                    <NativeSelect id="checkout-region" defaultValue="" className="w-full">
                      <NativeSelectOption value="" disabled>
                        Select
                      </NativeSelectOption>
                      <NativeSelectOption value="on">Ontario</NativeSelectOption>
                      <NativeSelectOption value="qc">Quebec</NativeSelectOption>
                      <NativeSelectOption value="bc">British Columbia</NativeSelectOption>
                      <NativeSelectOption value="ab">Alberta</NativeSelectOption>
                    </NativeSelect>
                  </Field>
                  <Field>
                    <FieldLabel htmlFor="checkout-postal">Postal code</FieldLabel>
                    <Input id="checkout-postal" autoComplete="postal-code" />
                  </Field>
                </div>
                <Field orientation="horizontal">
                  <Checkbox id="checkout-save" defaultChecked />
                  <FieldLabel htmlFor="checkout-save">Save this address for next time</FieldLabel>
                </Field>
              </FieldGroup>
            </FieldSet>
          </form>
          <Card className="lg:col-span-2">
            <CardHeader>
              <CardTitle>Order summary</CardTitle>
              <CardDescription>{items.length} items</CardDescription>
            </CardHeader>
            <CardContent className="gap-4">
              <ul className="flex flex-col gap-4">
                {items.map((item) => (
                  <li key={item.name} className="flex items-center gap-3">
                    <div className="flex size-12 shrink-0 items-center justify-center rounded-md bg-muted text-muted-foreground">
                      <HugeiconsIcon icon={Image01Icon} className="size-4" />
                    </div>
                    <div className="flex min-w-0 flex-1 flex-col">
                      <span className="truncate font-medium">{item.name}</span>
                      <span className="text-xs text-muted-foreground">{item.detail}</span>
                    </div>
                    <span className="tabular-nums">{item.price}</span>
                  </li>
                ))}
              </ul>
              <Separator />
              <dl className="flex flex-col gap-2">
                {totals.map((row) => (
                  <div key={row.label} className="flex justify-between gap-4">
                    <dt className="text-muted-foreground">{row.label}</dt>
                    <dd className="tabular-nums">{row.value}</dd>
                  </div>
                ))}
              </dl>
              <Separator />
              <div className="flex justify-between gap-4 text-base font-semibold">
                <span>Total</span>
                <span className="tabular-nums">$58.86</span>
              </div>
            </CardContent>
            <CardFooter className="flex-col gap-3">
              <Button size="lg" className="w-full">
                Place order
              </Button>
              <p className="text-center text-xs text-muted-foreground">
                Prescription items are reviewed by a pharmacist before they ship.
              </p>
            </CardFooter>
          </Card>
        </div>
      </div>
    </section>
  )
}

export const block: Block = {
  id: "checkout-summary",
  name: "Checkout summary",
  category: "E-commerce",
  description: "Contact and shipping form beside an order summary with subtotal, shipping, tax, total and place order.",
  render: () => <CheckoutSummaryBlock />,
}
