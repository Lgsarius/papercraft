"use client"

import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/lib/utils"

const burgerMenuVariants = cva(
  "relative flex flex-col justify-center items-center transition-colors",
  {
    variants: {
      variant: {
        default: "hover:opacity-80",
        ghost: "hover:bg-accent",
      },
      size: {
        default: "h-10 w-10",
        sm: "h-8 w-8",
        lg: "h-12 w-12",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

const burgerLineVariants = cva(
  "absolute block bg-current transition-all duration-200",
  {
    variants: {
      size: {
        default: "h-[2px] w-5",
        sm: "h-[2px] w-4",
        lg: "h-[2px] w-6",
      },
    },
    defaultVariants: {
      size: "default",
    },
  }
)

interface BurgerMenuProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof burgerMenuVariants> {
  isOpen?: boolean
}

const BurgerMenu = React.forwardRef<HTMLButtonElement, BurgerMenuProps>(
  ({ className, variant, size, isOpen, ...props }, ref) => {
    return (
      <button
        ref={ref}
        className={cn(burgerMenuVariants({ variant, size, className }))}
        {...props}
      >
        <span className="sr-only">Toggle menu</span>
        <span
          className={cn(
            burgerLineVariants({ size }),
            "origin-center",
            isOpen && "translate-y-0 rotate-45",
            !isOpen && "-translate-y-[5px]"
          )}
        />
        <span
          className={cn(
            burgerLineVariants({ size }),
            isOpen && "opacity-0 translate-x-3"
          )}
        />
        <span
          className={cn(
            burgerLineVariants({ size }),
            "origin-center",
            isOpen && "translate-y-0 -rotate-45",
            !isOpen && "translate-y-[5px]"
          )}
        />
      </button>
    )
  }
)
BurgerMenu.displayName = "BurgerMenu"

export { BurgerMenu } 