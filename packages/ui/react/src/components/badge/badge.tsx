import type { ComponentProps } from "react";
import { tv, type VariantProps } from "tailwind-variants";

const badgeVariants = tv({
	base: "inline-flex w-fit items-center justify-center whitespace-nowrap rounded-full font-medium",
	variants: {
		variant: {
			neutral: "bg-neutral-3 text-neutral-11",
			primary: "bg-primary-3 text-primary-11",
			secondary: "bg-secondary-3 text-secondary-11",
			info: "bg-info-3 text-info-11",
			success: "bg-success-3 text-success-11",
			warning: "bg-warning-3 text-warning-11",
			error: "bg-error-3 text-error-11",
		},
		size: {
			sm: "h-5 gap-1.5 px-2 text-2xs",
			md: "h-5.5 gap-1.5 px-2.5 text-xs",
			lg: "h-8 gap-2 px-3 text-sm",
		},
	},
	defaultVariants: {
		variant: "neutral",
		size: "md",
	},
});

const badgeDotVariants = tv({
	base: "shrink-0 rounded-full",
	variants: {
		variant: {
			neutral: "bg-neutral-9",
			primary: "bg-primary-9",
			secondary: "bg-secondary-9",
			info: "bg-info-9",
			success: "bg-success-9",
			warning: "bg-warning-9",
			error: "bg-error-9",
		},
		size: {
			sm: "size-1",
			md: "size-1.5",
			lg: "size-2",
		},
	},
	defaultVariants: {
		variant: "neutral",
		size: "md",
	},
});

export type BadgeRootProps = ComponentProps<"span"> &
	VariantProps<typeof badgeVariants> & {
		withDot?: boolean;
	};

export function BadgeRoot(props: BadgeRootProps) {
	const { children, className, size, variant, withDot = true, ...rest } = props;

	return (
		<span className={badgeVariants({ variant, size, className })} {...rest}>
			{withDot && <span aria-hidden="true" className={badgeDotVariants({ variant, size })} />}
			{children}
		</span>
	);
}
