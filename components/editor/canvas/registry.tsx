"use client"

import * as React from "react"

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
  demos: Demo[]
}

export const CANVASES: Record<string, LibraryCanvas> = {
  shadcn: {
    adapterId: "shadcn",
    overview: { name: "Medical overview", render: () => <MedicalOverview /> },
    demos: DEMOS,
  },
}

export const FOUNDATIONS = [
  { id: "colors", name: "Colors", summary: "Light and dark palettes, contrast checks and custom colours" },
  { id: "typography", name: "Typography", summary: "Fonts, type scale, weights and letter spacing" },
  { id: "radius", name: "Radius", summary: "Base radius and the scale calculated from it" },
  { id: "shadows", name: "Shadows", summary: "The elevation ramp" },
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
