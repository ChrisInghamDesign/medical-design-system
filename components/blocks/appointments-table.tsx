import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardAction, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { HugeiconsIcon, MoreHorizontalCircle01Icon } from "@/lib/ds/icons"

import type { Block } from "./types"

type Status = "Confirmed" | "Checked in" | "Pending" | "Cancelled"

const statusVariant: Record<Status, "default" | "secondary" | "outline" | "destructive"> = {
  Confirmed: "default",
  "Checked in": "secondary",
  Pending: "outline",
  Cancelled: "destructive",
}

const rows: { id: string; patient: string; type: string; time: string; clinician: string; status: Status }[] = [
  { id: "PT-1042", patient: "Patient A", type: "General check-up", time: "09:00", clinician: "Dr. Lee", status: "Checked in" },
  { id: "PT-1043", patient: "Patient B", type: "Blood test", time: "09:30", clinician: "Nurse Patel", status: "Confirmed" },
  { id: "PT-1044", patient: "Patient C", type: "Follow-up", time: "10:00", clinician: "Dr. Moreau", status: "Pending" },
  { id: "PT-1045", patient: "Patient D", type: "Vaccination", time: "10:30", clinician: "Nurse Patel", status: "Confirmed" },
  { id: "PT-1046", patient: "Patient E", type: "Physiotherapy", time: "11:00", clinician: "Dr. Okafor", status: "Cancelled" },
]

export function AppointmentsTableBlock() {
  return (
    <section className="bg-muted/40 px-6 py-12 md:py-16">
      <div className="mx-auto max-w-6xl">
        <Card>
          <CardHeader>
            <CardTitle>Today&apos;s appointments</CardTitle>
            <CardDescription>48 appointments scheduled across 4 rooms.</CardDescription>
            <CardAction>
              <Button size="sm">New appointment</Button>
            </CardAction>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Patient</TableHead>
                    <TableHead>Visit type</TableHead>
                    <TableHead>Time</TableHead>
                    <TableHead>Clinician</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>
                      <span className="sr-only">Actions</span>
                    </TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {rows.map((row) => (
                    <TableRow key={row.id}>
                      <TableCell>
                        <div className="flex flex-col">
                          <span className="font-medium">{row.patient}</span>
                          <span className="text-xs text-muted-foreground">{row.id}</span>
                        </div>
                      </TableCell>
                      <TableCell>{row.type}</TableCell>
                      <TableCell className="tabular-nums">{row.time}</TableCell>
                      <TableCell>{row.clinician}</TableCell>
                      <TableCell>
                        <Badge variant={statusVariant[row.status]}>{row.status}</Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        <Button variant="ghost" size="icon-sm" aria-label={`Actions for ${row.patient}`}>
                          <HugeiconsIcon icon={MoreHorizontalCircle01Icon} />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </CardContent>
          <CardFooter className="flex-col gap-3 md:flex-row md:justify-between">
            <p className="text-sm text-muted-foreground">Showing 1–5 of 48</p>
            <Pagination className="mx-0 w-auto">
              <PaginationContent>
                <PaginationItem>
                  <PaginationPrevious href="#" />
                </PaginationItem>
                <PaginationItem>
                  <PaginationLink href="#" isActive>
                    1
                  </PaginationLink>
                </PaginationItem>
                <PaginationItem>
                  <PaginationLink href="#">2</PaginationLink>
                </PaginationItem>
                <PaginationItem>
                  <PaginationEllipsis />
                </PaginationItem>
                <PaginationItem>
                  <PaginationLink href="#">10</PaginationLink>
                </PaginationItem>
                <PaginationItem>
                  <PaginationNext href="#" />
                </PaginationItem>
              </PaginationContent>
            </Pagination>
          </CardFooter>
        </Card>
      </div>
    </section>
  )
}

export const block: Block = {
  id: "appointments-table",
  name: "Appointments table",
  category: "Application",
  description: "Data table with status badges, row actions and pagination.",
  render: () => <AppointmentsTableBlock />,
}
