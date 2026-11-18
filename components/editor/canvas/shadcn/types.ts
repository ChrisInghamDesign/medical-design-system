import type * as React from "react"

export interface DemoExample {
  name: string
  render: () => React.ReactNode
}

export interface MatrixAxis {
  /** Prop name, e.g. "variant" or "size" */
  prop: string
  values: string[]
}

export interface Demo {
  id: string
  name: string
  description: string
  /** Several examples shown one after another on the component page */
  examples: DemoExample[]
  /** Variant × size grid for the Matrix view */
  matrix?: {
    rows: MatrixAxis
    cols?: MatrixAxis
    render: (props: Record<string, string>) => React.ReactNode
  }
}
