import raw from "@/design-system/component-classes.json"

import type { ComponentClasses } from "./component-classes"

/** Built-in Tailwind classes of every component, read from components/ui at build time */
export const COMPONENT_CLASSES = raw as unknown as Record<string, ComponentClasses>

/** slot → component id (file name) */
export const SLOT_COMPONENT: Record<string, string> = Object.fromEntries(
  Object.entries(COMPONENT_CLASSES).flatMap(([component, c]) => Object.keys(c.slots).map((slot) => [slot, component]))
)

export function componentSlots(component: string): string[] {
  return Object.keys(COMPONENT_CLASSES[component]?.slots ?? {})
}

/** Variant groups (e.g. variant, size) that apply to a slot, from its cva() */
export function slotVariantGroups(slot: string): Record<string, string[]> {
  const component = SLOT_COMPONENT[slot]
  const c = COMPONENT_CLASSES[component]
  const cvaName = c?.slotCva?.[slot]
  const groups = cvaName ? c.cva[cvaName]?.groups : undefined
  return Object.fromEntries(Object.entries(groups ?? {}).map(([g, values]) => [g, Object.keys(values)]))
}

/** Classes on a slot for the given variant/size (base + matching cva groups) */
export function slotClasses(slot: string, picks: Record<string, string | undefined>) {
  const component = SLOT_COMPONENT[slot]
  const c = COMPONENT_CLASSES[component]
  if (!c) return { base: [] as string[], groups: [] as { group: string; value: string; classes: string[] }[] }
  const cvaName = c.slotCva?.[slot]
  const cva = cvaName ? c.cva[cvaName] : undefined
  const base = [...(c.slots[slot] ?? []), ...(cva?.base ?? [])]
  const groups = Object.entries(cva?.groups ?? {}).map(([group, values]) => {
    const value = picks[group] ?? cva?.defaults?.[group] ?? Object.keys(values)[0]
    return { group, value, classes: values[value] ?? [] }
  })
  return { base, groups }
}

/** Split classes by their state prefix: "", "hover", "focus-visible", "dark", … */
export function groupByState(classes: string[]): Record<string, string[]> {
  const out: Record<string, string[]> = {}
  for (const c of classes) {
    const parts = c.split(":")
    const key = parts.length > 1 ? parts.slice(0, -1).join(":") : ""
    ;(out[key] ??= []).push(parts.length > 1 ? parts[parts.length - 1] : c)
  }
  return out
}
