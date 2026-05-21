import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium ring-offset-bg transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0",
  {
    variants: {
      variant: {
        default:
          "bg-gold text-bg shadow-[0_8px_30px_-10px_hsl(var(--gold)/0.6)] hover:bg-gold-muted hover:shadow-[0_12px_40px_-8px_hsl(var(--gold)/0.7)] hover:-translate-y-0.5",
        outline:
          "border border-gold/40 text-ink hover:bg-gold/10 hover:border-gold hover:-translate-y-0.5",
        ghost: "hover:bg-bg-elevated hover:text-ink",
        secondary: "bg-bg-elevated text-ink border border-line hover:bg-bg-subtle hover:border-line",
        link: "text-gold underline-offset-4 hover:underline",
        destructive: "bg-danger text-white hover:bg-danger/90",
      },
      size: {
        default: "h-10 px-5 py-2",
        sm: "h-9 rounded-md px-3 text-xs",
        lg: "h-12 rounded-md px-7 text-base",
        xl: "h-14 rounded-lg px-8 text-base",
        icon: "h-10 w-10",
      },
    },
    defaultVariants: { variant: "default", size: "default" },
  },
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button";
    return <Comp className={cn(buttonVariants({ variant, size, className }))} ref={ref} {...props} />;
  },
);
Button.displayName = "Button";

export { Button, buttonVariants };
