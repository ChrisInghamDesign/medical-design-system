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
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

const history = [
  { month: "Dec", value: 55 },
  { month: "Jan", value: 75 },
  { month: "Feb", value: 65 },
  { month: "Mar", value: 90 },
  { month: "Apr", value: 50 },
  { month: "May", value: 100 },
]

const transactions = [
  { name: "Blue Bottle Coffee", category: "Food & Drink", date: "Today, 10:24 AM", amount: "-$6.50" },
  { name: "Whole Foods Market", category: "Groceries", date: "Yesterday", amount: "-$142.30" },
  { name: "Stripe Payout", category: "Income", date: "Oct 12", amount: "+$4,200.00" },
  { name: "Uber Technologies", category: "Transport", date: "Oct 11", amount: "-$24.10" },
  { name: "Netflix Subscription", category: "Entertainment", date: "Oct 10", amount: "-$19.99" },
]

const swatches = [
  { name: "Background", className: "bg-background" },
  { name: "Foreground", className: "bg-foreground" },
  { name: "Primary", className: "bg-primary" },
  { name: "Secondary", className: "bg-secondary" },
  { name: "Muted", className: "bg-muted" },
  { name: "Accent", className: "bg-accent" },
  { name: "Destructive", className: "bg-destructive" },
  { name: "Border", className: "bg-border" },
]

export default function Home() {
  return (
    <main className="bg-muted/40 min-h-screen p-6 md:p-10">
      <div className="mx-auto flex max-w-6xl flex-col gap-8">
        <header className="flex flex-col gap-2">
          <Badge variant="secondary" className="w-fit">
            Medical design system
          </Badge>
          <h1 className="text-3xl font-semibold tracking-tight">Component showcase</h1>
          <p className="text-muted-foreground max-w-2xl">
            Tokens and components synced from DS Manager. Every shadcn/ui component lives in
            components/ui, styled with this theme.
          </p>
        </header>

        <section className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          <Card>
            <CardHeader>
              <CardTitle>Contribution History</CardTitle>
              <CardDescription>Last 6 months of activity</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex h-36 items-end gap-3">
                {history.map((item) => (
                  <div key={item.month} className="flex flex-1 flex-col items-center gap-2">
                    <div
                      className="bg-primary w-full rounded-sm"
                      style={{ height: `${item.value}%` }}
                    />
                    <span className="text-muted-foreground text-xs">{item.month}</span>
                  </div>
                ))}
              </div>
            </CardContent>
            <CardFooter>
              <Button className="w-full">View Full Report</Button>
            </CardFooter>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Payout Threshold</CardTitle>
              <CardDescription>Set the minimum balance before a payout is triggered.</CardDescription>
            </CardHeader>
            <CardContent className="flex flex-col gap-4">
              <div className="flex flex-col gap-2">
                <Label htmlFor="amount">Minimum payout amount</Label>
                <Input id="amount" defaultValue="2500.00" />
              </div>
              <div className="flex flex-col gap-2">
                <Label htmlFor="notes">Notes</Label>
                <Input id="notes" placeholder="Add any notes for this payout..." />
              </div>
            </CardContent>
            <CardFooter className="gap-2">
              <Button variant="outline">Cancel</Button>
              <Button className="flex-1">Save Threshold</Button>
            </CardFooter>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Savings Targets</CardTitle>
              <CardDescription>Active milestones for 2024</CardDescription>
              <CardAction>
                <Button variant="outline" size="sm">
                  New Goal
                </Button>
              </CardAction>
            </CardHeader>
            <CardContent className="flex flex-col gap-5">
              {[
                { label: "Retirement", total: "$420,000", pct: 65, saved: "$273,000" },
                { label: "Real Estate", total: "$85,000", pct: 32, saved: "$27,200" },
              ].map((goal) => (
                <div key={goal.label} className="flex flex-col gap-2">
                  <span className="text-muted-foreground text-xs font-medium uppercase tracking-wide">
                    {goal.label}
                  </span>
                  <span className="text-2xl font-semibold">{goal.total}</span>
                  <div className="bg-muted h-2 overflow-hidden rounded-full">
                    <div className="bg-primary h-full rounded-full" style={{ width: `${goal.pct}%` }} />
                  </div>
                  <div className="text-muted-foreground flex justify-between text-sm">
                    <span>{goal.pct}% achieved</span>
                    <span>{goal.saved}</span>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>

          <Card className="md:col-span-2">
            <CardHeader>
              <CardTitle>Recent Transactions</CardTitle>
              <CardDescription>Your latest account activity</CardDescription>
              <CardAction>
                <Button variant="ghost" size="sm">
                  View All
                </Button>
              </CardAction>
            </CardHeader>
            <CardContent className="flex flex-col divide-y">
              {transactions.map((t) => (
                <div key={t.name} className="flex items-center justify-between gap-4 py-3">
                  <div className="flex flex-col">
                    <span className="font-medium">{t.name}</span>
                    <span className="text-muted-foreground text-sm">{t.category}</span>
                  </div>
                  <span className="text-muted-foreground hidden text-sm sm:block">{t.date}</span>
                  <span className={t.amount.startsWith("+") ? "text-primary font-medium" : "font-medium"}>
                    {t.amount}
                  </span>
                </div>
              ))}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Buttons &amp; badges</CardTitle>
              <CardDescription>Every variant in this theme</CardDescription>
            </CardHeader>
            <CardContent className="flex flex-col gap-4">
              <div className="flex flex-wrap gap-2">
                <Button>Default</Button>
                <Button variant="secondary">Secondary</Button>
                <Button variant="outline">Outline</Button>
                <Button variant="ghost">Ghost</Button>
                <Button variant="destructive">Destructive</Button>
                <Button variant="link">Link</Button>
              </div>
              <div className="flex flex-wrap gap-2">
                <Badge>Default</Badge>
                <Badge variant="secondary">Secondary</Badge>
                <Badge variant="outline">Outline</Badge>
                <Badge variant="destructive">Destructive</Badge>
              </div>
            </CardContent>
          </Card>
        </section>

        <section className="flex flex-col gap-3">
          <h2 className="text-lg font-semibold">Colour tokens</h2>
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-4 lg:grid-cols-8">
            {swatches.map((s) => (
              <div key={s.name} className="flex flex-col gap-2">
                <div className={`${s.className} h-16 rounded-lg border`} />
                <span className="text-muted-foreground text-xs">{s.name}</span>
              </div>
            ))}
          </div>
        </section>
      </div>
    </main>
  )
}
