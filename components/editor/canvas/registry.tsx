"use client"

import * as React from "react"

import { BLOCKS, type Block } from "@/components/blocks"
import { CUSTOM_DEMOS } from "@/components/custom"
import { MedicalOverview } from "@/components/showcase/medical-overview"

import {
  BrandView,
  ColorsView,
  ControlsView,
  IconsView,
  RadiusView,
  ShadowsView,
  SpacingView,
  TypographyView,
  type FoundationProps,
} from "./foundations"
import { DEMOS, type Demo } from "./shadcn/demos"

/**
 * Canvases per component library. Each library supplies an overview screen and
 * a list of component demos. Foundations views are shared by every library.
 */
export interface LibraryCanvas {
  adapterId: string
  overview: { name: string; render: () => React.ReactNode }
  /** The library's components followed by your custom components */
  demos: Demo[]
  /** Ids of the custom components (components/custom) within demos */
  customIds: string[]
  /** Ready-made page sections (components/blocks) */
  blocks: Block[]
}

export const CANVASES: Record<string, LibraryCanvas> = {
  shadcn: {
    adapterId: "shadcn",
    overview: { name: "Medical overview", render: () => <MedicalOverview /> },
    demos: [...DEMOS, ...CUSTOM_DEMOS],
    customIds: CUSTOM_DEMOS.map((d) => d.id),
    blocks: BLOCKS,
  },
}

export const FOUNDATIONS = [
  { id: "colors", name: "Color", summary: "Light and dark palettes, contrast checks and custom colours" },
  { id: "typography", name: "Typography", summary: "Fonts, type scale, weights and letter spacing" },
  { id: "radius", name: "Radius", summary: "Base radius and the scale calculated from it" },
  { id: "shadows", name: "Shadow", summary: "The elevation ramp" },
  { id: "spacing", name: "Spacing", summary: "Base unit and density" },
  { id: "controls", name: "Controls", summary: "Control heights and focus style" },
  { id: "icons", name: "Icons", summary: "Icon library, stroke and roles" },
  { id: "brand", name: "Brand", summary: "Logo, mark and favicon" },
] as const

export type FoundationId = (typeof FOUNDATIONS)[number]["id"]

export function renderFoundation(id: string, props: FoundationProps) {
  switch (id) {
    case "colors":
      return <ColorsView {...props} />
    case "typography":
      return <TypographyView {...props} />
    case "radius":
      return <RadiusView {...props} />
    case "shadows":
      return <ShadowsView {...props} />
    case "spacing":
      return <SpacingView {...props} />
    case "controls":
      return <ControlsView {...props} />
    case "icons":
      return <IconsView {...props} />
    case "brand":
      return <BrandView {...props} />
    default:
      return null
  }
}
