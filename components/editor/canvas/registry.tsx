"use client"

import * as React from "react"

import { MedicalOverview } from "@/components/showcase/medical-overview"
import type { DesignTokens, Mode } from "@/lib/ds/types"

import { ColorsView, RadiusView, ShadowsView, SpacingView, TypographyView } from "./foundations"
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
  { id: "colors", name: "Colors" },
  { id: "typography", name: "Typography" },
  { id: "radius", name: "Radius" },
  { id: "shadows", name: "Shadows" },
  { id: "spacing", name: "Spacing" },
] as const

export type FoundationId = (typeof FOUNDATIONS)[number]["id"]

export function renderFoundation(id: string, tokens: DesignTokens, mode: Mode) {
  switch (id) {
    case "colors":
      return <ColorsView tokens={tokens} mode={mode} />
    case "typography":
      return <TypographyView tokens={tokens} />
    case "radius":
      return <RadiusView tokens={tokens} />
    case "shadows":
      return <ShadowsView tokens={tokens} mode={mode} />
    case "spacing":
      return <SpacingView tokens={tokens} />
    default:
      return null
  }
}
