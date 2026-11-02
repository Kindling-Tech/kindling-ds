import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "cn"

const itemVariants = cva(
  "flex items-start gap-sm px-md py-sm",
  {
    variants: {
      variant: {
        default: "",
        bordered: "border-b border-border last:border-b-0",
      },
      size: {
        default: "py-sm",
        sm: "py-xs",
        lg: "py-md",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

function Item({
  className,
  variant,
  size,
  ...props
}: React.ComponentProps<"div"> & VariantProps<typeof itemVariants>) {
  return (
    <div
      data-slot="item"
      className={cn(itemVariants({ variant, size }), className)}
      {...props}
    />
  )
}

function ItemContent({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="item-content"
      className={cn("flex flex-1 min-w-0 flex-col gap-3xs", className)}
      {...props}
    />
  )
}

function ItemTitle({ className, ...props }: React.ComponentProps<"span">) {
  return (
    <span
      data-slot="item-title"
      className={cn("text-paragraph-sm font-medium", className)}
      {...props}
    />
  )
}

function ItemDescription({ className, ...props }: React.ComponentProps<"span">) {
  return (
    <span
      data-slot="item-description"
      className={cn("text-paragraph-sm text-muted-foreground", className)}
      {...props}
    />
  )
}

function ItemAction({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="item-action"
      className={cn("flex shrink-0 items-center gap-xs ml-auto", className)}
      {...props}
    />
  )
}

export { Item, ItemContent, ItemTitle, ItemDescription, ItemAction, itemVariants }
