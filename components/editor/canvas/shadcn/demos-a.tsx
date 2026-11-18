"use client"

import * as React from "react"
import { HugeiconsIcon } from "@hugeicons/react"
import {
  Add01Icon,
  Alert02Icon,
  ArrowDown01Icon,
  ArrowRight01Icon,
  Calendar03Icon,
  CheckmarkCircle02Icon,
  Copy01Icon,
  Delete02Icon,
  Download01Icon,
  Edit02Icon,
  File01Icon,
  Folder01Icon,
  InformationCircleIcon,
  Loading03Icon,
  Mail01Icon,
  MoreHorizontalIcon,
  Pdf01Icon,
  Search01Icon,
  Settings02Icon,
  Share08Icon,
  TextBoldIcon,
  TextItalicIcon,
  TextUnderlineIcon,
  UserIcon,
} from "@hugeicons/core-free-icons"
import { Bar, BarChart, CartesianGrid, Line, LineChart, XAxis } from "recharts"

import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { Alert, AlertAction, AlertDescription, AlertTitle } from "@/components/ui/alert"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { AspectRatio } from "@/components/ui/aspect-ratio"
import {
  Attachment,
  AttachmentAction,
  AttachmentActions,
  AttachmentContent,
  AttachmentDescription,
  AttachmentGroup,
  AttachmentMedia,
  AttachmentTitle,
} from "@/components/ui/attachment"
import { Avatar, AvatarBadge, AvatarFallback, AvatarGroup, AvatarGroupCount } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import {
  Breadcrumb,
  BreadcrumbEllipsis,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"
import { Bubble, BubbleContent, BubbleGroup, BubbleReactions } from "@/components/ui/bubble"
import { Button } from "@/components/ui/button"
import { ButtonGroup, ButtonGroupSeparator, ButtonGroupText } from "@/components/ui/button-group"
import { Calendar } from "@/components/ui/calendar"
import { Card, CardAction, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel"
import { ChartContainer, ChartLegend, ChartLegendContent, ChartTooltip, ChartTooltipContent, type ChartConfig } from "@/components/ui/chart"
import { Checkbox } from "@/components/ui/checkbox"
import {
  CodeBlock,
  CodeBlockActions,
  CodeBlockContent,
  CodeBlockCopyButton,
  CodeBlockHeader,
  CodeBlockLine,
  CodeBlockTitle,
} from "@/components/ui/code-block"
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible"
import {
  Combobox,
  ComboboxContent,
  ComboboxEmpty,
  ComboboxInput,
  ComboboxItem,
  ComboboxList,
} from "@/components/ui/combobox"
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
  CommandShortcut,
} from "@/components/ui/command"
import {
  ContextMenu,
  ContextMenuCheckboxItem,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuLabel,
  ContextMenuSeparator,
  ContextMenuShortcut,
  ContextMenuTrigger,
} from "@/components/ui/context-menu"
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import {
  Drawer,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer"
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Empty, EmptyContent, EmptyDescription, EmptyHeader, EmptyMedia, EmptyTitle } from "@/components/ui/empty"
import { Field, FieldDescription, FieldGroup, FieldLabel, FieldLegend, FieldSet, FieldSeparator } from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

import type { Demo } from "./types"

export function Row({ label, children }: { label?: string; children: React.ReactNode }) {
  return (
    <div className="flex flex-col gap-3">
      {label && <div className="text-muted-foreground text-xs font-medium tracking-wide uppercase">{label}</div>}
      <div className="flex flex-wrap items-center gap-3">{children}</div>
    </div>
  )
}

export const Icon = ({ icon, className }: { icon: Parameters<typeof HugeiconsIcon>[0]["icon"]; className?: string }) => (
  <HugeiconsIcon icon={icon} strokeWidth={2} className={className} />
)

const fruits = ["Apple", "Banana", "Blueberry", "Grapes", "Pineapple", "Strawberry"]

const chartData = [
  { month: "Jan", visits: 186, calls: 80 },
  { month: "Feb", visits: 305, calls: 200 },
  { month: "Mar", visits: 237, calls: 120 },
  { month: "Apr", visits: 173, calls: 190 },
  { month: "May", visits: 209, calls: 130 },
  { month: "Jun", visits: 264, calls: 140 },
]
const chartConfig = {
  visits: { label: "Visits", color: "var(--chart-1)" },
  calls: { label: "Calls", color: "var(--chart-2)" },
} satisfies ChartConfig

export const DEMOS_A: Demo[] = [
  {
    id: "accordion",
    name: "Accordion",
    description: "Stacked headings that reveal content",
    examples: [
      {
        name: "Basic",
        render: () => (
          <Accordion defaultValue={["item-1"]} className="w-full max-w-lg">
            <AccordionItem value="item-1">
              <AccordionTrigger>Is my data secure?</AccordionTrigger>
              <AccordionContent>All records are encrypted at rest and in transit.</AccordionContent>
            </AccordionItem>
            <AccordionItem value="item-2">
              <AccordionTrigger>Can I export my history?</AccordionTrigger>
              <AccordionContent>Yes, download a PDF or CSV from your account page.</AccordionContent>
            </AccordionItem>
            <AccordionItem value="item-3">
              <AccordionTrigger>How do I contact support?</AccordionTrigger>
              <AccordionContent>Chat with us any time from the help menu.</AccordionContent>
            </AccordionItem>
          </Accordion>
        ),
      },
      {
        name: "Multiple open",
        render: () => (
          <Accordion multiple defaultValue={["a", "b"]} className="w-full max-w-lg">
            <AccordionItem value="a">
              <AccordionTrigger>What should I bring to my first appointment?</AccordionTrigger>
              <AccordionContent>Your health card, a list of medications and any recent test results.</AccordionContent>
            </AccordionItem>
            <AccordionItem value="b">
              <AccordionTrigger>How long does a typical visit take, including check-in and any follow-up tests?</AccordionTrigger>
              <AccordionContent>Most visits take 30 to 45 minutes. Lab work can add another 15 minutes.</AccordionContent>
            </AccordionItem>
          </Accordion>
        ),
      },
      {
        name: "In a card",
        render: () => (
          <Card className="w-full max-w-lg">
            <CardHeader>
              <CardTitle>Billing questions</CardTitle>
              <CardDescription>Answers to what patients ask most</CardDescription>
            </CardHeader>
            <CardContent>
              <Accordion>
                <AccordionItem value="1">
                  <AccordionTrigger>How does billing work?</AccordionTrigger>
                  <AccordionContent>We bill your insurer first and send you any remaining balance.</AccordionContent>
                </AccordionItem>
                <AccordionItem value="2">
                  <AccordionTrigger>Which insurers do you accept?</AccordionTrigger>
                  <AccordionContent>Most major provincial and private plans.</AccordionContent>
                </AccordionItem>
              </Accordion>
            </CardContent>
          </Card>
        ),
      },
    ],
  },
  {
    id: "alert",
    name: "Alert",
    description: "Callouts for important messages",
    examples: [
      {
        name: "Default",
        render: () => (
          <Alert className="max-w-lg">
            <Icon icon={InformationCircleIcon} />
            <AlertTitle>Appointment confirmed</AlertTitle>
            <AlertDescription>Your visit is booked for Tuesday at 10:30 AM.</AlertDescription>
          </Alert>
        ),
      },
      {
        name: "Destructive",
        render: () => (
          <Alert variant="destructive" className="max-w-lg">
            <Icon icon={Alert02Icon} />
            <AlertTitle>Payment failed</AlertTitle>
            <AlertDescription>Check your card details and try again.</AlertDescription>
          </Alert>
        ),
      },
      {
        name: "With action",
        render: () => (
          <Alert className="max-w-lg">
            <Icon icon={CheckmarkCircle02Icon} />
            <AlertTitle>Results are ready</AlertTitle>
            <AlertDescription>Your lab results from March 12 are available.</AlertDescription>
            <AlertAction>
              <Button size="sm" variant="outline">
                View
              </Button>
            </AlertAction>
          </Alert>
        ),
      },
      {
        name: "Title only",
        render: () => (
          <Alert className="max-w-lg">
            <Icon icon={Calendar03Icon} />
            <AlertTitle>Clinic closed on Monday for the holiday</AlertTitle>
          </Alert>
        ),
      },
    ],
  },
  {
    id: "alert-dialog",
    name: "Alert Dialog",
    description: "Confirmation that interrupts the user",
    examples: [
      {
        name: "Basic",
        render: () => (
          <AlertDialog>
            <AlertDialogTrigger render={<Button variant="outline" />}>Cancel appointment</AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Cancel this appointment?</AlertDialogTitle>
                <AlertDialogDescription>Your slot will be released to other patients.</AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Keep it</AlertDialogCancel>
                <AlertDialogAction>Cancel appointment</AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        ),
      },
      {
        name: "Destructive",
        render: () => (
          <AlertDialog>
            <AlertDialogTrigger render={<Button variant="destructive" />}>Delete record</AlertDialogTrigger>
            <AlertDialogContent size="sm">
              <AlertDialogHeader>
                <AlertDialogTitle>Delete this record?</AlertDialogTitle>
                <AlertDialogDescription>This can’t be undone.</AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction variant="destructive">Delete</AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        ),
      },
    ],
  },
  {
    id: "aspect-ratio",
    name: "Aspect Ratio",
    description: "Keeps media at a fixed shape",
    examples: [
      {
        name: "16:9",
        render: () => (
          <div className="w-full max-w-md">
            <AspectRatio ratio={16 / 9} className="bg-muted text-muted-foreground flex items-center justify-center rounded-lg">
              16 : 9
            </AspectRatio>
          </div>
        ),
      },
      {
        name: "Square",
        render: () => (
          <div className="w-48">
            <AspectRatio ratio={1} className="bg-primary/15 text-primary flex items-center justify-center rounded-lg">
              1 : 1
            </AspectRatio>
          </div>
        ),
      },
    ],
  },
  {
    id: "attachment",
    name: "Attachment",
    description: "Files attached to a message or form",
    examples: [
      {
        name: "Group",
        render: () => (
          <AttachmentGroup className="w-full max-w-lg">
            <Attachment>
              <AttachmentMedia>
                <Icon icon={Pdf01Icon} />
              </AttachmentMedia>
              <AttachmentContent>
                <AttachmentTitle>lab-results.pdf</AttachmentTitle>
                <AttachmentDescription>240 KB</AttachmentDescription>
              </AttachmentContent>
              <AttachmentActions>
                <AttachmentAction aria-label="Download">
                  <Icon icon={Download01Icon} />
                </AttachmentAction>
              </AttachmentActions>
            </Attachment>
            <Attachment state="uploading">
              <AttachmentMedia>
                <Icon icon={File01Icon} />
              </AttachmentMedia>
              <AttachmentContent>
                <AttachmentTitle>referral-letter.docx</AttachmentTitle>
                <AttachmentDescription>Uploading…</AttachmentDescription>
              </AttachmentContent>
            </Attachment>
          </AttachmentGroup>
        ),
      },
      {
        name: "Sizes",
        render: () => (
          <div className="flex flex-col gap-3">
            {(["default", "sm", "xs"] as const).map((size) => (
              <Attachment key={size} size={size} className="w-72">
                <AttachmentMedia>
                  <Icon icon={File01Icon} />
                </AttachmentMedia>
                <AttachmentContent>
                  <AttachmentTitle>intake-form.pdf</AttachmentTitle>
                  <AttachmentDescription>{size}</AttachmentDescription>
                </AttachmentContent>
              </Attachment>
            ))}
          </div>
        ),
      },
      {
        name: "Error",
        render: () => (
          <Attachment state="error" className="w-72">
            <AttachmentMedia>
              <Icon icon={Alert02Icon} />
            </AttachmentMedia>
            <AttachmentContent>
              <AttachmentTitle>scan.png</AttachmentTitle>
              <AttachmentDescription>Upload failed</AttachmentDescription>
            </AttachmentContent>
          </Attachment>
        ),
      },
    ],
  },
  {
    id: "avatar",
    name: "Avatar",
    description: "User images with fallbacks",
    examples: [
      {
        name: "Sizes",
        render: () => (
          <Row>
            <Avatar size="sm">
              <AvatarFallback>SM</AvatarFallback>
            </Avatar>
            <Avatar>
              <AvatarFallback>CI</AvatarFallback>
            </Avatar>
            <Avatar size="lg">
              <AvatarFallback>LG</AvatarFallback>
            </Avatar>
          </Row>
        ),
      },
      {
        name: "Group",
        render: () => (
          <AvatarGroup>
            {["AB", "JK", "RT", "MP"].map((n) => (
              <Avatar key={n}>
                <AvatarFallback>{n}</AvatarFallback>
              </Avatar>
            ))}
            <AvatarGroupCount>+5</AvatarGroupCount>
          </AvatarGroup>
        ),
      },
      {
        name: "With badge",
        render: () => (
          <Avatar size="lg">
            <AvatarFallback>DR</AvatarFallback>
            <AvatarBadge className="bg-green-600" />
          </Avatar>
        ),
      },
    ],
  },
  {
    id: "badge",
    name: "Badge",
    description: "Small status labels",
    examples: [
      {
        name: "Variants",
        render: () => (
          <Row>
            <Badge>Default</Badge>
            <Badge variant="secondary">Secondary</Badge>
            <Badge variant="outline">Outline</Badge>
            <Badge variant="destructive">Destructive</Badge>
            <Badge variant="ghost">Ghost</Badge>
            <Badge variant="link">Link</Badge>
          </Row>
        ),
      },
      {
        name: "With icons",
        render: () => (
          <Row>
            <Badge>
              <Icon icon={CheckmarkCircle02Icon} data-icon="inline-start" /> Verified
            </Badge>
            <Badge variant="secondary">
              <Icon icon={Loading03Icon} className="animate-spin" /> Processing
            </Badge>
            <Badge variant="outline">
              Next <Icon icon={ArrowRight01Icon} />
            </Badge>
          </Row>
        ),
      },
      {
        name: "Counts",
        render: () => (
          <Row>
            <Badge className="rounded-full px-1.5 tabular-nums">8</Badge>
            <Badge variant="destructive" className="rounded-full px-1.5 tabular-nums">
              99+
            </Badge>
            <Badge variant="secondary" className="rounded-full px-1.5 tabular-nums">
              20
            </Badge>
          </Row>
        ),
      },
    ],
  },
  {
    id: "breadcrumb",
    name: "Breadcrumb",
    description: "Where you are in the hierarchy",
    examples: [
      {
        name: "Basic",
        render: () => (
          <Breadcrumb>
            <BreadcrumbList>
              <BreadcrumbItem>
                <BreadcrumbLink href="#">Home</BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbLink href="#">Patients</BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbPage>Records</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
        ),
      },
      {
        name: "Collapsed",
        render: () => (
          <Breadcrumb>
            <BreadcrumbList>
              <BreadcrumbItem>
                <BreadcrumbLink href="#">Home</BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbEllipsis />
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbLink href="#">Visits</BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbPage>March 12</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
        ),
      },
    ],
  },
  {
    id: "bubble",
    name: "Bubble",
    description: "Chat message bubbles",
    examples: [
      {
        name: "Conversation",
        render: () => (
          <BubbleGroup className="w-full max-w-md">
            <Bubble>
              <BubbleContent>Hi Chris, your results came back normal.</BubbleContent>
            </Bubble>
            <Bubble align="end" variant="secondary">
              <BubbleContent>Great news, thank you!</BubbleContent>
            </Bubble>
            <Bubble>
              <BubbleContent>See you at your next check-up in June.</BubbleContent>
              <BubbleReactions>👍</BubbleReactions>
            </Bubble>
          </BubbleGroup>
        ),
      },
      {
        name: "Variants",
        render: () => (
          <div className="flex flex-col gap-2">
            {(["default", "secondary", "muted", "tinted", "outline", "ghost", "destructive"] as const).map((v) => (
              <Bubble key={v} variant={v}>
                <BubbleContent>{v}</BubbleContent>
              </Bubble>
            ))}
          </div>
        ),
      },
    ],
  },
  {
    id: "button",
    name: "Button",
    description: "Actions in every variant and size",
    examples: [
      {
        name: "Variants",
        render: () => (
          <Row>
            <Button>Default</Button>
            <Button variant="secondary">Secondary</Button>
            <Button variant="outline">Outline</Button>
            <Button variant="ghost">Ghost</Button>
            <Button variant="destructive">Destructive</Button>
            <Button variant="link">Link</Button>
          </Row>
        ),
      },
      {
        name: "Sizes",
        render: () => (
          <Row>
            <Button size="xs">Extra small</Button>
            <Button size="sm">Small</Button>
            <Button>Default</Button>
            <Button size="lg">Large</Button>
          </Row>
        ),
      },
      {
        name: "With icons",
        render: () => (
          <Row>
            <Button>
              <Icon icon={Add01Icon} data-icon="inline-start" /> New visit
            </Button>
            <Button variant="outline">
              Share <Icon icon={Share08Icon} data-icon="inline-end" />
            </Button>
            <Button variant="outline" size="icon" aria-label="Settings">
              <Icon icon={Settings02Icon} />
            </Button>
            <Button variant="ghost" size="icon-sm" aria-label="More">
              <Icon icon={MoreHorizontalIcon} />
            </Button>
          </Row>
        ),
      },
      {
        name: "States",
        render: () => (
          <Row>
            <Button disabled>Disabled</Button>
            <Button disabled variant="outline">
              Disabled
            </Button>
            <Button>
              <Icon icon={Loading03Icon} className="animate-spin" /> Saving
            </Button>
            <Button aria-invalid variant="outline">
              Invalid
            </Button>
          </Row>
        ),
      },
    ],
  },
  {
    id: "button-group",
    name: "Button Group",
    description: "Related buttons joined together",
    examples: [
      {
        name: "Basic",
        render: () => (
          <ButtonGroup>
            <Button variant="outline">Day</Button>
            <Button variant="outline">Week</Button>
            <Button variant="outline">Month</Button>
          </ButtonGroup>
        ),
      },
      {
        name: "Split button",
        render: () => (
          <ButtonGroup>
            <Button>Book visit</Button>
            <ButtonGroupSeparator />
            <Button size="icon" aria-label="More options">
              <Icon icon={ArrowDown01Icon} />
            </Button>
          </ButtonGroup>
        ),
      },
      {
        name: "With input",
        render: () => (
          <ButtonGroup>
            <ButtonGroupText>https://</ButtonGroupText>
            <Input placeholder="clinic.example.com" className="w-48" />
            <Button variant="outline" aria-label="Copy">
              <Icon icon={Copy01Icon} />
            </Button>
          </ButtonGroup>
        ),
      },
      {
        name: "Vertical",
        render: () => (
          <ButtonGroup orientation="vertical">
            <Button variant="outline" size="icon" aria-label="Bold">
              <Icon icon={TextBoldIcon} />
            </Button>
            <Button variant="outline" size="icon" aria-label="Italic">
              <Icon icon={TextItalicIcon} />
            </Button>
            <Button variant="outline" size="icon" aria-label="Underline">
              <Icon icon={TextUnderlineIcon} />
            </Button>
          </ButtonGroup>
        ),
      },
    ],
  },
  {
    id: "calendar",
    name: "Calendar",
    description: "Pick dates",
    examples: [
      {
        name: "Single date",
        render: () => <Calendar mode="single" selected={new Date(2026, 10, 18)} defaultMonth={new Date(2026, 10, 1)} className="rounded-lg border" />,
      },
      {
        name: "Range",
        render: () => (
          <Calendar
            mode="range"
            defaultMonth={new Date(2026, 10, 1)}
            selected={{ from: new Date(2026, 10, 10), to: new Date(2026, 10, 16) }}
            className="rounded-lg border"
          />
        ),
      },
    ],
  },
  {
    id: "card",
    name: "Card",
    description: "Grouped content on a raised surface",
    examples: [
      {
        name: "Basic",
        render: () => (
          <Card className="w-full max-w-sm">
            <CardHeader>
              <CardTitle>Upcoming visit</CardTitle>
              <CardDescription>Dr. Patel · General check-up</CardDescription>
              <CardAction>
                <Badge variant="secondary">Tue</Badge>
              </CardAction>
            </CardHeader>
            <CardContent className="text-sm">Arrive 10 minutes early and bring your health card.</CardContent>
            <CardFooter className="gap-2">
              <Button variant="outline" className="flex-1">
                Reschedule
              </Button>
              <Button className="flex-1">Check in</Button>
            </CardFooter>
          </Card>
        ),
      },
      {
        name: "Form",
        render: () => (
          <Card className="w-full max-w-sm">
            <CardHeader>
              <CardTitle>Sign in</CardTitle>
              <CardDescription>Use your patient portal account</CardDescription>
            </CardHeader>
            <CardContent>
              <FieldGroup>
                <Field>
                  <FieldLabel htmlFor="c-email">Email</FieldLabel>
                  <Input id="c-email" type="email" placeholder="you@example.com" />
                </Field>
                <Field>
                  <FieldLabel htmlFor="c-pass">Password</FieldLabel>
                  <Input id="c-pass" type="password" />
                </Field>
              </FieldGroup>
            </CardContent>
            <CardFooter>
              <Button className="w-full">Sign in</Button>
            </CardFooter>
          </Card>
        ),
      },
      {
        name: "Small",
        render: () => (
          <Card size="sm" className="w-full max-w-xs">
            <CardHeader>
              <CardTitle>Heart rate</CardTitle>
              <CardDescription>Resting, last 7 days</CardDescription>
            </CardHeader>
            <CardContent className="text-2xl font-semibold">62 bpm</CardContent>
          </Card>
        ),
      },
    ],
  },
  {
    id: "carousel",
    name: "Carousel",
    description: "Swipe through items",
    examples: [
      {
        name: "Basic",
        render: () => (
          <Carousel className="w-full max-w-xs">
            <CarouselContent>
              {[1, 2, 3, 4, 5].map((n) => (
                <CarouselItem key={n}>
                  <Card>
                    <CardContent className="flex aspect-square items-center justify-center text-4xl font-semibold">{n}</CardContent>
                  </Card>
                </CarouselItem>
              ))}
            </CarouselContent>
            <CarouselPrevious />
            <CarouselNext />
          </Carousel>
        ),
      },
      {
        name: "Several per view",
        render: () => (
          <Carousel className="w-full max-w-md" opts={{ align: "start" }}>
            <CarouselContent>
              {[1, 2, 3, 4, 5, 6].map((n) => (
                <CarouselItem key={n} className="basis-1/3">
                  <div className="bg-muted flex aspect-square items-center justify-center rounded-lg text-xl font-semibold">{n}</div>
                </CarouselItem>
              ))}
            </CarouselContent>
            <CarouselPrevious />
            <CarouselNext />
          </Carousel>
        ),
      },
    ],
  },
  {
    id: "chart",
    name: "Chart",
    description: "Charts that use the chart colours",
    examples: [
      {
        name: "Bar chart",
        render: () => (
          <ChartContainer config={chartConfig} className="h-56 w-full max-w-lg">
            <BarChart data={chartData}>
              <CartesianGrid vertical={false} />
              <XAxis dataKey="month" tickLine={false} axisLine={false} />
              <ChartTooltip content={<ChartTooltipContent />} />
              <ChartLegend content={<ChartLegendContent />} />
              <Bar dataKey="visits" fill="var(--color-visits)" radius={4} />
              <Bar dataKey="calls" fill="var(--color-calls)" radius={4} />
            </BarChart>
          </ChartContainer>
        ),
      },
      {
        name: "Line chart",
        render: () => (
          <ChartContainer config={chartConfig} className="h-56 w-full max-w-lg">
            <LineChart data={chartData}>
              <CartesianGrid vertical={false} />
              <XAxis dataKey="month" tickLine={false} axisLine={false} />
              <ChartTooltip content={<ChartTooltipContent />} />
              <Line dataKey="visits" stroke="var(--color-visits)" strokeWidth={2} dot={false} />
              <Line dataKey="calls" stroke="var(--color-calls)" strokeWidth={2} dot={false} />
            </LineChart>
          </ChartContainer>
        ),
      },
    ],
  },
  {
    id: "checkbox",
    name: "Checkbox",
    description: "Multiple-choice selection",
    examples: [
      {
        name: "Basic",
        render: () => (
          <div className="flex flex-col gap-3">
            <Label className="gap-2">
              <Checkbox defaultChecked /> Email reminders
            </Label>
            <Label className="gap-2">
              <Checkbox /> Text message reminders
            </Label>
            <Label className="gap-2">
              <Checkbox disabled /> Phone calls (unavailable)
            </Label>
          </div>
        ),
      },
      {
        name: "With description",
        render: () => (
          <Field orientation="horizontal" className="max-w-sm">
            <Checkbox id="cb-terms" defaultChecked />
            <div className="flex flex-col gap-1">
              <FieldLabel htmlFor="cb-terms">Share records with my care team</FieldLabel>
              <FieldDescription>Doctors at this clinic can see your history.</FieldDescription>
            </div>
          </Field>
        ),
      },
      {
        name: "Invalid",
        render: () => (
          <Label className="gap-2">
            <Checkbox aria-invalid /> I agree to the terms
          </Label>
        ),
      },
    ],
  },
  {
    id: "code-block",
    name: "Code Block",
    description: "Formatted code with copy",
    examples: [
      {
        name: "With header",
        render: () => (
          <CodeBlock className="w-full max-w-lg">
            <CodeBlockHeader>
              <CodeBlockTitle>install.sh</CodeBlockTitle>
              <CodeBlockActions>
                <CodeBlockCopyButton value="npx shadcn@latest add button" />
              </CodeBlockActions>
            </CodeBlockHeader>
            <CodeBlockContent>
              <CodeBlockLine>npx shadcn@latest add button</CodeBlockLine>
            </CodeBlockContent>
          </CodeBlock>
        ),
      },
      {
        name: "Diff lines",
        render: () => (
          <CodeBlock className="w-full max-w-lg">
            <CodeBlockContent lineNumbers>
              <CodeBlockLine>{"const theme = {"}</CodeBlockLine>
              <CodeBlockLine variant="removed">{'  primary: "#0ea5e9",'}</CodeBlockLine>
              <CodeBlockLine variant="added">{'  primary: "var(--primary)",'}</CodeBlockLine>
              <CodeBlockLine variant="highlighted">{"  radius: 14,"}</CodeBlockLine>
              <CodeBlockLine>{"}"}</CodeBlockLine>
            </CodeBlockContent>
          </CodeBlock>
        ),
      },
    ],
  },
  {
    id: "collapsible",
    name: "Collapsible",
    description: "Show and hide a section",
    examples: [
      {
        name: "Basic",
        render: () => (
          <Collapsible defaultOpen className="flex w-full max-w-sm flex-col gap-2">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">3 upcoming visits</span>
              <CollapsibleTrigger render={<Button variant="ghost" size="icon-sm" aria-label="Toggle" />}>
                <Icon icon={ArrowDown01Icon} />
              </CollapsibleTrigger>
            </div>
            <div className="rounded-md border px-3 py-2 text-sm">Nov 20 · Dr. Patel</div>
            <CollapsibleContent className="flex flex-col gap-2">
              <div className="rounded-md border px-3 py-2 text-sm">Dec 4 · Lab work</div>
              <div className="rounded-md border px-3 py-2 text-sm">Jan 15 · Follow-up</div>
            </CollapsibleContent>
          </Collapsible>
        ),
      },
    ],
  },
  {
    id: "combobox",
    name: "Combobox",
    description: "Searchable select",
    examples: [
      {
        name: "Basic",
        render: () => (
          <Combobox items={fruits}>
            <ComboboxInput placeholder="Choose a fruit" className="w-56" />
            <ComboboxContent>
              <ComboboxEmpty>No results.</ComboboxEmpty>
              <ComboboxList>
                {(item: string) => (
                  <ComboboxItem key={item} value={item}>
                    {item}
                  </ComboboxItem>
                )}
              </ComboboxList>
            </ComboboxContent>
          </Combobox>
        ),
      },
      {
        name: "Disabled",
        render: () => (
          <Combobox items={fruits}>
            <ComboboxInput placeholder="Not available" disabled className="w-56" />
            <ComboboxContent>
              <ComboboxList>{(item: string) => <ComboboxItem key={item} value={item}>{item}</ComboboxItem>}</ComboboxList>
            </ComboboxContent>
          </Combobox>
        ),
      },
    ],
  },
  {
    id: "command",
    name: "Command",
    description: "Search and run commands",
    examples: [
      {
        name: "Palette",
        render: () => (
          <Command className="w-full max-w-md rounded-lg border">
            <CommandInput placeholder="Type a command or search…" />
            <CommandList>
              <CommandEmpty>No results.</CommandEmpty>
              <CommandGroup heading="Suggestions">
                <CommandItem>
                  <Icon icon={Calendar03Icon} /> Book a visit
                </CommandItem>
                <CommandItem>
                  <Icon icon={Search01Icon} /> Find a doctor
                </CommandItem>
              </CommandGroup>
              <CommandSeparator />
              <CommandGroup heading="Settings">
                <CommandItem>
                  <Icon icon={UserIcon} /> Profile <CommandShortcut>⌘P</CommandShortcut>
                </CommandItem>
                <CommandItem>
                  <Icon icon={Settings02Icon} /> Settings <CommandShortcut>⌘S</CommandShortcut>
                </CommandItem>
              </CommandGroup>
            </CommandList>
          </Command>
        ),
      },
    ],
  },
  {
    id: "context-menu",
    name: "Context Menu",
    description: "Right-click menu",
    examples: [
      {
        name: "Basic",
        render: () => (
          <ContextMenu>
            <ContextMenuTrigger className="text-muted-foreground flex h-36 w-72 items-center justify-center rounded-lg border border-dashed text-sm">
              Right-click here
            </ContextMenuTrigger>
            <ContextMenuContent className="w-52">
              <ContextMenuLabel>Record</ContextMenuLabel>
              <ContextMenuItem>
                Open <ContextMenuShortcut>⌘O</ContextMenuShortcut>
              </ContextMenuItem>
              <ContextMenuItem>
                Duplicate <ContextMenuShortcut>⌘D</ContextMenuShortcut>
              </ContextMenuItem>
              <ContextMenuSeparator />
              <ContextMenuCheckboxItem checked>Show archived</ContextMenuCheckboxItem>
              <ContextMenuSeparator />
              <ContextMenuItem variant="destructive">Delete</ContextMenuItem>
            </ContextMenuContent>
          </ContextMenu>
        ),
      },
    ],
  },
  {
    id: "dialog",
    name: "Dialog",
    description: "A window over the page",
    examples: [
      {
        name: "Form",
        render: () => (
          <Dialog>
            <DialogTrigger render={<Button />}>Edit profile</DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Edit profile</DialogTitle>
                <DialogDescription>Update your contact details.</DialogDescription>
              </DialogHeader>
              <FieldGroup>
                <Field>
                  <FieldLabel htmlFor="d-name">Name</FieldLabel>
                  <Input id="d-name" defaultValue="Chris Ingham" />
                </Field>
                <Field>
                  <FieldLabel htmlFor="d-email">Email</FieldLabel>
                  <Input id="d-email" defaultValue="chris@example.com" />
                </Field>
              </FieldGroup>
              <DialogFooter>
                <DialogClose render={<Button variant="outline" />}>Cancel</DialogClose>
                <Button>Save changes</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        ),
      },
      {
        name: "Message",
        render: () => (
          <Dialog>
            <DialogTrigger render={<Button variant="outline" />}>Show message</DialogTrigger>
            <DialogContent showCloseButton={false}>
              <DialogHeader>
                <DialogTitle>Visit booked</DialogTitle>
                <DialogDescription>We sent the details to your email.</DialogDescription>
              </DialogHeader>
              <DialogFooter>
                <DialogClose render={<Button />}>Done</DialogClose>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        ),
      },
    ],
  },
  {
    id: "drawer",
    name: "Drawer",
    description: "A panel that slides up from the bottom",
    examples: [
      {
        name: "Basic",
        render: () => (
          <Drawer>
            <DrawerTrigger render={<Button variant="outline" />}>Open drawer</DrawerTrigger>
            <DrawerContent>
              <DrawerHeader>
                <DrawerTitle>Daily goal</DrawerTitle>
                <DrawerDescription>Set your step goal for today.</DrawerDescription>
              </DrawerHeader>
              <div className="px-4 text-center text-5xl font-semibold">8,000</div>
              <DrawerFooter>
                <Button>Save</Button>
              </DrawerFooter>
            </DrawerContent>
          </Drawer>
        ),
      },
    ],
  },
  {
    id: "dropdown-menu",
    name: "Dropdown Menu",
    description: "A menu of actions",
    examples: [
      {
        name: "Basic",
        render: () => (
          <DropdownMenu>
            <DropdownMenuTrigger render={<Button variant="outline" />}>Open menu</DropdownMenuTrigger>
            <DropdownMenuContent className="w-52">
              <DropdownMenuGroup>
                <DropdownMenuLabel>My account</DropdownMenuLabel>
                <DropdownMenuItem>
                  <Icon icon={UserIcon} /> Profile <DropdownMenuShortcut>⇧⌘P</DropdownMenuShortcut>
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <Icon icon={Mail01Icon} /> Messages
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <Icon icon={Settings02Icon} /> Settings
                </DropdownMenuItem>
              </DropdownMenuGroup>
              <DropdownMenuSeparator />
              <DropdownMenuItem variant="destructive">Log out</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        ),
      },
      {
        name: "Checkboxes and radios",
        render: () => (
          <DropdownMenu>
            <DropdownMenuTrigger render={<Button variant="outline" />}>View options</DropdownMenuTrigger>
            <DropdownMenuContent className="w-52">
              <DropdownMenuGroup>
                <DropdownMenuLabel>Show</DropdownMenuLabel>
                <DropdownMenuCheckboxItem checked>Upcoming</DropdownMenuCheckboxItem>
                <DropdownMenuCheckboxItem>Past</DropdownMenuCheckboxItem>
              </DropdownMenuGroup>
              <DropdownMenuSeparator />
              <DropdownMenuGroup>
                <DropdownMenuLabel>Sort by</DropdownMenuLabel>
                <DropdownMenuRadioGroup value="date">
                  <DropdownMenuRadioItem value="date">Date</DropdownMenuRadioItem>
                  <DropdownMenuRadioItem value="doctor">Doctor</DropdownMenuRadioItem>
                </DropdownMenuRadioGroup>
              </DropdownMenuGroup>
            </DropdownMenuContent>
          </DropdownMenu>
        ),
      },
      {
        name: "Submenu",
        render: () => (
          <DropdownMenu>
            <DropdownMenuTrigger render={<Button variant="ghost" size="icon" aria-label="More" />}>
              <Icon icon={MoreHorizontalIcon} />
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-48">
              <DropdownMenuItem>
                <Icon icon={Edit02Icon} /> Edit
              </DropdownMenuItem>
              <DropdownMenuSub>
                <DropdownMenuSubTrigger>
                  <Icon icon={Folder01Icon} /> Move to
                </DropdownMenuSubTrigger>
                <DropdownMenuSubContent>
                  <DropdownMenuItem>Active</DropdownMenuItem>
                  <DropdownMenuItem>Archive</DropdownMenuItem>
                </DropdownMenuSubContent>
              </DropdownMenuSub>
              <DropdownMenuSeparator />
              <DropdownMenuItem variant="destructive">
                <Icon icon={Delete02Icon} /> Delete
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        ),
      },
    ],
  },
  {
    id: "empty",
    name: "Empty",
    description: "When there's nothing to show yet",
    examples: [
      {
        name: "With icon",
        render: () => (
          <Empty className="w-full max-w-md border">
            <EmptyHeader>
              <EmptyMedia variant="icon">
                <Icon icon={Calendar03Icon} />
              </EmptyMedia>
              <EmptyTitle>No appointments</EmptyTitle>
              <EmptyDescription>You don’t have any visits booked.</EmptyDescription>
            </EmptyHeader>
            <EmptyContent>
              <Button>Book a visit</Button>
            </EmptyContent>
          </Empty>
        ),
      },
      {
        name: "Minimal",
        render: () => (
          <Empty className="w-full max-w-md">
            <EmptyHeader>
              <EmptyTitle>No results</EmptyTitle>
              <EmptyDescription>Try a different search.</EmptyDescription>
            </EmptyHeader>
          </Empty>
        ),
      },
    ],
  },
  {
    id: "field",
    name: "Field",
    description: "Labels, help text and errors for form controls",
    examples: [
      {
        name: "Text fields",
        render: () => (
          <FieldGroup className="w-full max-w-sm">
            <Field>
              <FieldLabel htmlFor="f-name">Full name</FieldLabel>
              <Input id="f-name" placeholder="Jane Doe" />
            </Field>
            <Field>
              <FieldLabel htmlFor="f-email">Email</FieldLabel>
              <Input id="f-email" type="email" placeholder="jane@example.com" />
              <FieldDescription>We’ll only use this for appointment updates.</FieldDescription>
            </Field>
            <Field data-invalid>
              <FieldLabel htmlFor="f-phone">Phone</FieldLabel>
              <Input id="f-phone" aria-invalid defaultValue="555-01" />
              <FieldDescription>Enter a full 10-digit number.</FieldDescription>
            </Field>
          </FieldGroup>
        ),
      },
      {
        name: "Fieldset",
        render: () => (
          <FieldSet className="w-full max-w-sm">
            <FieldLegend>Notifications</FieldLegend>
            <FieldDescription>Choose how we contact you.</FieldDescription>
            <FieldGroup>
              <Field orientation="horizontal">
                <Checkbox id="fs-email" defaultChecked />
                <FieldLabel htmlFor="fs-email">Email</FieldLabel>
              </Field>
              <FieldSeparator />
              <Field orientation="horizontal">
                <Checkbox id="fs-sms" />
                <FieldLabel htmlFor="fs-sms">Text message</FieldLabel>
              </Field>
            </FieldGroup>
          </FieldSet>
        ),
      },
    ],
  },
]
