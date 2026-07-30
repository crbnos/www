import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import * as React from "react";

import { cn } from "~/lib/utils";

const buttonVariants = cva(
	"inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-none text-sm font-medium tracking-tight focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0 active:scale-[0.96] transition-[transform,color,background-color,border-color] duration-150 ease-in-out",
	{
		variants: {
			variant: {
				default:
					"bg-primary text-primary-foreground shadow hover:bg-primary/90",
				destructive:
					"bg-destructive text-destructive-foreground shadow-sm hover:bg-destructive/90",
				outline:
					"border border-input bg-background shadow-sm hover:bg-accent hover:text-accent-foreground",
				secondary:
					"bg-secondary/90 text-secondary-foreground shadow-sm hover:bg-secondary/80",
				ghost: "hover:bg-background/70 hover:text-accent-foreground",
				link: "text-primary underline-offset-4 hover:underline",
				accent:
					"bg-secondary text-secondary-foreground transition-opacity hover:opacity-90 dark:border dark:border-secondary/50 dark:bg-secondary/10 dark:text-secondary dark:transition-colors dark:hover:bg-secondary/20 dark:hover:opacity-100",
				accentOutline:
					"border border-border text-foreground transition-colors hover:border-foreground",
			},
			size: {
				default: "h-9 px-4 py-2",
				sm: "h-8 rounded-md px-3 text-xs",
				lg: "h-10 rounded-md px-8",
				xl: "h-12 rounded-none px-8 text-lg",
				icon: "h-9 w-9",
				cta: "px-6 py-4 font-mono text-[11px] uppercase tracking-[0.15em]",
				ctaSm: "px-4 py-2 font-mono text-[11px] uppercase tracking-[0.15em]",
			},
		},
		defaultVariants: {
			variant: "default",
			size: "default",
		},
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
		return (
			<Comp
				className={cn(buttonVariants({ variant, size, className }))}
				ref={ref}
				{...props}
			/>
		);
	},
);
Button.displayName = "Button";

export { Button, buttonVariants };
