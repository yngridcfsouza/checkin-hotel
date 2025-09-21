import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap text-sm font-medium transition-all disabled:pointer-events-none disabled:opacity-50 disabled:cursor-not-allowed [&_svg]:pointer-events-none [&_svg:not([class*='size-'])]:size-4 shrink-0 [&_svg]:shrink-0 outline-none focus:outline-none focus:ring-2 focus:ring-offset-2",
  {
    variants: {
      variant: {
        default:
          "rounded-lg text-white bg-blue-900 hover:bg-blue-800 focus:ring-blue-500 border border-transparent",
        primary:
          "rounded-lg text-white bg-blue-900 hover:bg-blue-800 focus:ring-blue-500 border border-transparent",
        secondary:
          "rounded-lg text-blue-900 bg-blue-100 hover:bg-blue-200 focus:ring-blue-500 border border-blue-200",
        outline:
          "rounded-lg text-blue-900 bg-transparent hover:bg-blue-50 focus:ring-blue-500 border border-blue-300",
        destructive:
          "rounded-lg text-white bg-red-600 hover:bg-red-700 focus:ring-red-500 border border-transparent",
        success:
          "rounded-lg text-white bg-green-600 hover:bg-green-700 focus:ring-green-500 border border-transparent",
        warning:
          "rounded-lg text-white bg-yellow-600 hover:bg-yellow-700 focus:ring-yellow-500 border border-transparent",
        ghost:
          "rounded-lg text-blue-900 bg-transparent hover:bg-blue-50 focus:ring-blue-500 border border-transparent",
        link: 
          "text-blue-900 underline-offset-4 hover:underline focus:ring-blue-500 rounded",
      },
      size: {
        sm: "h-8 px-3 py-1.5 text-xs",
        default: "h-10 px-4 py-2.5",
        lg: "h-12 px-6 py-3 text-base",
        xl: "h-14 px-8 py-4 text-lg",
        icon: "h-10 w-10 p-0",
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
  variant,
  size,
  asChild = false,
  ...props
}: React.ComponentProps<"button"> &
  VariantProps<typeof buttonVariants> & {
    asChild?: boolean
  }) {
  const Comp = asChild ? Slot : "button"

  return (
    <Comp
      data-slot="button"
      className={cn(buttonVariants({ variant, size, className }))}
      {...props}
    />
  )
}

export { Button, buttonVariants }
