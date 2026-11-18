import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Field, FieldContent, FieldDescription, FieldGroup, FieldLabel, FieldSeparator } from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import { NativeSelect, NativeSelectOption } from "@/components/ui/native-select"
import { Switch } from "@/components/ui/switch"

import type { Block } from "./types"

const toggles = [
  { id: "set-reminders", label: "Appointment reminders", description: "A reminder the day before each visit.", on: true },
  { id: "set-results", label: "Test results", description: "Tell me when new results are available.", on: true },
  { id: "set-news", label: "Clinic news", description: "Occasional updates about services and opening hours.", on: false },
]

export function SettingsNotificationsBlock() {
  return (
    <section className="bg-background px-6 py-12 md:py-16">
      <div className="mx-auto grid max-w-5xl gap-8 lg:grid-cols-3">
        <div className="flex flex-col gap-1">
          <h2 className="font-heading text-xl font-semibold tracking-tight">Notifications</h2>
          <p className="text-sm text-muted-foreground">Choose how and when your clinic contacts you.</p>
        </div>
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Contact preferences</CardTitle>
            <CardDescription>Changes apply to all clinics linked to your account.</CardDescription>
          </CardHeader>
          <CardContent>
            <FieldGroup>
              <div className="grid gap-6 md:grid-cols-2">
                <Field>
                  <FieldLabel htmlFor="set-phone">Mobile number</FieldLabel>
                  <Input id="set-phone" type="tel" placeholder="(555) 000-0000" />
                </Field>
                <Field>
                  <FieldLabel htmlFor="set-channel">Preferred channel</FieldLabel>
                  <NativeSelect id="set-channel" defaultValue="sms" className="w-full">
                    <NativeSelectOption value="sms">Text message</NativeSelectOption>
                    <NativeSelectOption value="email">Email</NativeSelectOption>
                    <NativeSelectOption value="app">App notification</NativeSelectOption>
                  </NativeSelect>
                </Field>
              </div>
              <FieldSeparator />
              {toggles.map((toggle) => (
                <Field key={toggle.id} orientation="horizontal">
                  <FieldContent>
                    <FieldLabel htmlFor={toggle.id}>{toggle.label}</FieldLabel>
                    <FieldDescription>{toggle.description}</FieldDescription>
                  </FieldContent>
                  <Switch id={toggle.id} defaultChecked={toggle.on} />
                </Field>
              ))}
            </FieldGroup>
          </CardContent>
          <CardFooter className="justify-end gap-2">
            <Button variant="outline">Cancel</Button>
            <Button>Save changes</Button>
          </CardFooter>
        </Card>
      </div>
    </section>
  )
}

export const block: Block = {
  id: "settings-notifications",
  name: "Settings section",
  category: "Application",
  description: "Settings form with contact fields and notification switches.",
  render: () => <SettingsNotificationsBlock />,
}
