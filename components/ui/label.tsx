"use client"

import * as React from "react"
import { cn } from "cn"

// medical-copy · registry v1 · shadcn-ui/ui@4233ed1c

function Label({ className, ...props }: React.ComponentProps<"label">) {
  return (
    <label
      data-slot="label"
      className={cn(
        "gap-2 text-sm leading-none font-[450] group-data-[disabled=true]:opacity-50 peer-disabled:opacity-50 flex items-center select-none group-data-[disabled=true]:pointer-events-none peer-disabled:cursor-not-allowed",
        className
      )}
      {...props}
    />
  )
}

export { Label }
