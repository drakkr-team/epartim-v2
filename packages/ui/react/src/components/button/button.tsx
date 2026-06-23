import { Button as ButtonPrimitive } from "@base-ui/react/button";
import { tv, type VariantProps } from "tailwind-variants";

const buttonVariants = tv({
	base: [
		// Default
		"inline-flex shrink-0 cursor-pointer select-none items-center justify-center gap-2 font-medium outline-none transition",
		// Disabled
		"data-disabled:cursor-not-allowed",
	],
	variants: {
		variant: {
			default: [
				// Default
				"border border-neutral-7 bg-neutral-1 text-neutral-12 ring-neutral-7",
				// Hover
				"hover:not-data-disabled:border-neutral-8 hover:not-data-disabled:bg-neutral-3",
				// Popup Open
				"data-popup-open:border-neutral-8 data-popup-open:bg-neutral-3",
				// Focus
				"focus-visible:border-neutral-8 focus-visible:ring-3",
				// Disabled
				"data-disabled:opacity-50",
			],
			primary: [
				// Default
				"bg-primary-9 text-primary-1 ring-primary-7 dark:text-primary-12",
				// Hover
				"hover:not-data-disabled:bg-primary-10",
				// Popup Open
				"data-popup-open:bg-primary-10",
				// Focus
				"focus-visible:ring-3",
				// Disabled
				"data-disabled:opacity-50",
			],
			ghost: [
				// Default
				"bg-transparent text-neutral-12 ring-neutral-7",
				// Hover
				"hover:not-data-disabled:bg-neutral-3",
				// Popup Open
				"data-popup-open:bg-neutral-3",
				// Focus
				"focus-visible:ring-3",
				// Disabled
				"data-disabled:bg-neutral-3 data-disabled:opacity-50",
			],
			destructive: [
				// Default
				"bg-error-9 text-error-1 ring-error-7 dark:text-error-12",
				// Hover
				"hover:not-data-disabled:bg-error-10",
				// Popup Open
				"data-popup-open:bg-error-10",
				// Focus
				"focus-visible:ring-3",
				// Disabled
				"data-disabled:opacity-50",
			],
		},
		size: {
			md: "h-10 rounded-lg px-3 text-sm sm:h-9 [&_svg]:size-4",
			"icon-sm": "size-7 rounded-md text-xs sm:size-6 [&_svg]:size-4",
			"icon-md": "size-9 rounded-lg text-sm sm:size-9 [&_svg]:size-4",
		},
	},
	defaultVariants: {
		variant: "default",
		size: "md",
	},
});

export type ButtonRootProps = ButtonPrimitive.Props & VariantProps<typeof buttonVariants>;

export function ButtonRoot(props: ButtonRootProps) {
	const { className, variant, size, type = "button", ...rest } = props;

	return (
		<ButtonPrimitive
			type={type}
			className={buttonVariants({ variant, size, className: className?.toString() })}
			{...rest}
		/>
	);
}
