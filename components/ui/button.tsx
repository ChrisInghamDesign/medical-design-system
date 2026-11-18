import { Button as ButtonPrimitive } from "@base-ui/react/button"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "cn"

// medical-copy · registry v1 · shadcn-ui/ui@4233ed1c

const buttonVariants = cva(
  "focus-visible:border-ring focus-visible:ring-ring/50 aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive dark:aria-invalid:border-destructive/50 rounded-md border border-transparent bg-clip-padding text-sm font-[450] focus-visible:ring-3 aria-invalid:ring-3 active:not-aria-[haspopup]:translate-y-px [&_svg:not([class*='size-'])]:size-4 group/button inline-flex shrink-0 items-center justify-center whitespace-nowrap transition-all outline-none select-none disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:shrink-0",
  {
    variants: {
      variant: {
        default: "text-primary-foreground hover:bg-primary/80 shadow-[inset_0px_1px_0px_0px_oklch(1_0_0/0.4),0px_3px_8px_0px_oklch(0.3293_0.1183_257.288_/_15%)] border-[color-mix(in_oklch,var(--primary),var(--foreground)_18%)] bg-primary",
        outline: "border-border bg-background hover:bg-muted/60 hover:text-foreground dark:bg-input/30 dark:border-input dark:hover:bg-input/50 aria-expanded:bg-muted aria-expanded:text-foreground shadow-none",
        secondary: "bg-secondary text-secondary-foreground hover:bg-[color-mix(in_oklch,var(--secondary),var(--foreground)_5%)] aria-expanded:bg-secondary aria-expanded:text-secondary-foreground",
        ghost: "hover:bg-muted hover:text-foreground dark:hover:bg-muted/50 aria-expanded:bg-muted aria-expanded:text-foreground",
        destructive: "bg-destructive/10 hover:bg-destructive/20 focus-visible:ring-destructive/20 dark:focus-visible:ring-destructive/40 dark:bg-destructive/20 text-destructive focus-visible:border-destructive/40 dark:hover:bg-destructive/30",
        link: "text-foreground underline-offset-4 hover:underline",
      },
      size: {
        default: "h-9 gap-1.5 px-3 has-data-[icon=inline-end]:pr-3 has-data-[icon=inline-start]:pl-3 rounded-md",
        xs: "h-6 gap-1 px-2 text-xs in-data-[slot=button-group]:rounded-[min(var(--radius-md),8px)] has-data-[icon=inline-end]:pr-1.5 has-data-[icon=inline-start]:pl-1.5 [&_svg:not([class*='size-'])]:size-3 rounded-[min(var(--radius-md),8px)]",
        sm: "h-8 gap-1 px-2.5 in-data-[slot=button-group]:rounded-[min(var(--radius-md),10px)] has-data-[icon=inline-end]:pr-1.5 has-data-[icon=inline-start]:pl-1.5 rounded-[min(var(--radius-md),10px)]",
        lg: "h-10 gap-1.5 px-3 has-data-[icon=inline-end]:pr-3 has-data-[icon=inline-start]:pl-3",
        icon: "size-9",
        "icon-xs": "size-6 in-data-[slot=button-group]:rounded-[min(var(--radius-md),8px)] [&_svg:not([class*='size-'])]:size-3 rounded-[min(var(--radius-md),8px)]",
        "icon-sm": "size-8 in-data-[slot=button-group]:rounded-[min(var(--radius-md),10px)] rounded-[min(var(--radius-md),10px)]",
        "icon-lg": "size-10",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

function Button({
  className,
  variant = "default",
  size = "default",
  ...props
}: ButtonPrimitive.Props & VariantProps<typeof buttonVariants>) {
  return (
    <ButtonPrimitive
      data-slot="button"
      className={cn(buttonVariants({ variant, size, className }))}
      {...props}
    />
  )
}

export { Button, buttonVariants }
