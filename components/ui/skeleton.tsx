import { cn } from "cn"

// medical-copy · registry v1 · shadcn-ui/ui@4233ed1c

function Skeleton({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="skeleton"
      className={cn("bg-muted rounded-md animate-pulse", className)}
      {...props}
    />
  )
}

export { Skeleton }
