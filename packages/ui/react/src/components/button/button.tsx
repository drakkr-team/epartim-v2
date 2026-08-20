import { Button as ButtonHeadless } from "@base-ui/react/button";
import { tv, type VariantProps } from "tailwind-variants";

const buttonVariants = tv({
	base: [
		"inline-flex shrink-0 cursor-pointer select-none items-center justify-center gap-2 font-medium outline-none transition",
		"data-disabled:cursor-not-allowed",
	],
	variants: {
		variant: {
			default: [
				"border border-neutral-7 bg-neutral-1 text-neutral-12 ring-neutral-7",
				"hover:not-data-disabled:border-neutral-8 hover:not-data-disabled:bg-neutral-3",
				"active:not-data-disabled:border-neutral-8! active:not-data-disabled:bg-neutral-4!",
				"data-popup-open:border-neutral-8! data-popup-open:bg-neutral-4!",
				"focus-visible:ring-3",
				"data-disabled:opacity-50",
			],
			primary: [
				"bg-primary-9 text-primary-1 ring-primary-7 dark:text-primary-12",
				"hover:not-data-disabled:bg-primary-10",
				"active:not-data-disabled:bg-primary-11!",
				"data-popup-open:bg-primary-11!",
				"focus-visible:ring-3",
				"data-disabled:opacity-50",
			],
			secondary: [
				"bg-secondary-9 text-secondary-1 ring-secondary-7",
				"hover:not-data-disabled:bg-secondary-10",
				"active:not-data-disabled:bg-secondary-11!",
				"data-popup-open:bg-secondary-11!",
				"focus-visible:ring-3",
				"data-disabled:opacity-50",
			],
			ghost: [
				"bg-transparent text-neutral-12 ring-neutral-7",
				"hover:not-data-disabled:bg-neutral-3",
				"active:not-data-disabled:bg-neutral-4!",
				"data-popup-open:bg-neutral-4!",
				"focus-visible:ring-3",
				"data-disabled:bg-neutral-3 data-disabled:opacity-50",
			],
			destructive: [
				"bg-error-9 text-error-1 ring-error-7 dark:text-error-12",
				"hover:not-data-disabled:bg-error-10",
				"active:not-data-disabled:bg-error-11!",
				"data-popup-open:bg-error-11!",
				"focus-visible:ring-3",
				"data-disabled:opacity-50",
			],
		},
		size: {
			md: "h-10 rounded-lg px-3 text-sm sm:h-9 [&_svg]:size-4",
			"icon-sm": "size-7 rounded-md text-xs sm:size-6 [&_svg]:size-4",
			"icon-md": "size-10 rounded-lg text-sm sm:size-9 [&_svg]:size-4",
		},
	},
	defaultVariants: {
		variant: "default",
		size: "md",
	},
});

export type ButtonRootProps = VariantProps<typeof buttonVariants> & ButtonHeadless.Props;

export function ButtonRoot(props: ButtonRootProps) {
	const { className, variant, size, type = "button", ...rest } = props;

	return (
		<ButtonHeadless
			type={type}
			className={buttonVariants({ variant, size, className: className?.toString() })}
			{...rest}
		/>
	);
}
