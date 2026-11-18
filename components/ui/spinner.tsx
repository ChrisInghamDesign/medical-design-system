import { cn } from "cn"
import { HugeiconsIcon, Loading03Icon } from "@/lib/ds/icons"

// medical-copy · registry v1 · shadcn-ui/ui@4233ed1c

function Spinner({ className, ...props }: Omit<React.ComponentProps<typeof HugeiconsIcon>, "icon">) {
  return (
    <HugeiconsIcon icon={Loading03Icon} strokeWidth={2} data-slot="spinner" role="status" aria-label="Loading" className={cn("size-4 animate-spin", className)} {...props} />
  )
}

export { Spinner }
