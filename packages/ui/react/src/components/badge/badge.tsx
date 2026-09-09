import type { ComponentProps } from "react";
import { tv, type VariantProps } from "tailwind-variants";

const badgeVariants = tv({
	slots: {
		root: "inline-flex w-fit items-center justify-center whitespace-nowrap rounded-full font-medium",
		dot: "inline-block shrink-0 rounded-full",
	},
	variants: {
		color: {
			neutral: { root: "bg-neutral-3 text-neutral-11", dot: "bg-neutral-9" },
			primary: { root: "bg-primary-3 text-primary-11", dot: "bg-primary-9" },
			secondary: { root: "bg-secondary-3 text-secondary-11", dot: "bg-secondary-9" },
			info: { root: "bg-info-3 text-info-11", dot: "bg-info-9" },
			success: { root: "bg-success-3 text-success-11", dot: "bg-success-9" },
			warning: { root: "bg-warning-3 text-warning-11", dot: "bg-warning-9" },
			error: { root: "bg-error-3 text-error-11", dot: "bg-error-9" },
		},
		size: {
			sm: { root: "h-5 gap-1.5 px-2 text-2xs", dot: "size-1" },
			md: { root: "h-5.5 gap-1.5 px-2.5 text-xs", dot: "size-1.5" },
			lg: { root: "h-8 gap-2 px-3 text-sm", dot: "size-2" },
		},
	},
	defaultVariants: {
		color: "neutral",
		size: "md",
	},
});

const { dot, root } = badgeVariants();

export type BadgeRootProps = ComponentProps<"span"> &
	VariantProps<typeof badgeVariants> & {
		withDot?: boolean;
	};

export function BadgeRoot(props: BadgeRootProps) {
	const { children, className, color, size, withDot = true, ...rest } = props;

	return (
		<span className={root({ color, size, className: className?.toString() })} {...rest}>
			{withDot && <span aria-hidden="true" className={dot({ color, size })} />}
			{children}
		</span>
	);
}
