"use client"

import * as React from "react"
import { Alert02Icon, Calendar03Icon, File01Icon, Settings02Icon } from "@/lib/ds/icons"

import classes from "@/design-system/component-classes.json"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Attachment, AttachmentContent, AttachmentMedia, AttachmentTitle } from "@/components/ui/attachment"
import { Badge } from "@/components/ui/badge"
import { Bubble, BubbleContent } from "@/components/ui/bubble"
import { Button } from "@/components/ui/button"
import { Item, ItemContent, ItemDescription, ItemMedia, ItemTitle } from "@/components/ui/item"
import { Marker, MarkerContent } from "@/components/ui/marker"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Toggle } from "@/components/ui/toggle"

import { DEMOS_A, Icon } from "./demos-a"
import { DEMOS_B } from "./demos-b"
import type { Demo, MatrixAxis } from "./types"

type ClassesJson = Record<string, { cva: Record<string, { groups: Record<string, Record<string, string[]>> }> }>

/** Variant values straight from the component's cva(), so the matrix stays in sync with the code */
function axis(component: string, cvaName: string, group: string, fallback: string[]): MatrixAxis {
  const values = Object.keys((classes as ClassesJson)[component]?.cva?.[cvaName]?.groups?.[group] ?? {})
  return { prop: group, values: values.length ? values : fallback }
}

/* eslint-disable @typescript-eslint/no-explicit-any -- matrix props come from the component's own variant names */
const MATRICES: Record<string, Demo["matrix"]> = {
  button: {
    rows: axis("button", "buttonVariants", "variant", ["default"]),
    cols: axis("button", "buttonVariants", "size", ["default"]),
    render: ({ variant, size }) =>
      size.startsWith("icon") ? (
        <Button variant={variant as any} size={size as any} aria-label="Settings">
          <Icon icon={Settings02Icon} />
        </Button>
      ) : (
        <Button variant={variant as any} size={size as any}>
          Deploy
        </Button>
      ),
  },
  badge: {
    rows: axis("badge", "badgeVariants", "variant", ["default"]),
    render: ({ variant }) => <Badge variant={variant as any}>Badge</Badge>,
  },
  toggle: {
    rows: axis("toggle", "toggleVariants", "variant", ["default"]),
    cols: axis("toggle", "toggleVariants", "size", ["default"]),
    render: ({ variant, size }) => (
      <Toggle variant={variant as any} size={size as any} defaultPressed aria-label="Toggle">
        Bold
      </Toggle>
    ),
  },
  alert: {
    rows: axis("alert", "alertVariants", "variant", ["default"]),
    render: ({ variant }) => (
      <Alert variant={variant as any} className="w-80">
        <Icon icon={Alert02Icon} />
        <AlertTitle>Heads up</AlertTitle>
        <AlertDescription>Something needs your attention.</AlertDescription>
      </Alert>
    ),
  },
  item: {
    rows: axis("item", "itemVariants", "variant", ["default"]),
    cols: axis("item", "itemVariants", "size", ["default"]),
    render: ({ variant, size }) => (
      <Item variant={variant as any} size={size as any} className="w-64">
        <ItemMedia variant="icon">
          <Icon icon={Calendar03Icon} />
        </ItemMedia>
        <ItemContent>
          <ItemTitle>Check-up</ItemTitle>
          <ItemDescription>Nov 20</ItemDescription>
        </ItemContent>
      </Item>
    ),
  },
  bubble: {
    rows: axis("bubble", "bubbleVariants", "variant", ["default"]),
    render: ({ variant }) => (
      <Bubble variant={variant as any}>
        <BubbleContent>See you soon!</BubbleContent>
      </Bubble>
    ),
  },
  marker: {
    rows: axis("marker", "markerVariants", "variant", ["default"]),
    render: ({ variant }) => (
      <Marker variant={variant as any} className="w-64">
        <MarkerContent>Today</MarkerContent>
      </Marker>
    ),
  },
  attachment: {
    rows: axis("attachment", "attachmentVariants", "orientation", ["horizontal"]),
    cols: axis("attachment", "attachmentVariants", "size", ["default"]),
    render: ({ orientation, size }) => (
      <Attachment orientation={orientation as any} size={size as any}>
        <AttachmentMedia>
          <Icon icon={File01Icon} />
        </AttachmentMedia>
        <AttachmentContent>
          <AttachmentTitle>scan.pdf</AttachmentTitle>
        </AttachmentContent>
      </Attachment>
    ),
  },
  tabs: {
    rows: axis("tabs", "tabsListVariants", "variant", ["default"]),
    render: ({ variant }) => (
      <Tabs defaultValue="a">
        <TabsList variant={variant as any}>
          <TabsTrigger value="a">Summary</TabsTrigger>
          <TabsTrigger value="b">Notes</TabsTrigger>
        </TabsList>
      </Tabs>
    ),
  },
}
/* eslint-enable @typescript-eslint/no-explicit-any */

export const DEMOS: Demo[] = [...DEMOS_A, ...DEMOS_B]
  .map((d) => ({ ...d, matrix: MATRICES[d.id] ?? d.matrix }))
  .sort((a, b) => a.name.localeCompare(b.name))

export type { Demo }
