"use client"

import * as React from "react"

import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Field, FieldDescription, FieldGroup, FieldLabel } from "@/components/ui/field"
import { NativeSelect, NativeSelectOption } from "@/components/ui/native-select"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Textarea } from "@/components/ui/textarea"
import { Calendar03Icon, HugeiconsIcon } from "@/lib/ds/icons"

import type { Block } from "./types"

const times = ["08:30", "09:00", "09:30", "10:00", "10:30", "11:00", "13:30", "14:00", "14:30", "15:00"]

export function AppointmentBookingBlock() {
  const [date, setDate] = React.useState<Date | undefined>(undefined)
  const [open, setOpen] = React.useState(false)

  return (
    <section className="bg-background px-6 py-12 md:py-16">
      <div className="mx-auto max-w-2xl">
        <Card>
          <CardHeader>
            <CardTitle className="text-xl">Book an appointment</CardTitle>
            <CardDescription>Choose a visit type and a time that works for you.</CardDescription>
          </CardHeader>
          <CardContent>
            <form className="flex flex-col gap-6">
              <FieldGroup className="gap-5">
                <Field>
                  <FieldLabel htmlFor="book-type">Visit type</FieldLabel>
                  <NativeSelect id="book-type" defaultValue="checkup" className="w-full">
                    <NativeSelectOption value="checkup">General check-up</NativeSelectOption>
                    <NativeSelectOption value="followup">Follow-up visit</NativeSelectOption>
                    <NativeSelectOption value="vaccination">Vaccination</NativeSelectOption>
                    <NativeSelectOption value="virtual">Virtual visit</NativeSelectOption>
                  </NativeSelect>
                </Field>
                <div className="grid gap-5 md:grid-cols-2">
                  <Field>
                    <FieldLabel htmlFor="book-date">Date</FieldLabel>
                    <Popover open={open} onOpenChange={setOpen}>
                      <PopoverTrigger
                        render={<Button id="book-date" type="button" variant="outline" className="w-full justify-start font-normal" />}
                      >
                        <HugeiconsIcon icon={Calendar03Icon} data-icon="inline-start" />
                        {date ? (
                          date.toLocaleDateString(undefined, { weekday: "short", month: "short", day: "numeric" })
                        ) : (
                          <span className="text-muted-foreground">Pick a date</span>
                        )}
                      </PopoverTrigger>
                      <PopoverContent align="start" className="w-auto p-0">
                        <Calendar
                          mode="single"
                          selected={date}
                          onSelect={(next) => {
                            setDate(next)
                            setOpen(false)
                          }}
                          disabled={{ dayOfWeek: [0, 6] }}
                        />
                      </PopoverContent>
                    </Popover>
                  </Field>
                  <Field>
                    <FieldLabel htmlFor="book-time">Time</FieldLabel>
                    <NativeSelect id="book-time" defaultValue="" className="w-full">
                      <NativeSelectOption value="" disabled>
                        Select a time
                      </NativeSelectOption>
                      {times.map((time) => (
                        <NativeSelectOption key={time} value={time}>
                          {time}
                        </NativeSelectOption>
                      ))}
                    </NativeSelect>
                  </Field>
                </div>
                <Field>
                  <FieldLabel htmlFor="book-notes">Reason for visit</FieldLabel>
                  <Textarea id="book-notes" placeholder="Briefly describe your symptoms or what you'd like to discuss" />
                  <FieldDescription>Optional. Only your care team can see this.</FieldDescription>
                </Field>
              </FieldGroup>
            </form>
          </CardContent>
          <CardFooter className="flex-col-reverse gap-2 sm:flex-row sm:justify-end">
            <Button variant="outline" className="w-full sm:w-auto">
              Cancel
            </Button>
            <Button className="w-full sm:w-auto">Confirm booking</Button>
          </CardFooter>
        </Card>
      </div>
    </section>
  )
}

export const block: Block = {
  id: "appointment-booking",
  name: "Appointment booking",
  category: "Forms",
  description: "Booking form with visit type, date picker, time select and notes.",
  render: () => <AppointmentBookingBlock />,
}
