"use client"

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"
import { Avatar, AvatarFallback, AvatarGroup, AvatarGroupCount } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
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
import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@/components/ui/empty"
import { InputGroup, InputGroupAddon, InputGroupInput, InputGroupText } from "@/components/ui/input-group"
import { Input } from "@/components/ui/input"
import {
  Item,
  ItemActions,
  ItemContent,
  ItemDescription,
  ItemGroup,
  ItemMedia,
  ItemTitle,
} from "@/components/ui/item"
import { Label } from "@/components/ui/label"
import { Progress } from "@/components/ui/progress"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Separator } from "@/components/ui/separator"
import { Slider } from "@/components/ui/slider"
import { Spinner } from "@/components/ui/spinner"
import { Switch } from "@/components/ui/switch"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Textarea } from "@/components/ui/textarea"
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group"
import {
  ArrowRight01Icon,
  Calendar03Icon,
  DashboardSquare01Icon,
  FileAttachmentIcon,
  Home01Icon,
  HugeiconsIcon,
  InformationCircleIcon,
  Mail01Icon,
  Notification03Icon,
  Settings02Icon,
  UserIcon,
} from "@/lib/ds/icons"

/* ---------- data ---------- */

const history = [
  { month: "Dec", bar: "bg-primary/30 h-20 w-full rounded-md" },
  { month: "Jan", bar: "bg-primary/30 h-28 w-full rounded-md" },
  { month: "Feb", bar: "bg-primary/30 h-24 w-full rounded-md" },
  { month: "Mar", bar: "bg-primary/30 h-32 w-full rounded-md" },
  { month: "Apr", bar: "bg-primary/30 h-16 w-full rounded-md" },
  { month: "May", bar: "bg-primary h-36 w-full rounded-md" },
]

const transactions = [
  { name: "Corner Coffee Co.", category: "Food & Drink", date: "Today", amount: "-$6.50", positive: false },
  { name: "Greenleaf Market", category: "Groceries", date: "Yesterday", amount: "-$142.30", positive: false },
  { name: "Client payout", category: "Income", date: "Oct 12", amount: "+$4,200.00", positive: true },
  { name: "City Rideshare", category: "Transport", date: "Oct 11", amount: "-$24.10", positive: false },
  { name: "Streamly Plus", category: "Entertainment", date: "Oct 10", amount: "-$19.99", positive: false },
]

const dividends = [
  { name: "Global Index Fund", shares: "42 shares", amount: "$128.40" },
  { name: "Utilities ETF", shares: "18 shares", amount: "$64.10" },
  { name: "Dividend Growth Fund", shares: "30 shares", amount: "$92.75" },
  { name: "Bond Income Fund", shares: "55 shares", amount: "$41.20" },
]

const currencies = [
  { label: "USD - US Dollar", value: "usd" },
  { label: "EUR - Euro", value: "eur" },
  { label: "GBP - British Pound", value: "gbp" },
  { label: "CAD - Canadian Dollar", value: "cad" },
]

const frequencies = [
  { label: "Weekly", value: "weekly" },
  { label: "Every two weeks", value: "biweekly" },
  { label: "Monthly", value: "monthly" },
]

/* A fixed 11 x 11 pattern standing in for a QR code (1 = filled). */
const qrRows = [
  "11111010111",
  "10001001101",
  "10101011011",
  "10001010001",
  "11111010111",
  "00000011000",
  "10110101101",
  "01011100110",
  "11100101011",
  "00101110100",
  "11011010111",
]
const qrCells = qrRows.flatMap((row, r) => row.split("").map((bit, c) => ({ key: r * 11 + c, on: bit === "1" })))

const navGroups = [
  {
    label: "Overview",
    links: [
      { label: "Home", icon: Home01Icon },
      { label: "Dashboard", icon: DashboardSquare01Icon },
      { label: "Notifications", icon: Notification03Icon },
    ],
  },
  {
    label: "Account",
    links: [
      { label: "Profile", icon: UserIcon },
      { label: "Settings", icon: Settings02Icon },
    ],
  },
  {
    label: "Support",
    links: [
      { label: "Help centre", icon: InformationCircleIcon },
      { label: "Contact us", icon: Mail01Icon },
    ],
  },
] as const

const lightControls = [
  { label: "Brightness", value: 72, display: "72%" },
  { label: "Colour temperature", value: 45, display: "3,800K" },
  { label: "Speaker volume", value: 30, display: "30%" },
  { label: "Fade duration", value: 20, display: "2s" },
]

/* ---------- cards ---------- */

function ContributionHistoryCard() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Contribution history</CardTitle>
        <CardDescription>Last 6 months of activity</CardDescription>
      </CardHeader>
      <CardContent className="gap-6">
        <div className="flex h-40 items-end gap-3">
          {history.map((item) => (
            <div key={item.month} className="flex flex-1 flex-col items-center gap-2">
              <div className={item.bar} />
              <span className="text-muted-foreground text-xs">{item.month}</span>
            </div>
          ))}
        </div>
        <div className="grid grid-cols-2 gap-3">
          <div className="bg-muted/60 flex flex-col gap-1 rounded-lg p-3">
            <span className="text-muted-foreground text-xs">Upcoming</span>
            <span className="font-medium">Nov 28</span>
          </div>
          <div className="bg-muted/60 flex flex-col gap-1 rounded-lg p-3">
            <span className="text-muted-foreground text-xs">Auto-save plan</span>
            <span className="font-medium">$250 / month</span>
          </div>
        </div>
      </CardContent>
      <CardFooter>
        <Button className="w-full">View full report</Button>
      </CardFooter>
    </Card>
  )
}

function UploadStatementCard() {
  return (
    <Card>
      <CardContent>
        <Empty className="p-6">
          <EmptyHeader>
            <EmptyMedia variant="icon">
              <HugeiconsIcon icon={FileAttachmentIcon} />
            </EmptyMedia>
            <EmptyTitle>Import a statement</EmptyTitle>
            <EmptyDescription>
              Upload a CSV or PDF from your bank and we&apos;ll categorise every transaction for you.
            </EmptyDescription>
          </EmptyHeader>
          <EmptyContent>
            <Button>Upload statement</Button>
          </EmptyContent>
        </Empty>
      </CardContent>
    </Card>
  )
}

function ScanToConnectCard() {
  return (
    <Card>
      <CardHeader className="text-center">
        <CardTitle>Scan to connect your mobile device</CardTitle>
        <CardDescription>Open the app on your phone and point the camera at the code.</CardDescription>
      </CardHeader>
      <CardContent className="items-center">
        <div className="bg-background rounded-xl border p-3">
          <div className="grid size-40 grid-cols-11 gap-px">
            {qrCells.map((cell) => (
              <div key={cell.key} className={cell.on ? "bg-foreground rounded-xs" : "bg-background"} />
            ))}
          </div>
        </div>
        <span className="text-muted-foreground text-xs">Code expires in 4:59</span>
      </CardContent>
      <CardFooter>
        <Button variant="outline" className="w-full">
          Got it
        </Button>
      </CardFooter>
    </Card>
  )
}

function DividendIncomeCard() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Dividend income</CardTitle>
        <CardDescription>Paid out this quarter</CardDescription>
        <CardAction>
          <Badge variant="secondary">$326.45</Badge>
        </CardAction>
      </CardHeader>
      <CardContent>
        <ItemGroup className="gap-0">
          {dividends.map((d, i) => (
            <div key={d.name}>
              {i > 0 && <Separator />}
              <Item size="sm" className="px-0">
                <ItemContent>
                  <ItemTitle>{d.name}</ItemTitle>
                  <ItemDescription>{d.shares}</ItemDescription>
                </ItemContent>
                <ItemActions>
                  <span className="font-medium tabular-nums">{d.amount}</span>
                </ItemActions>
              </Item>
            </div>
          ))}
        </ItemGroup>
      </CardContent>
    </Card>
  )
}

function ExplainerCard() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>What is dollar-cost averaging?</CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-muted-foreground leading-relaxed">
          Instead of investing a lump sum all at once, you invest a fixed amount on a regular
          schedule. When prices dip your money buys more shares, and when they rise it buys fewer,
          which smooths out the price you pay over time.
        </p>
      </CardContent>
      <CardFooter>
        <Button variant="link" className="px-0">
          Learn more
          <HugeiconsIcon icon={ArrowRight01Icon} data-icon="inline-end" />
        </Button>
      </CardFooter>
    </Card>
  )
}

function SyncingCard() {
  return (
    <Card>
      <CardContent className="items-center gap-4 py-4 text-center">
        <Spinner className="size-6" />
        <div className="flex flex-col gap-1">
          <span className="font-medium">Syncing your accounts</span>
          <span className="text-muted-foreground">
            This can take a minute. You can keep using the app while we finish.
          </span>
        </div>
        <Button variant="outline" size="sm">
          Cancel
        </Button>
      </CardContent>
    </Card>
  )
}

function PayoutThresholdCard() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Payout threshold</CardTitle>
        <CardDescription>Set the minimum balance before a payout is triggered.</CardDescription>
      </CardHeader>
      <CardContent className="gap-5">
        <div className="flex flex-col gap-2">
          <Label>Currency</Label>
          <Select items={currencies} defaultValue="usd">
            <SelectTrigger className="w-full">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {currencies.map((c) => (
                <SelectItem key={c.value} value={c.value}>
                  {c.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="flex flex-col gap-3">
          <div className="flex items-center justify-between">
            <Label>Threshold</Label>
            <span className="text-sm font-medium tabular-nums">$2,500</span>
          </div>
          <Slider defaultValue={[25]} max={100} step={1} aria-label="Threshold" />
          <div className="text-muted-foreground flex justify-between text-xs">
            <span>$100</span>
            <span>$10,000</span>
          </div>
        </div>
        <div className="flex flex-col gap-2">
          <Label htmlFor="payout-amount">Minimum payout amount</Label>
          <Input id="payout-amount" defaultValue="2500.00" />
        </div>
        <div className="flex flex-col gap-2">
          <Label htmlFor="payout-notes">Notes</Label>
          <Textarea id="payout-notes" placeholder="Add any notes for this payout..." />
        </div>
      </CardContent>
      <CardFooter className="gap-2">
        <Button variant="outline">Cancel</Button>
        <Button className="flex-1">Save threshold</Button>
      </CardFooter>
    </Card>
  )
}

function ClaimableBalanceCard() {
  return (
    <Card>
      <CardHeader>
        <CardDescription>Claimable balance</CardDescription>
        <CardTitle className="text-3xl font-semibold tabular-nums">$1,284.60</CardTitle>
        <CardAction>
          <Badge variant="outline">Pending setup</Badge>
        </CardAction>
      </CardHeader>
      <CardContent className="gap-2">
        {[
          { label: "Referral rewards", value: "$840.00" },
          { label: "Cashback", value: "$312.60" },
          { label: "Interest", value: "$132.00" },
        ].map((row) => (
          <div key={row.label} className="flex justify-between">
            <span className="text-muted-foreground">{row.label}</span>
            <span className="tabular-nums">{row.value}</span>
          </div>
        ))}
        <Separator className="my-1" />
        <div className="flex justify-between font-medium">
          <span>Total</span>
          <span className="tabular-nums">$1,284.60</span>
        </div>
      </CardContent>
      <CardFooter className="flex-col items-stretch gap-3">
        <Button className="w-full">Set up payouts</Button>
        <span className="text-muted-foreground text-xs">
          Add a payout account to claim your balance. Funds arrive in 2-3 business days.
        </span>
      </CardFooter>
    </Card>
  )
}

function PreferencesCard() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Preferences</CardTitle>
        <CardDescription>Choose how your savings plan runs.</CardDescription>
      </CardHeader>
      <CardContent className="gap-5">
        <div className="flex flex-col gap-2">
          <Label>Contribution frequency</Label>
          <Select items={frequencies} defaultValue="monthly">
            <SelectTrigger className="w-full">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {frequencies.map((f) => (
                <SelectItem key={f.value} value={f.value}>
                  {f.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="flex items-start justify-between gap-4">
          <div className="flex flex-col gap-1">
            <Label htmlFor="round-ups">Round-ups</Label>
            <span className="text-muted-foreground text-sm">Save the spare change from every purchase.</span>
          </div>
          <Switch id="round-ups" defaultChecked />
        </div>
        <div className="flex items-start justify-between gap-4">
          <div className="flex flex-col gap-1">
            <Label htmlFor="pause-low">Pause when balance is low</Label>
            <span className="text-muted-foreground text-sm">Skip a transfer if checking drops below $500.</span>
          </div>
          <Switch id="pause-low" />
        </div>
      </CardContent>
      <CardFooter className="justify-end gap-2">
        <Button variant="ghost">Reset</Button>
        <Button>Save</Button>
      </CardFooter>
    </Card>
  )
}

function SavingsGoalCard() {
  return (
    <Card>
      <CardHeader>
        <CardDescription>Emergency fund</CardDescription>
        <CardTitle className="text-3xl font-semibold tabular-nums">$24,000</CardTitle>
      </CardHeader>
      <CardContent className="gap-4">
        <div className="flex flex-col gap-2">
          <Progress value={80} aria-label="Goal progress" />
          <span className="text-muted-foreground text-sm">80% of $30,000</span>
        </div>
        <div className="flex flex-col gap-2">
          <div className="flex justify-between">
            <span className="text-muted-foreground">Projected finish</span>
            <span>Apr 2027</span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">Monthly average</span>
            <span className="tabular-nums">$1,150</span>
          </div>
        </div>
        <Separator />
        <div className="flex items-center justify-between gap-4">
          <div className="flex flex-col">
            <span className="text-muted-foreground text-xs">Top contributor</span>
            <span className="font-medium">Jordan P.</span>
          </div>
          <AvatarGroup>
            <Avatar size="sm">
              <AvatarFallback>JP</AvatarFallback>
            </Avatar>
            <Avatar size="sm">
              <AvatarFallback>AM</AvatarFallback>
            </Avatar>
            <Avatar size="sm">
              <AvatarFallback>RK</AvatarFallback>
            </Avatar>
            <AvatarGroupCount>+2</AvatarGroupCount>
          </AvatarGroup>
        </div>
      </CardContent>
    </Card>
  )
}

function LightControlCard() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Living room lights</CardTitle>
        <CardDescription>4 bulbs connected</CardDescription>
        <CardAction>
          <Switch defaultChecked aria-label="Lights on" />
        </CardAction>
      </CardHeader>
      <CardContent className="gap-5">
        <ToggleGroup defaultValue={["relax"]} variant="outline" size="sm" className="w-full">
          <ToggleGroupItem value="focus" className="flex-1">
            Focus
          </ToggleGroupItem>
          <ToggleGroupItem value="relax" className="flex-1">
            Relax
          </ToggleGroupItem>
          <ToggleGroupItem value="night" className="flex-1">
            Night
          </ToggleGroupItem>
        </ToggleGroup>
        {lightControls.map((c) => (
          <div key={c.label} className="flex flex-col gap-3">
            <div className="flex items-center justify-between text-sm">
              <span>{c.label}</span>
              <span className="text-muted-foreground tabular-nums">{c.display}</span>
            </div>
            <Slider defaultValue={[c.value]} max={100} step={1} aria-label={c.label} />
          </div>
        ))}
      </CardContent>
    </Card>
  )
}

function SavingsTargetsCard() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Savings targets</CardTitle>
        <CardDescription>Active milestones for this year</CardDescription>
        <CardAction>
          <Button variant="outline" size="sm">
            New goal
          </Button>
        </CardAction>
      </CardHeader>
      <CardContent className="gap-5">
        {[
          { label: "Retirement", total: "$420,000", pct: 65, saved: "$273,000" },
          { label: "Real estate", total: "$85,000", pct: 32, saved: "$27,200" },
          { label: "Travel", total: "$6,000", pct: 54, saved: "$3,240" },
        ].map((goal) => (
          <div key={goal.label} className="flex flex-col gap-2">
            <span className="text-muted-foreground text-xs font-medium tracking-wide uppercase">
              {goal.label}
            </span>
            <span className="text-2xl font-semibold tabular-nums">{goal.total}</span>
            <Progress value={goal.pct} aria-label={goal.label} />
            <div className="text-muted-foreground flex justify-between text-sm">
              <span>{goal.pct}% achieved</span>
              <span className="tabular-nums">{goal.saved}</span>
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  )
}

function BuyOrderCard() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Buy Global Index Fund</CardTitle>
        <CardDescription>Market price $86.42 per share</CardDescription>
      </CardHeader>
      <CardContent className="gap-5">
        <div className="flex flex-col gap-2">
          <Label htmlFor="order-amount">Amount</Label>
          <InputGroup>
            <InputGroupAddon>
              <InputGroupText>$</InputGroupText>
            </InputGroupAddon>
            <InputGroupInput id="order-amount" defaultValue="500.00" inputMode="decimal" />
            <InputGroupAddon align="inline-end">
              <InputGroupText>USD</InputGroupText>
            </InputGroupAddon>
          </InputGroup>
        </div>
        <div className="flex flex-col gap-3">
          <Label>Order type</Label>
          <RadioGroup defaultValue="market">
            <div className="flex items-center gap-3">
              <RadioGroupItem value="market" id="order-market" />
              <Label htmlFor="order-market">Market order</Label>
            </div>
            <div className="flex items-center gap-3">
              <RadioGroupItem value="limit" id="order-limit" />
              <Label htmlFor="order-limit">Limit order</Label>
            </div>
            <div className="flex items-center gap-3">
              <RadioGroupItem value="recurring" id="order-recurring" />
              <Label htmlFor="order-recurring">Recurring buy</Label>
            </div>
          </RadioGroup>
        </div>
        <div className="bg-muted/60 flex flex-col gap-2 rounded-lg p-3">
          <div className="flex justify-between">
            <span className="text-muted-foreground">Estimated shares</span>
            <span className="tabular-nums">5.786</span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">Buying power</span>
            <span className="tabular-nums">$3,920.15</span>
          </div>
        </div>
      </CardContent>
      <CardFooter>
        <Button className="w-full">Review order</Button>
      </CardFooter>
    </Card>
  )
}

function RecentTransactionsCard() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Recent transactions</CardTitle>
        <CardDescription>Your latest account activity</CardDescription>
        <CardAction>
          <Button variant="ghost" size="sm">
            View all
          </Button>
        </CardAction>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Merchant</TableHead>
              <TableHead className="hidden sm:table-cell">Date</TableHead>
              <TableHead className="text-right">Amount</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {transactions.map((t) => (
              <TableRow key={t.name}>
                <TableCell>
                  <div className="flex flex-col">
                    <span className="font-medium">{t.name}</span>
                    <span className="text-muted-foreground text-xs">{t.category}</span>
                  </div>
                </TableCell>
                <TableCell className="hidden sm:table-cell">
                  <span className="text-muted-foreground">{t.date}</span>
                </TableCell>
                <TableCell className="text-right">
                  <span className={t.positive ? "text-primary font-medium tabular-nums" : "font-medium tabular-nums"}>
                    {t.amount}
                  </span>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  )
}

function NavigationCard() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Menu</CardTitle>
      </CardHeader>
      <CardContent className="gap-4">
        {navGroups.map((group) => (
          <div key={group.label} className="flex flex-col gap-1">
            <span className="text-muted-foreground px-2 text-xs font-medium">{group.label}</span>
            <ItemGroup className="gap-0">
              {group.links.map((link) => (
                <Item key={link.label} size="xs" render={<a href="#" />}>
                  <ItemMedia variant="icon">
                    <HugeiconsIcon icon={link.icon} className="size-4" />
                  </ItemMedia>
                  <ItemContent>
                    <ItemTitle>{link.label}</ItemTitle>
                  </ItemContent>
                </Item>
              ))}
            </ItemGroup>
          </div>
        ))}
      </CardContent>
    </Card>
  )
}

function FaqCard() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Frequently asked questions</CardTitle>
      </CardHeader>
      <CardContent>
        <Accordion defaultValue={["fees"]}>
          <AccordionItem value="fees">
            <AccordionTrigger>Are there any account fees?</AccordionTrigger>
            <AccordionContent>
              No monthly fees. A small spread applies to currency conversions, shown before you confirm.
            </AccordionContent>
          </AccordionItem>
          <AccordionItem value="withdraw">
            <AccordionTrigger>How quickly can I withdraw?</AccordionTrigger>
            <AccordionContent>
              Withdrawals to a linked bank account usually arrive within 1-2 business days.
            </AccordionContent>
          </AccordionItem>
          <AccordionItem value="safe">
            <AccordionTrigger>Is my money protected?</AccordionTrigger>
            <AccordionContent>
              Cash balances are held with partner banks and covered up to the applicable insurance limit.
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </CardContent>
    </Card>
  )
}

function AccountTabsCard() {
  return (
    <Card>
      <CardContent>
        <Tabs defaultValue="general">
          <TabsList className="w-full">
            <TabsTrigger value="general" className="flex-1">
              General
            </TabsTrigger>
            <TabsTrigger value="billing" className="flex-1">
              Billing
            </TabsTrigger>
            <TabsTrigger value="goals" className="flex-1">
              Goals
            </TabsTrigger>
          </TabsList>
          <TabsContent value="general" className="flex flex-col gap-4 pt-2">
            <div className="flex flex-col gap-2">
              <Label htmlFor="tab-name">Display name</Label>
              <Input id="tab-name" defaultValue="Jordan Park" />
            </div>
            <div className="flex flex-col gap-2">
              <Label htmlFor="tab-email">Email</Label>
              <Input id="tab-email" type="email" defaultValue="jordan@example.com" />
            </div>
            <Button className="w-fit">Save changes</Button>
          </TabsContent>
          <TabsContent value="billing" className="flex flex-col gap-2 pt-2">
            <span className="font-medium">Plus plan</span>
            <span className="text-muted-foreground">$4.99 / month, renews Dec 1.</span>
            <Button variant="outline" className="w-fit">
              Manage plan
            </Button>
          </TabsContent>
          <TabsContent value="goals" className="flex flex-col gap-2 pt-2">
            <span className="font-medium">3 active goals</span>
            <span className="text-muted-foreground">You&apos;re on track for 2 of them this month.</span>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  )
}

function UpcomingBillsCard() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Upcoming bills</CardTitle>
        <CardDescription>Next 14 days</CardDescription>
      </CardHeader>
      <CardContent>
        <ItemGroup className="gap-2">
          {[
            { name: "Rent", due: "Due Dec 1", amount: "$1,850.00" },
            { name: "Electricity", due: "Due Nov 24", amount: "$86.20" },
            { name: "Phone plan", due: "Due Nov 27", amount: "$45.00" },
          ].map((bill) => (
            <Item key={bill.name} variant="outline" size="sm">
              <ItemMedia variant="icon">
                <HugeiconsIcon icon={Calendar03Icon} className="size-4" />
              </ItemMedia>
              <ItemContent>
                <ItemTitle>{bill.name}</ItemTitle>
                <ItemDescription>{bill.due}</ItemDescription>
              </ItemContent>
              <ItemActions>
                <span className="font-medium tabular-nums">{bill.amount}</span>
              </ItemActions>
            </Item>
          ))}
        </ItemGroup>
      </CardContent>
    </Card>
  )
}

/* ---------- page ---------- */

export function MedicalOverview() {
  return (
    <main className="bg-muted/40 min-h-screen p-6 md:p-8">
      <div className="columns-1 gap-6 *:mb-6 *:break-inside-avoid md:columns-2 xl:columns-3">
        <ContributionHistoryCard />
        <UploadStatementCard />
        <PayoutThresholdCard />
        <DividendIncomeCard />
        <ScanToConnectCard />
        <ExplainerCard />
        <ClaimableBalanceCard />
        <SyncingCard />
        <PreferencesCard />
        <SavingsGoalCard />
        <LightControlCard />
        <SavingsTargetsCard />
        <BuyOrderCard />
        <RecentTransactionsCard />
        <NavigationCard />
        <FaqCard />
        <AccountTabsCard />
        <UpcomingBillsCard />
      </div>
    </main>
  )
}
