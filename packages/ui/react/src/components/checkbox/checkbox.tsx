import { CheckboxGroup as CheckboxGroupHeadless } from "@base-ui/react";
import { Checkbox as CheckboxHeadless } from "@base-ui/react/checkbox";
import { tv, type VariantProps } from "tailwind-variants";

import { CheckIcon, MinusIcon } from "../../icons";

const checkboxVariants = tv({
	slots: {
		rootVariants: [
			"relative flex cursor-pointer items-center justify-center border outline-none ring-primary-7 transition",
			"data-unchecked:border-neutral-7 data-unchecked:bg-neutral-1 data-unchecked:text-transparent",
			"data-unchecked:hover:not-data-disabled:border-neutral-8 data-unchecked:hover:not-data-disabled:bg-neutral-2",
			"data-checked:border-primary-9 data-checked:bg-primary-9 data-checked:text-neutral-1 data-checked:dark:text-neutral-12",
			"data-checked:hover:not-data-disabled:border-primary-10 data-checked:hover:not-data-disabled:bg-primary-10",
			"data-indeterminate:border-primary-9 data-indeterminate:bg-primary-9 data-indeterminate:text-neutral-1 data-indeterminate:dark:text-neutral-12",
			"data-indeterminate:hover:not-data-disabled:border-primary-10 data-indeterminate:hover:not-data-disabled:bg-primary-10",
			"data-invalid:border-error-7",
			"data-invalid:hover:not-data-disabled:border-error-8",
			"focus-visible:ring-3",
			"data-disabled:cursor-not-allowed data-disabled:opacity-50",
			"before:absolute",
		],
		indicatorVariants: [
			"transition",
			"data-ending-style:scale-0 data-starting-style:scale-0",
			"data-ending-style:opacity-0 data-starting-style:opacity-0",
		],
	},
	variants: {
		size: {
			md: {
				rootVariants: ["size-5 rounded-md", "before:-inset-2.5"],
				indicatorVariants: ["size-4 stroke-3"],
			},
			sm: {
				rootVariants: ["size-4 rounded-sm", "before:-inset-3"],
				indicatorVariants: ["size-3.5 stroke-2"],
			},
		},
	},
	defaultVariants: {
		size: "md",
	},
});

const { rootVariants, indicatorVariants } = checkboxVariants();

export type CheckboxRootProps = VariantProps<typeof checkboxVariants> &
	Omit<CheckboxHeadless.Root.Props, "children">;

export function CheckboxRoot(props: CheckboxRootProps) {
	const { size, className, ...rest } = props;

	return (
		<CheckboxHeadless.Root
			className={rootVariants({ size, className: className?.toString() })}
			{...rest}
		>
			<CheckboxHeadless.Indicator
				className={indicatorVariants({ size })}
				render={(props, state) => {
					if (state.indeterminate) {
						return <MinusIcon {...props} />;
					}

					return <CheckIcon {...props} />;
				}}
			/>
		</CheckboxHeadless.Root>
	);
}

export type CheckboxGroupProps = CheckboxGroupHeadless.Props;

export function CheckboxGroup(props: CheckboxGroupProps) {
	return <CheckboxGroupHeadless {...props} />;
}
