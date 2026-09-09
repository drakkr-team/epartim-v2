import type { ComponentProps } from "react";
import { tv, type VariantProps } from "tailwind-variants";

const badgeVariants = tv({
	base: "",
	variants: {
		variant: {
			default:
				"inline-flex w-fit items-center justify-center whitespace-nowrap rounded-full font-medium",
			dot: "shrink-0 rounded-full",
		},
		color: {
			neutral: "",
			primary: "",
			secondary: "",
			info: "",
			success: "",
			warning: "",
			error: "",
		},
		size: {
			sm: "",
			md: "",
			lg: "",
		},
	},
	compoundVariants: [
		{ variant: "default", color: "neutral", class: "bg-neutral-3 text-neutral-11" },
		{ variant: "default", color: "primary", class: "bg-primary-3 text-primary-11" },
		{ variant: "default", color: "secondary", class: "bg-secondary-3 text-secondary-11" },
		{ variant: "default", color: "info", class: "bg-info-3 text-info-11" },
		{ variant: "default", color: "success", class: "bg-success-3 text-success-11" },
		{ variant: "default", color: "warning", class: "bg-warning-3 text-warning-11" },
		{ variant: "default", color: "error", class: "bg-error-3 text-error-11" },
		{ variant: "dot", color: "neutral", class: "bg-neutral-9" },
		{ variant: "dot", color: "primary", class: "bg-primary-9" },
		{ variant: "dot", color: "secondary", class: "bg-secondary-9" },
		{ variant: "dot", color: "info", class: "bg-info-9" },
		{ variant: "dot", color: "success", class: "bg-success-9" },
		{ variant: "dot", color: "warning", class: "bg-warning-9" },
		{ variant: "dot", color: "error", class: "bg-error-9" },
		{ variant: "default", size: "sm", class: "h-5 gap-1.5 px-2 text-2xs" },
		{ variant: "default", size: "md", class: "h-5.5 gap-1.5 px-2.5 text-xs" },
		{ variant: "default", size: "lg", class: "h-8 gap-2 px-3 text-sm" },
		{ variant: "dot", size: "sm", class: "size-1" },
		{ variant: "dot", size: "md", class: "size-1.5" },
		{ variant: "dot", size: "lg", class: "size-2" },
	],
	defaultVariants: {
		variant: "default",
		color: "neutral",
		size: "md",
	},
});

export type BadgeRootProps = ComponentProps<"span"> &
	Omit<VariantProps<typeof badgeVariants>, "variant"> & {
		withDot?: boolean;
	};

export function BadgeRoot(props: BadgeRootProps) {
	const { children, className, color, size, withDot = true, ...rest } = props;

	return (
		<span className={badgeVariants({ variant: "default", color, size, className })} {...rest}>
			{withDot && (
				<span aria-hidden="true" className={badgeVariants({ variant: "dot", color, size })} />
			)}
			{children}
		</span>
	);
}
