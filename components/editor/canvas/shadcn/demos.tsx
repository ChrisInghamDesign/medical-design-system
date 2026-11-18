"use client"

import * as React from "react"

import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
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
import { Avatar, AvatarFallback, AvatarGroup } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Empty, EmptyContent, EmptyDescription, EmptyHeader, EmptyTitle } from "@/components/ui/empty"
import { Field, FieldDescription, FieldGroup, FieldLabel } from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import { Kbd, KbdGroup } from "@/components/ui/kbd"
import { Label } from "@/components/ui/label"
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination"
import { Popover, PopoverContent, PopoverDescription, PopoverHeader, PopoverTitle, PopoverTrigger } from "@/components/ui/popover"
import { Progress } from "@/components/ui/progress"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Separator } from "@/components/ui/separator"
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet"
import { Skeleton } from "@/components/ui/skeleton"
import { Slider } from "@/components/ui/slider"
import { Spinner } from "@/components/ui/spinner"
import { Switch } from "@/components/ui/switch"
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Textarea } from "@/components/ui/textarea"
import { Toggle } from "@/components/ui/toggle"
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"

export interface Demo {
  id: string
  name: string
  description: string
  render: () => React.ReactNode
}

function Row({ label, children }: { label?: string; children: React.ReactNode }) {
  return (
    <div className="flex flex-col gap-3">
      {label && <div className="text-muted-foreground text-xs font-medium uppercase tracking-wide">{label}</div>}
      <div className="flex flex-wrap items-center gap-3">{children}</div>
    </div>
  )
}

const fruits = [
  { label: "Apple", value: "apple" },
  { label: "Banana", value: "banana" },
  { label: "Blueberry", value: "blueberry" },
  { label: "Grapes", value: "grapes" },
]

export const DEMOS: Demo[] = [
  {
    id: "accordion",
    name: "Accordion",
    description: "Stacked headings that reveal content",
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
    id: "alert",
    name: "Alert",
    description: "Callouts for important messages",
    render: () => (
      <div className="flex w-full max-w-lg flex-col gap-4">
        <Alert>
          <AlertTitle>Appointment confirmed</AlertTitle>
          <AlertDescription>Your visit is booked for Tuesday at 10:30 AM.</AlertDescription>
        </Alert>
        <Alert variant="destructive">
          <AlertTitle>Payment failed</AlertTitle>
          <AlertDescription>Check your card details and try again.</AlertDescription>
        </Alert>
      </div>
    ),
  },
  {
    id: "alert-dialog",
    name: "Alert Dialog",
    description: "Confirmation that interrupts the user",
    render: () => (
      <AlertDialog>
        <AlertDialogTrigger render={<Button variant="outline" />}>Delete record</AlertDialogTrigger>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete this record?</AlertDialogTitle>
            <AlertDialogDescription>This can’t be undone. The record is removed for everyone.</AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction>Delete</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    ),
  },
  {
    id: "avatar",
    name: "Avatar",
    description: "User images with fallbacks",
    render: () => (
      <Row>
        <Avatar>
          <AvatarFallback>CI</AvatarFallback>
        </Avatar>
        <Avatar size="lg">
          <AvatarFallback>MD</AvatarFallback>
        </Avatar>
        <AvatarGroup>
          <Avatar>
            <AvatarFallback>AB</AvatarFallback>
          </Avatar>
          <Avatar>
            <AvatarFallback>JK</AvatarFallback>
          </Avatar>
          <Avatar>
            <AvatarFallback>RT</AvatarFallback>
          </Avatar>
        </AvatarGroup>
      </Row>
    ),
  },
  {
    id: "badge",
    name: "Badge",
    description: "Small status labels",
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
    id: "breadcrumb",
    name: "Breadcrumb",
    description: "Where you are in the hierarchy",
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
    id: "button",
    name: "Button",
    description: "Actions in every variant and size",
    render: () => (
      <div className="flex flex-col gap-6">
        <Row label="Variants">
          <Button>Default</Button>
          <Button variant="secondary">Secondary</Button>
          <Button variant="outline">Outline</Button>
          <Button variant="ghost">Ghost</Button>
          <Button variant="destructive">Destructive</Button>
          <Button variant="link">Link</Button>
        </Row>
        <Row label="Sizes">
          <Button size="xs">Extra small</Button>
          <Button size="sm">Small</Button>
          <Button>Default</Button>
          <Button size="lg">Large</Button>
        </Row>
        <Row label="States">
          <Button disabled>Disabled</Button>
          <Button>
            <Spinner /> Saving
          </Button>
        </Row>
      </div>
    ),
  },
  {
    id: "card",
    name: "Card",
    description: "Grouped content on a raised surface",
    render: () => (
      <Card className="w-full max-w-sm">
        <CardHeader>
          <CardTitle>Upcoming visit</CardTitle>
          <CardDescription>Dr. Patel · General check-up</CardDescription>
          <CardAction>
            <Badge variant="secondary">Tue</Badge>
          </CardAction>
        </CardHeader>
        <CardContent className="text-sm">
          Arrive 10 minutes early and bring your health card.
        </CardContent>
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
    id: "checkbox",
    name: "Checkbox",
    description: "Multiple-choice selection",
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
    id: "dialog",
    name: "Dialog",
    description: "A window over the page",
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
            <Button>Save changes</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    ),
  },
  {
    id: "dropdown-menu",
    name: "Dropdown Menu",
    description: "A menu of actions",
    render: () => (
      <DropdownMenu>
        <DropdownMenuTrigger render={<Button variant="outline" />}>Open menu</DropdownMenuTrigger>
        <DropdownMenuContent className="w-52">
          <DropdownMenuGroup>
            <DropdownMenuLabel>My account</DropdownMenuLabel>
            <DropdownMenuItem>
              Profile <DropdownMenuShortcut>⇧⌘P</DropdownMenuShortcut>
            </DropdownMenuItem>
            <DropdownMenuItem>
              Billing <DropdownMenuShortcut>⌘B</DropdownMenuShortcut>
            </DropdownMenuItem>
            <DropdownMenuItem>Settings</DropdownMenuItem>
          </DropdownMenuGroup>
          <DropdownMenuSeparator />
          <DropdownMenuItem variant="destructive">Log out</DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    ),
  },
  {
    id: "empty",
    name: "Empty",
    description: "When there's nothing to show yet",
    render: () => (
      <Empty className="w-full max-w-md border">
        <EmptyHeader>
          <EmptyTitle>No appointments</EmptyTitle>
          <EmptyDescription>You don’t have any visits booked. Book one to get started.</EmptyDescription>
        </EmptyHeader>
        <EmptyContent>
          <Button>Book a visit</Button>
        </EmptyContent>
      </Empty>
    ),
  },
  {
    id: "field",
    name: "Field & Input",
    description: "Text inputs with labels and help",
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
        <Field>
          <FieldLabel htmlFor="f-disabled">Member ID</FieldLabel>
          <Input id="f-disabled" disabled defaultValue="MD-20481" />
        </Field>
      </FieldGroup>
    ),
  },
  {
    id: "kbd",
    name: "Kbd",
    description: "Keyboard shortcuts",
    render: () => (
      <Row>
        <KbdGroup>
          <Kbd>⌘</Kbd>
          <Kbd>K</Kbd>
        </KbdGroup>
        <KbdGroup>
          <Kbd>Ctrl</Kbd>
          <span>+</span>
          <Kbd>Shift</Kbd>
          <span>+</span>
          <Kbd>P</Kbd>
        </KbdGroup>
      </Row>
    ),
  },
  {
    id: "pagination",
    name: "Pagination",
    description: "Move between pages",
    render: () => (
      <Pagination>
        <PaginationContent>
          <PaginationItem>
            <PaginationPrevious href="#" />
          </PaginationItem>
          <PaginationItem>
            <PaginationLink href="#">1</PaginationLink>
          </PaginationItem>
          <PaginationItem>
            <PaginationLink href="#" isActive>
              2
            </PaginationLink>
          </PaginationItem>
          <PaginationItem>
            <PaginationLink href="#">3</PaginationLink>
          </PaginationItem>
          <PaginationItem>
            <PaginationEllipsis />
          </PaginationItem>
          <PaginationItem>
            <PaginationNext href="#" />
          </PaginationItem>
        </PaginationContent>
      </Pagination>
    ),
  },
  {
    id: "popover",
    name: "Popover",
    description: "Floating content next to a trigger",
    render: () => (
      <Popover>
        <PopoverTrigger render={<Button variant="outline" />}>Visit details</PopoverTrigger>
        <PopoverContent>
          <PopoverHeader>
            <PopoverTitle>General check-up</PopoverTitle>
            <PopoverDescription>Tuesday, 10:30 AM · Room 4</PopoverDescription>
          </PopoverHeader>
        </PopoverContent>
      </Popover>
    ),
  },
  {
    id: "progress",
    name: "Progress",
    description: "How far along a task is",
    render: () => (
      <div className="flex w-full max-w-sm flex-col gap-4">
        <Progress value={25} />
        <Progress value={65} />
        <Progress value={90} />
      </div>
    ),
  },
  {
    id: "radio-group",
    name: "Radio Group",
    description: "Pick one option",
    render: () => (
      <RadioGroup defaultValue="morning">
        <Label className="gap-2">
          <RadioGroupItem value="morning" /> Morning
        </Label>
        <Label className="gap-2">
          <RadioGroupItem value="afternoon" /> Afternoon
        </Label>
        <Label className="gap-2">
          <RadioGroupItem value="evening" /> Evening
        </Label>
      </RadioGroup>
    ),
  },
  {
    id: "select",
    name: "Select",
    description: "Choose from a list",
    render: () => (
      <Select items={fruits} defaultValue="banana">
        <SelectTrigger className="w-48">
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          <SelectGroup>
            {fruits.map((f) => (
              <SelectItem key={f.value} value={f.value}>
                {f.label}
              </SelectItem>
            ))}
          </SelectGroup>
        </SelectContent>
      </Select>
    ),
  },
  {
    id: "separator",
    name: "Separator",
    description: "Divides content",
    render: () => (
      <div className="w-full max-w-sm">
        <div className="text-sm font-medium">Medical design system</div>
        <div className="text-muted-foreground text-sm">Tokens and components</div>
        <Separator className="my-4" />
        <div className="flex h-5 items-center gap-4 text-sm">
          <span>Colors</span>
          <Separator orientation="vertical" />
          <span>Type</span>
          <Separator orientation="vertical" />
          <span>Radius</span>
        </div>
      </div>
    ),
  },
  {
    id: "sheet",
    name: "Sheet",
    description: "A panel that slides in from the edge",
    render: () => (
      <Sheet>
        <SheetTrigger render={<Button variant="outline" />}>Open filters</SheetTrigger>
        <SheetContent>
          <SheetHeader>
            <SheetTitle>Filters</SheetTitle>
            <SheetDescription>Narrow down the records list.</SheetDescription>
          </SheetHeader>
          <div className="flex flex-col gap-3 px-4">
            <Label className="gap-2">
              <Checkbox defaultChecked /> Active patients
            </Label>
            <Label className="gap-2">
              <Checkbox /> Archived
            </Label>
          </div>
          <SheetFooter>
            <Button>Apply</Button>
          </SheetFooter>
        </SheetContent>
      </Sheet>
    ),
  },
  {
    id: "skeleton",
    name: "Skeleton",
    description: "Loading placeholders",
    render: () => (
      <div className="flex items-center gap-4">
        <Skeleton className="size-12 rounded-full" />
        <div className="flex flex-col gap-2">
          <Skeleton className="h-4 w-56" />
          <Skeleton className="h-4 w-40" />
        </div>
      </div>
    ),
  },
  {
    id: "slider",
    name: "Slider",
    description: "Pick a value in a range",
    render: () => (
      <div className="flex w-full max-w-sm flex-col gap-6">
        <Slider defaultValue={[40]} />
        <Slider defaultValue={[20, 70]} />
      </div>
    ),
  },
  {
    id: "spinner",
    name: "Spinner",
    description: "Something is loading",
    render: () => (
      <Row>
        <Spinner />
        <Spinner className="size-6" />
        <Spinner className="text-primary size-8" />
      </Row>
    ),
  },
  {
    id: "switch",
    name: "Switch",
    description: "On and off settings",
    render: () => (
      <div className="flex flex-col gap-3">
        <Label className="gap-2">
          <Switch defaultChecked /> Share records with my doctor
        </Label>
        <Label className="gap-2">
          <Switch /> Dark mode
        </Label>
        <Label className="gap-2">
          <Switch size="sm" defaultChecked /> Small switch
        </Label>
      </div>
    ),
  },
  {
    id: "table",
    name: "Table",
    description: "Rows and columns of data",
    render: () => (
      <Table className="max-w-xl">
        <TableCaption>Recent invoices</TableCaption>
        <TableHeader>
          <TableRow>
            <TableHead>Invoice</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Method</TableHead>
            <TableHead className="text-right">Amount</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {[
            ["INV001", "Paid", "Credit card", "$250.00"],
            ["INV002", "Pending", "PayPal", "$150.00"],
            ["INV003", "Unpaid", "Bank transfer", "$350.00"],
          ].map(([id, status, method, amount]) => (
            <TableRow key={id}>
              <TableCell className="font-medium">{id}</TableCell>
              <TableCell>
                <Badge variant={status === "Paid" ? "default" : status === "Pending" ? "secondary" : "outline"}>
                  {status}
                </Badge>
              </TableCell>
              <TableCell>{method}</TableCell>
              <TableCell className="text-right">{amount}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    ),
  },
  {
    id: "tabs",
    name: "Tabs",
    description: "Switch between views",
    render: () => (
      <Tabs defaultValue="overview" className="w-full max-w-md">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="visits">Visits</TabsTrigger>
          <TabsTrigger value="billing">Billing</TabsTrigger>
        </TabsList>
        <TabsContent value="overview">
          <Card>
            <CardHeader>
              <CardTitle>Overview</CardTitle>
              <CardDescription>Your health summary at a glance.</CardDescription>
            </CardHeader>
          </Card>
        </TabsContent>
        <TabsContent value="visits">
          <Card>
            <CardHeader>
              <CardTitle>Visits</CardTitle>
              <CardDescription>Past and upcoming appointments.</CardDescription>
            </CardHeader>
          </Card>
        </TabsContent>
        <TabsContent value="billing">
          <Card>
            <CardHeader>
              <CardTitle>Billing</CardTitle>
              <CardDescription>Invoices and payment methods.</CardDescription>
            </CardHeader>
          </Card>
        </TabsContent>
      </Tabs>
    ),
  },
  {
    id: "textarea",
    name: "Textarea",
    description: "Multi-line text",
    render: () => (
      <Field className="w-full max-w-sm">
        <FieldLabel htmlFor="t-notes">Notes for your doctor</FieldLabel>
        <Textarea id="t-notes" placeholder="Describe your symptoms..." />
      </Field>
    ),
  },
  {
    id: "toggle",
    name: "Toggle & Toggle Group",
    description: "Pressed and unpressed buttons",
    render: () => (
      <div className="flex flex-col gap-6">
        <Row label="Toggle">
          <Toggle aria-label="Bold" defaultPressed>
            Bold
          </Toggle>
          <Toggle variant="outline" aria-label="Italic">
            Italic
          </Toggle>
        </Row>
        <Row label="Toggle group">
          <ToggleGroup defaultValue={["week"]} variant="outline">
            <ToggleGroupItem value="day">Day</ToggleGroupItem>
            <ToggleGroupItem value="week">Week</ToggleGroupItem>
            <ToggleGroupItem value="month">Month</ToggleGroupItem>
          </ToggleGroup>
        </Row>
      </div>
    ),
  },
  {
    id: "tooltip",
    name: "Tooltip",
    description: "Hints on hover",
    render: () => (
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger render={<Button variant="outline" />}>Hover me</TooltipTrigger>
          <TooltipContent>Add to your calendar</TooltipContent>
        </Tooltip>
      </TooltipProvider>
    ),
  },
]
