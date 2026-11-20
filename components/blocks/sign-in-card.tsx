import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox"
import { Field, FieldGroup, FieldLabel, FieldSeparator } from "@/components/ui/field"
import { Input } from "@/components/ui/input"

import type { Block } from "./types"

export function SignInCardBlock() {
  return (
    <section className="bg-muted/40 px-6 py-12 md:py-16">
      <div className="mx-auto flex max-w-sm flex-col gap-6">
        <Card>
          <CardHeader className="text-center">
            <CardTitle className="text-xl">Welcome back</CardTitle>
            <CardDescription>Sign in to your patient account</CardDescription>
          </CardHeader>
          <CardContent>
            <form className="flex flex-col gap-6">
              <FieldGroup className="gap-5">
                <Field>
                  <FieldLabel htmlFor="signin-email">Email</FieldLabel>
                  <Input id="signin-email" type="email" placeholder="you@example.com" autoComplete="email" />
                </Field>
                <Field>
                  <div className="flex items-center justify-between gap-2">
                    <FieldLabel htmlFor="signin-password">Password</FieldLabel>
                    <a href="#" className="text-sm text-muted-foreground underline-offset-4 hover:underline">
                      Forgot password?
                    </a>
                  </div>
                  <Input id="signin-password" type="password" autoComplete="current-password" />
                </Field>
                <Field orientation="horizontal">
                  <Checkbox id="signin-remember" />
                  <FieldLabel htmlFor="signin-remember" className="font-normal">
                    Keep me signed in on this device
                  </FieldLabel>
                </Field>
              </FieldGroup>
              <Button type="submit" className="w-full">
                Sign in
              </Button>
              <FieldSeparator>or</FieldSeparator>
              <Button type="button" variant="outline" className="w-full">
                Email me a sign-in link
              </Button>
            </form>
          </CardContent>
          <CardFooter className="justify-center">
            <p className="text-muted-foreground text-sm">
              New patient?{" "}
              <a href="#" className="font-medium text-foreground underline-offset-4 hover:underline">
                Create an account
              </a>
            </p>
          </CardFooter>
        </Card>
        <p className="text-center text-xs text-balance text-muted-foreground">
          If you need urgent care, call your local emergency number.
        </p>
      </div>
    </section>
  )
}

export const block: Block = {
  id: "sign-in-card",
  name: "Sign-in card",
  category: "Application",
  description: "Patient sign-in card with email, password, remember-me and an alternative link.",
  render: () => <SignInCardBlock />,
}
