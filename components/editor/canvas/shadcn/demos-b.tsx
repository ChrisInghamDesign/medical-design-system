"use client"

import * as React from "react"
import {
  Add01Icon,
  Alert02Icon,
  Calendar03Icon,
  CheckmarkCircle02Icon,
  Copy01Icon,
  DashboardSquare01Icon,
  File01Icon,
  Home01Icon,
  InformationCircleIcon,
  Mail01Icon,
  Search01Icon,
  Settings02Icon,
  Stethoscope02Icon,
  TextBoldIcon,
  TextItalicIcon,
  TextUnderlineIcon,
  UserIcon,
} from "@/lib/ds/icons"

import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { Field, FieldDescription, FieldLabel } from "@/components/ui/field"
import { HoverCard, HoverCardContent, HoverCardTrigger } from "@/components/ui/hover-card"
import { Input } from "@/components/ui/input"
import { InputGroup, InputGroupAddon, InputGroupButton, InputGroupInput, InputGroupText, InputGroupTextarea } from "@/components/ui/input-group"
import { InputOTP, InputOTPGroup, InputOTPSeparator, InputOTPSlot } from "@/components/ui/input-otp"
import { Item, ItemActions, ItemContent, ItemDescription, ItemGroup, ItemMedia, ItemSeparator, ItemTitle } from "@/components/ui/item"
import { Kbd, KbdGroup } from "@/components/ui/kbd"
import { Label } from "@/components/ui/label"
import { Marker, MarkerContent, MarkerIcon } from "@/components/ui/marker"
import {
  Menubar,
  MenubarCheckboxItem,
  MenubarContent,
  MenubarItem,
  MenubarMenu,
  MenubarSeparator,
  MenubarShortcut,
  MenubarTrigger,
} from "@/components/ui/menubar"
import { Message, MessageAvatar, MessageContent, MessageFooter, MessageGroup, MessageHeader } from "@/components/ui/message"
import {
  MessageScroller,
  MessageScrollerContent,
  MessageScrollerItem,
  MessageScrollerProvider,
  MessageScrollerViewport,
} from "@/components/ui/message-scroller"
import { NativeSelect, NativeSelectOption } from "@/components/ui/native-select"
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
} from "@/components/ui/navigation-menu"
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
import { Progress, ProgressLabel, ProgressValue } from "@/components/ui/progress"
import {
  Questionnaire,
  QuestionnaireActions,
  QuestionnaireChoice,
  QuestionnaireChoices,
  QuestionnaireDescription,
  QuestionnaireItem,
  QuestionnaireNext,
  QuestionnaireProgress,
  QuestionnaireTitle,
} from "@/components/ui/questionnaire"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { ResizableHandle, ResizablePanel, ResizablePanelGroup } from "@/components/ui/resizable"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Separator } from "@/components/ui/separator"
import { Sheet, SheetContent, SheetDescription, SheetFooter, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet"
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuBadge,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarProvider,
} from "@/components/ui/sidebar"
import { Skeleton } from "@/components/ui/skeleton"
import { Slider } from "@/components/ui/slider"
import { Spinner } from "@/components/ui/spinner"
import { Switch } from "@/components/ui/switch"
import { Table, TableBody, TableCaption, TableCell, TableFooter, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Textarea } from "@/components/ui/textarea"
import { Toaster, toast } from "@/components/ui/toast"
import { Toggle } from "@/components/ui/toggle"
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import {
  Trace,
  TraceCollapsible,
  TraceCollapsibleContent,
  TraceCollapsibleTrigger,
  TraceDescription,
  TraceIcon,
  TraceLine,
  TraceTitle,
} from "@/components/ui/trace"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

import { Icon, Row } from "./demos-a"
import type { Demo } from "./types"

const fruits = [
  { label: "Apple", value: "apple" },
  { label: "Banana", value: "banana" },
  { label: "Blueberry", value: "blueberry" },
  { label: "Grapes", value: "grapes" },
]

const invoices = [
  ["INV001", "Paid", "Credit card", "$250.00"],
  ["INV002", "Pending", "PayPal", "$150.00"],
  ["INV003", "Unpaid", "Bank transfer", "$350.00"],
  ["INV004", "Paid", "Credit card", "$450.00"],
]

export const DEMOS_B: Demo[] = [
  {
    id: "hover-card",
    name: "Hover Card",
    description: "Preview content on hover",
    examples: [
      {
        name: "Profile preview",
        render: () => (
          <HoverCard>
            <HoverCardTrigger render={<Button variant="link" />}>@drpatel</HoverCardTrigger>
            <HoverCardContent className="w-72">
              <div className="flex gap-3">
                <Avatar>
                  <AvatarFallback>DP</AvatarFallback>
                </Avatar>
                <div className="flex flex-col gap-1">
                  <div className="text-sm font-medium">Dr. Anika Patel</div>
                  <div className="text-muted-foreground text-sm">Family medicine · 12 years</div>
                </div>
              </div>
            </HoverCardContent>
          </HoverCard>
        ),
      },
    ],
  },
  {
    id: "input",
    name: "Input",
    description: "Single-line text entry",
    examples: [
      {
        name: "Basic",
        render: () => <Input placeholder="Search patients" className="max-w-sm" />,
      },
      {
        name: "States",
        render: () => (
          <div className="flex w-full max-w-sm flex-col gap-3">
            <Input defaultValue="Filled value" />
            <Input disabled placeholder="Disabled" />
            <Input aria-invalid defaultValue="Invalid value" />
          </div>
        ),
      },
      {
        name: "Types",
        render: () => (
          <div className="flex w-full max-w-sm flex-col gap-3">
            <Input type="email" placeholder="Email" />
            <Input type="password" defaultValue="secret" />
            <Input type="file" />
          </div>
        ),
      },
    ],
  },
  {
    id: "input-group",
    name: "Input Group",
    description: "Inputs with icons, text and buttons attached",
    examples: [
      {
        name: "With icon",
        render: () => (
          <InputGroup className="max-w-sm">
            <InputGroupInput placeholder="Search…" />
            <InputGroupAddon>
              <Icon icon={Search01Icon} />
            </InputGroupAddon>
          </InputGroup>
        ),
      },
      {
        name: "Text and button",
        render: () => (
          <InputGroup className="max-w-sm">
            <InputGroupAddon>
              <InputGroupText>https://</InputGroupText>
            </InputGroupAddon>
            <InputGroupInput placeholder="clinic.example.com" />
            <InputGroupAddon align="inline-end">
              <InputGroupButton aria-label="Copy" size="icon-xs">
                <Icon icon={Copy01Icon} />
              </InputGroupButton>
            </InputGroupAddon>
          </InputGroup>
        ),
      },
      {
        name: "Textarea",
        render: () => (
          <InputGroup className="max-w-md">
            <InputGroupTextarea placeholder="Write a note for your doctor…" />
            <InputGroupAddon align="block-end">
              <InputGroupText>0 / 280</InputGroupText>
              <InputGroupButton variant="default" size="sm" className="ml-auto">
                Send
              </InputGroupButton>
            </InputGroupAddon>
          </InputGroup>
        ),
      },
    ],
  },
  {
    id: "input-otp",
    name: "Input OTP",
    description: "One-time codes",
    examples: [
      {
        name: "Six digits",
        render: () => (
          <InputOTP maxLength={6} defaultValue="1234">
            <InputOTPGroup>
              <InputOTPSlot index={0} />
              <InputOTPSlot index={1} />
              <InputOTPSlot index={2} />
            </InputOTPGroup>
            <InputOTPSeparator />
            <InputOTPGroup>
              <InputOTPSlot index={3} />
              <InputOTPSlot index={4} />
              <InputOTPSlot index={5} />
            </InputOTPGroup>
          </InputOTP>
        ),
      },
    ],
  },
  {
    id: "item",
    name: "Item",
    description: "Rows of content with media and actions",
    examples: [
      {
        name: "Variants",
        render: () => (
          <div className="flex w-full max-w-md flex-col gap-3">
            {(["default", "outline", "muted"] as const).map((v) => (
              <Item key={v} variant={v}>
                <ItemMedia variant="icon">
                  <Icon icon={Calendar03Icon} />
                </ItemMedia>
                <ItemContent>
                  <ItemTitle>Annual check-up</ItemTitle>
                  <ItemDescription>{v} · Nov 20, 10:30 AM</ItemDescription>
                </ItemContent>
                <ItemActions>
                  <Button size="sm" variant="outline">
                    View
                  </Button>
                </ItemActions>
              </Item>
            ))}
          </div>
        ),
      },
      {
        name: "List",
        render: () => (
          <ItemGroup className="w-full max-w-md rounded-lg border">
            {["Dr. Anika Patel", "Dr. Marcus Lee", "Dr. Sofia Ruiz"].map((n, i) => (
              <React.Fragment key={n}>
                {i > 0 && <ItemSeparator />}
                <Item size="sm">
                  <ItemMedia>
                    <Avatar size="sm">
                      <AvatarFallback>{n.split(" ")[1][0]}</AvatarFallback>
                    </Avatar>
                  </ItemMedia>
                  <ItemContent>
                    <ItemTitle>{n}</ItemTitle>
                  </ItemContent>
                  <ItemActions>
                    <Badge variant="secondary">Available</Badge>
                  </ItemActions>
                </Item>
              </React.Fragment>
            ))}
          </ItemGroup>
        ),
      },
    ],
  },
  {
    id: "kbd",
    name: "Kbd",
    description: "Keyboard shortcuts",
    examples: [
      {
        name: "Keys",
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
            <Kbd>Esc</Kbd>
          </Row>
        ),
      },
      {
        name: "In a button",
        render: () => (
          <Button variant="outline">
            Search <Kbd>⌘K</Kbd>
          </Button>
        ),
      },
    ],
  },
  {
    id: "label",
    name: "Label",
    description: "Names a form control",
    examples: [
      {
        name: "Basic",
        render: () => (
          <div className="flex flex-col gap-2">
            <Label htmlFor="l-name">Full name</Label>
            <Input id="l-name" className="w-64" />
          </div>
        ),
      },
    ],
  },
  {
    id: "marker",
    name: "Marker",
    description: "Inline status markers and dividers",
    examples: [
      {
        name: "Variants",
        render: () => (
          <div className="flex w-full max-w-md flex-col gap-4">
            <Marker>
              <MarkerIcon>
                <Icon icon={CheckmarkCircle02Icon} />
              </MarkerIcon>
              <MarkerContent>Results reviewed by Dr. Patel</MarkerContent>
            </Marker>
            <Marker variant="separator">
              <MarkerContent>Today</MarkerContent>
            </Marker>
            <Marker variant="border">
              <MarkerIcon>
                <Icon icon={InformationCircleIcon} />
              </MarkerIcon>
              <MarkerContent>Visit rescheduled</MarkerContent>
            </Marker>
          </div>
        ),
      },
    ],
  },
  {
    id: "menubar",
    name: "Menubar",
    description: "A desktop-style menu bar",
    examples: [
      {
        name: "Basic",
        render: () => (
          <Menubar>
            <MenubarMenu>
              <MenubarTrigger>File</MenubarTrigger>
              <MenubarContent>
                <MenubarItem>
                  New record <MenubarShortcut>⌘N</MenubarShortcut>
                </MenubarItem>
                <MenubarItem>Open…</MenubarItem>
                <MenubarSeparator />
                <MenubarItem>Print</MenubarItem>
              </MenubarContent>
            </MenubarMenu>
            <MenubarMenu>
              <MenubarTrigger>View</MenubarTrigger>
              <MenubarContent>
                <MenubarCheckboxItem checked>Show sidebar</MenubarCheckboxItem>
                <MenubarCheckboxItem>Compact rows</MenubarCheckboxItem>
              </MenubarContent>
            </MenubarMenu>
          </Menubar>
        ),
      },
    ],
  },
  {
    id: "message",
    name: "Message",
    description: "Chat messages with avatar and metadata",
    examples: [
      {
        name: "Thread",
        render: () => (
          <MessageGroup className="w-full max-w-lg">
            <Message>
              <MessageAvatar>
                <Avatar size="sm">
                  <AvatarFallback>DP</AvatarFallback>
                </Avatar>
              </MessageAvatar>
              <MessageContent>
                <MessageHeader>Dr. Patel · 9:41 AM</MessageHeader>
                Your blood work looks great. Keep up the walking!
                <MessageFooter>Read</MessageFooter>
              </MessageContent>
            </Message>
            <Message align="end">
              <MessageContent>Thanks, will do. See you in June.</MessageContent>
            </Message>
          </MessageGroup>
        ),
      },
      {
        name: "Scrolling list",
        render: () => (
          <MessageScrollerProvider>
            <MessageScroller className="h-56 w-full max-w-md rounded-lg border">
              <MessageScrollerViewport>
                <MessageScrollerContent className="flex flex-col gap-3 p-3">
                  {Array.from({ length: 10 }, (_, i) => (
                    <MessageScrollerItem key={i}>
                      <Message align={i % 2 ? "end" : "start"}>
                        <MessageContent>Message {i + 1}</MessageContent>
                      </Message>
                    </MessageScrollerItem>
                  ))}
                </MessageScrollerContent>
              </MessageScrollerViewport>
            </MessageScroller>
          </MessageScrollerProvider>
        ),
      },
    ],
  },
  {
    id: "native-select",
    name: "Native Select",
    description: "The browser's own select, styled",
    examples: [
      {
        name: "Sizes",
        render: () => (
          <Row>
            <NativeSelect defaultValue="banana">
              {fruits.map((f) => (
                <NativeSelectOption key={f.value} value={f.value}>
                  {f.label}
                </NativeSelectOption>
              ))}
            </NativeSelect>
            <NativeSelect size="sm" defaultValue="apple">
              {fruits.map((f) => (
                <NativeSelectOption key={f.value} value={f.value}>
                  {f.label}
                </NativeSelectOption>
              ))}
            </NativeSelect>
            <NativeSelect disabled>
              <NativeSelectOption>Disabled</NativeSelectOption>
            </NativeSelect>
          </Row>
        ),
      },
    ],
  },
  {
    id: "navigation-menu",
    name: "Navigation Menu",
    description: "Site navigation with dropdown panels",
    examples: [
      {
        name: "Basic",
        render: () => (
          <NavigationMenu>
            <NavigationMenuList>
              <NavigationMenuItem>
                <NavigationMenuTrigger>Services</NavigationMenuTrigger>
                <NavigationMenuContent>
                  <ul className="grid w-80 gap-1 p-2">
                    {["Family medicine", "Lab work", "Physiotherapy"].map((s) => (
                      <li key={s}>
                        <NavigationMenuLink href="#">
                          <div className="font-medium">{s}</div>
                          <div className="text-muted-foreground text-xs">Book online in minutes</div>
                        </NavigationMenuLink>
                      </li>
                    ))}
                  </ul>
                </NavigationMenuContent>
              </NavigationMenuItem>
              <NavigationMenuItem>
                <NavigationMenuLink href="#">Locations</NavigationMenuLink>
              </NavigationMenuItem>
              <NavigationMenuItem>
                <NavigationMenuLink href="#">Contact</NavigationMenuLink>
              </NavigationMenuItem>
            </NavigationMenuList>
          </NavigationMenu>
        ),
      },
    ],
  },
  {
    id: "pagination",
    name: "Pagination",
    description: "Move between pages",
    examples: [
      {
        name: "Basic",
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
    ],
  },
  {
    id: "popover",
    name: "Popover",
    description: "Floating content next to a trigger",
    examples: [
      {
        name: "Details",
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
        name: "Form",
        render: () => (
          <Popover>
            <PopoverTrigger render={<Button variant="outline" />}>Set reminder</PopoverTrigger>
            <PopoverContent className="w-72">
              <div className="flex flex-col gap-3">
                <Field>
                  <FieldLabel htmlFor="p-time">Remind me</FieldLabel>
                  <Input id="p-time" defaultValue="1 day before" />
                </Field>
                <Button size="sm">Save</Button>
              </div>
            </PopoverContent>
          </Popover>
        ),
      },
    ],
  },
  {
    id: "progress",
    name: "Progress",
    description: "How far along a task is",
    examples: [
      {
        name: "Values",
        render: () => (
          <div className="flex w-full max-w-sm flex-col gap-4">
            <Progress value={25} />
            <Progress value={65} />
            <Progress value={90} />
          </div>
        ),
      },
      {
        name: "With label",
        render: () => (
          <Progress value={68} className="w-full max-w-sm">
            <ProgressLabel>Daily steps</ProgressLabel>
            <ProgressValue />
          </Progress>
        ),
      },
    ],
  },
  {
    id: "questionnaire",
    name: "Questionnaire",
    description: "Step-by-step forms",
    examples: [
      {
        name: "Intake form",
        render: () => (
          <Questionnaire className="w-full max-w-md">
            <QuestionnaireProgress />
            <QuestionnaireItem name="reason">
              <QuestionnaireTitle>What brings you in today?</QuestionnaireTitle>
              <QuestionnaireDescription>Pick the closest match.</QuestionnaireDescription>
              <QuestionnaireChoices>
                <QuestionnaireChoice value="checkup">Annual check-up</QuestionnaireChoice>
                <QuestionnaireChoice value="sick">Feeling unwell</QuestionnaireChoice>
                <QuestionnaireChoice value="followup">Follow-up visit</QuestionnaireChoice>
              </QuestionnaireChoices>
              <QuestionnaireActions>
                <QuestionnaireNext>Continue</QuestionnaireNext>
              </QuestionnaireActions>
            </QuestionnaireItem>
          </Questionnaire>
        ),
      },
    ],
  },
  {
    id: "radio-group",
    name: "Radio Group",
    description: "Pick one option",
    examples: [
      {
        name: "Basic",
        render: () => (
          <RadioGroup defaultValue="morning">
            {["Morning", "Afternoon", "Evening"].map((t) => (
              <Label key={t} className="gap-2">
                <RadioGroupItem value={t.toLowerCase()} /> {t}
              </Label>
            ))}
          </RadioGroup>
        ),
      },
      {
        name: "Cards",
        render: () => (
          <RadioGroup defaultValue="video" className="grid w-full max-w-md grid-cols-2 gap-3">
            {[
              ["in-person", "In person", "Visit the clinic"],
              ["video", "Video call", "From anywhere"],
            ].map(([v, t, d]) => (
              <Label key={v} className="hover:bg-muted/50 flex items-start gap-3 rounded-lg border p-3 has-data-checked:border-primary">
                <RadioGroupItem value={v} />
                <span className="flex flex-col gap-1">
                  <span className="font-medium">{t}</span>
                  <span className="text-muted-foreground text-xs font-normal">{d}</span>
                </span>
              </Label>
            ))}
          </RadioGroup>
        ),
      },
    ],
  },
  {
    id: "resizable",
    name: "Resizable",
    description: "Panels you can drag to resize",
    examples: [
      {
        name: "Horizontal",
        render: () => (
          <ResizablePanelGroup className="h-48 w-full max-w-lg rounded-lg border">
            <ResizablePanel defaultSize="35%">
              <div className="flex h-full items-center justify-center text-sm">Sidebar</div>
            </ResizablePanel>
            <ResizableHandle withHandle />
            <ResizablePanel>
              <div className="flex h-full items-center justify-center text-sm">Content</div>
            </ResizablePanel>
          </ResizablePanelGroup>
        ),
      },
    ],
  },
  {
    id: "scroll-area",
    name: "Scroll Area",
    description: "Scrolling with styled scrollbars",
    examples: [
      {
        name: "Vertical",
        render: () => (
          <ScrollArea className="h-48 w-56 rounded-md border">
            <div className="p-3">
              <div className="mb-2 text-sm font-medium">Medications</div>
              {Array.from({ length: 20 }, (_, i) => (
                <div key={i} className="border-b py-1.5 text-sm last:border-0">
                  Prescription #{1040 + i}
                </div>
              ))}
            </div>
          </ScrollArea>
        ),
      },
    ],
  },
  {
    id: "select",
    name: "Select",
    description: "Choose from a list",
    examples: [
      {
        name: "Basic",
        render: () => (
          <Select items={fruits} defaultValue="banana">
            <SelectTrigger className="w-48">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                <SelectLabel>Fruits</SelectLabel>
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
        name: "Sizes",
        render: () => (
          <Row>
            {(["default", "sm"] as const).map((size) => (
              <Select key={size} items={fruits} defaultValue="apple">
                <SelectTrigger size={size} className="w-40">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {fruits.map((f) => (
                    <SelectItem key={f.value} value={f.value}>
                      {f.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            ))}
          </Row>
        ),
      },
    ],
  },
  {
    id: "separator",
    name: "Separator",
    description: "Divides content",
    examples: [
      {
        name: "Horizontal and vertical",
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
    ],
  },
  {
    id: "sheet",
    name: "Sheet",
    description: "A panel that slides in from the edge",
    examples: [
      {
        name: "Sides",
        render: () => (
          <Row>
            {(["right", "left", "top", "bottom"] as const).map((side) => (
              <Sheet key={side}>
                <SheetTrigger render={<Button variant="outline" />}>{side}</SheetTrigger>
                <SheetContent side={side}>
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
            ))}
          </Row>
        ),
      },
    ],
  },
  {
    id: "sidebar",
    name: "Sidebar",
    description: "App navigation sidebar",
    examples: [
      {
        name: "Static",
        render: () => (
          <SidebarProvider className="min-h-0 w-auto">
            <Sidebar collapsible="none" className="h-80 rounded-lg border">
              <SidebarContent>
                <SidebarGroup>
                  <SidebarGroupLabel>Clinic</SidebarGroupLabel>
                  <SidebarGroupContent>
                    <SidebarMenu>
                      {[
                        [Home01Icon, "Home", false],
                        [DashboardSquare01Icon, "Dashboard", true],
                        [Calendar03Icon, "Appointments", false],
                        [Mail01Icon, "Messages", false],
                        [Settings02Icon, "Settings", false],
                      ].map(([icon, label, active]) => (
                        <SidebarMenuItem key={label as string}>
                          <SidebarMenuButton isActive={active as boolean}>
                            <Icon icon={icon as typeof Home01Icon} />
                            <span>{label as string}</span>
                          </SidebarMenuButton>
                          {label === "Messages" && <SidebarMenuBadge>3</SidebarMenuBadge>}
                        </SidebarMenuItem>
                      ))}
                    </SidebarMenu>
                  </SidebarGroupContent>
                </SidebarGroup>
              </SidebarContent>
            </Sidebar>
          </SidebarProvider>
        ),
      },
    ],
  },
  {
    id: "skeleton",
    name: "Skeleton",
    description: "Loading placeholders",
    examples: [
      {
        name: "Profile",
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
        name: "Card",
        render: () => (
          <div className="flex w-64 flex-col gap-3">
            <Skeleton className="h-32 w-full rounded-xl" />
            <Skeleton className="h-4 w-3/4" />
            <Skeleton className="h-4 w-1/2" />
          </div>
        ),
      },
    ],
  },
  {
    id: "slider",
    name: "Slider",
    description: "Pick a value in a range",
    examples: [
      {
        name: "Single and range",
        render: () => (
          <div className="flex w-full max-w-sm flex-col gap-6">
            <Slider defaultValue={[40]} />
            <Slider defaultValue={[20, 70]} />
            <Slider defaultValue={[50]} disabled />
          </div>
        ),
      },
    ],
  },
  {
    id: "spinner",
    name: "Spinner",
    description: "Something is loading",
    examples: [
      {
        name: "Sizes",
        render: () => (
          <Row>
            <Spinner />
            <Spinner className="size-6" />
            <Spinner className="text-primary size-8" />
          </Row>
        ),
      },
      {
        name: "In a button",
        render: () => (
          <Button disabled>
            <Spinner /> Loading results
          </Button>
        ),
      },
    ],
  },
  {
    id: "switch",
    name: "Switch",
    description: "On and off settings",
    examples: [
      {
        name: "Basic",
        render: () => (
          <div className="flex flex-col gap-3">
            <Label className="gap-2">
              <Switch defaultChecked /> Share records with my doctor
            </Label>
            <Label className="gap-2">
              <Switch /> Dark mode
            </Label>
            <Label className="gap-2">
              <Switch disabled /> Disabled
            </Label>
          </div>
        ),
      },
      {
        name: "Sizes",
        render: () => (
          <Row>
            <Switch size="sm" defaultChecked />
            <Switch defaultChecked />
          </Row>
        ),
      },
      {
        name: "With description",
        render: () => (
          <Field orientation="horizontal" className="max-w-sm">
            <div className="flex flex-1 flex-col gap-1">
              <FieldLabel htmlFor="sw-r">Appointment reminders</FieldLabel>
              <FieldDescription>A text the day before each visit.</FieldDescription>
            </div>
            <Switch id="sw-r" defaultChecked />
          </Field>
        ),
      },
    ],
  },
  {
    id: "table",
    name: "Table",
    description: "Rows and columns of data",
    examples: [
      {
        name: "Invoices",
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
              {invoices.map(([id, status, method, amount]) => (
                <TableRow key={id}>
                  <TableCell className="font-medium">{id}</TableCell>
                  <TableCell>
                    <Badge variant={status === "Paid" ? "default" : status === "Pending" ? "secondary" : "outline"}>{status}</Badge>
                  </TableCell>
                  <TableCell>{method}</TableCell>
                  <TableCell className="text-right">{amount}</TableCell>
                </TableRow>
              ))}
            </TableBody>
            <TableFooter>
              <TableRow>
                <TableCell colSpan={3}>Total</TableCell>
                <TableCell className="text-right">$1,200.00</TableCell>
              </TableRow>
            </TableFooter>
          </Table>
        ),
      },
    ],
  },
  {
    id: "tabs",
    name: "Tabs",
    description: "Switch between views",
    examples: [
      {
        name: "Default",
        render: () => (
          <Tabs defaultValue="overview" className="w-full max-w-md">
            <TabsList>
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="visits">Visits</TabsTrigger>
              <TabsTrigger value="billing">Billing</TabsTrigger>
            </TabsList>
            {["overview", "visits", "billing"].map((v) => (
              <TabsContent key={v} value={v}>
                <Card>
                  <CardHeader>
                    <CardTitle className="capitalize">{v}</CardTitle>
                    <CardDescription>Content for {v}.</CardDescription>
                  </CardHeader>
                  <CardContent />
                </Card>
              </TabsContent>
            ))}
          </Tabs>
        ),
      },
      {
        name: "Line",
        render: () => (
          <Tabs defaultValue="a" className="w-full max-w-md">
            <TabsList variant="line">
              <TabsTrigger value="a">Summary</TabsTrigger>
              <TabsTrigger value="b">Notes</TabsTrigger>
              <TabsTrigger value="c">Files</TabsTrigger>
            </TabsList>
          </Tabs>
        ),
      },
    ],
  },
  {
    id: "textarea",
    name: "Textarea",
    description: "Multi-line text",
    examples: [
      {
        name: "Basic",
        render: () => (
          <Field className="w-full max-w-sm">
            <FieldLabel htmlFor="t-notes">Notes for your doctor</FieldLabel>
            <Textarea id="t-notes" placeholder="Describe your symptoms..." />
          </Field>
        ),
      },
      {
        name: "States",
        render: () => (
          <div className="flex w-full max-w-sm flex-col gap-3">
            <Textarea disabled placeholder="Disabled" />
            <Textarea aria-invalid defaultValue="Too short" />
          </div>
        ),
      },
    ],
  },
  {
    id: "toast",
    name: "Toast",
    description: "Short messages that pop up and go away",
    examples: [
      {
        name: "Types",
        render: () => (
          <Toaster>
            <Row>
              <Button
                variant="outline"
                onClick={() =>
                  toast.add({
                    title: "Saved",
                    description: "Your changes are saved.",
                  })
                }
              >
                Default
              </Button>
              <Button variant="outline" onClick={() => toast.add({ title: "Visit booked", type: "success" })}>
                Success
              </Button>
              <Button variant="outline" onClick={() => toast.add({ title: "Card expires soon", type: "warning" })}>
                Warning
              </Button>
              <Button variant="outline" onClick={() => toast.add({ title: "Payment failed", type: "error" })}>
                Error
              </Button>
            </Row>
          </Toaster>
        ),
      },
    ],
  },
  {
    id: "toggle",
    name: "Toggle",
    description: "A button that stays pressed",
    examples: [
      {
        name: "Variants",
        render: () => (
          <Row>
            <Toggle aria-label="Bold" defaultPressed>
              <Icon icon={TextBoldIcon} />
            </Toggle>
            <Toggle variant="outline" aria-label="Italic">
              <Icon icon={TextItalicIcon} />
            </Toggle>
            <Toggle aria-label="Underline">
              <Icon icon={TextUnderlineIcon} /> Underline
            </Toggle>
          </Row>
        ),
      },
      {
        name: "Sizes",
        render: () => (
          <Row>
            {(["sm", "default", "lg"] as const).map((s) => (
              <Toggle key={s} size={s} variant="outline" aria-label={s}>
                {s}
              </Toggle>
            ))}
          </Row>
        ),
      },
    ],
  },
  {
    id: "toggle-group",
    name: "Toggle Group",
    description: "A set of toggles",
    examples: [
      {
        name: "Single choice",
        render: () => (
          <ToggleGroup defaultValue={["week"]} variant="outline">
            <ToggleGroupItem value="day">Day</ToggleGroupItem>
            <ToggleGroupItem value="week">Week</ToggleGroupItem>
            <ToggleGroupItem value="month">Month</ToggleGroupItem>
          </ToggleGroup>
        ),
      },
      {
        name: "Multiple",
        render: () => (
          <ToggleGroup multiple defaultValue={["bold"]}>
            <ToggleGroupItem value="bold" aria-label="Bold">
              <Icon icon={TextBoldIcon} />
            </ToggleGroupItem>
            <ToggleGroupItem value="italic" aria-label="Italic">
              <Icon icon={TextItalicIcon} />
            </ToggleGroupItem>
            <ToggleGroupItem value="underline" aria-label="Underline">
              <Icon icon={TextUnderlineIcon} />
            </ToggleGroupItem>
          </ToggleGroup>
        ),
      },
    ],
  },
  {
    id: "tooltip",
    name: "Tooltip",
    description: "Hints on hover",
    examples: [
      {
        name: "Basic",
        render: () => (
          <TooltipProvider>
            <Row>
              <Tooltip>
                <TooltipTrigger render={<Button variant="outline" />}>Hover me</TooltipTrigger>
                <TooltipContent>Add to your calendar</TooltipContent>
              </Tooltip>
              <Tooltip>
                <TooltipTrigger render={<Button variant="outline" size="icon" aria-label="Add" />}>
                  <Icon icon={Add01Icon} />
                </TooltipTrigger>
                <TooltipContent side="bottom">New visit</TooltipContent>
              </Tooltip>
            </Row>
          </TooltipProvider>
        ),
      },
    ],
  },
  {
    id: "trace",
    name: "Trace",
    description: "Steps of a process with status",
    examples: [
      {
        name: "Steps",
        render: () => (
          <Trace className="w-full max-w-md">
            <TraceLine>
              <TraceIcon>
                <Icon icon={CheckmarkCircle02Icon} />
              </TraceIcon>
              <TraceTitle>Referral received</TraceTitle>
              <TraceDescription>Nov 12</TraceDescription>
            </TraceLine>
            <TraceLine status="running">
              <TraceIcon>
                <Icon icon={Stethoscope02Icon} />
              </TraceIcon>
              <TraceTitle>Specialist reviewing</TraceTitle>
            </TraceLine>
            <TraceLine status="pending">
              <TraceIcon>
                <Icon icon={Calendar03Icon} />
              </TraceIcon>
              <TraceTitle>Book appointment</TraceTitle>
            </TraceLine>
            <TraceLine status="error">
              <TraceIcon>
                <Icon icon={Alert02Icon} />
              </TraceIcon>
              <TraceTitle>Insurance check failed</TraceTitle>
            </TraceLine>
            <TraceCollapsible>
              <TraceCollapsibleTrigger>Show details</TraceCollapsibleTrigger>
              <TraceCollapsibleContent>
                <div className="text-muted-foreground flex items-center gap-2 text-sm">
                  <Icon icon={File01Icon} /> Policy number didn’t match. <Icon icon={UserIcon} />
                </div>
              </TraceCollapsibleContent>
            </TraceCollapsible>
          </Trace>
        ),
      },
    ],
  },
]
