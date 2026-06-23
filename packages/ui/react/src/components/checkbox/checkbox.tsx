import { Checkbox as CheckboxPrimitive } from "@base-ui/react/checkbox";
import { cn } from "tailwind-variants";

import { CheckIcon, MinusIcon } from "../../icons";

export type CheckboxRootProps = CheckboxPrimitive.Root.Props;

export function CheckboxRoot(props: CheckboxRootProps) {
	const { className, ...rest } = props;

	return (
		<CheckboxPrimitive.Root
			className={cn(
				// Default
				"flex size-5 items-center justify-center rounded-md border border-neutral-7 bg-neutral-1 text-neutral-1 outline-none ring-primary-7 transition dark:text-neutral-12",
				// Hover
				"hover:not-data-disabled:border-neutral-8 hover:not-data-disabled:bg-neutral-2",
				// Focus
				"focus-visible:ring-3",
				// Checked
				"data-checked:border-primary-9 data-checked:bg-primary-9",
				// Checked Hover
				"data-checked:hover:not-disabled:border-primary-10 data-checked:hover:not-disabled:bg-primary-10",
				// Indeterminate
				"data-indeterminate:border-primary-9 data-indeterminate:bg-primary-9",
				// Indeterminate Hover
				"data-indeterminate:hover:not-disabled:border-primary-10 data-indeterminate:hover:not-disabled:bg-primary-10",
				// Invalid
				"data-invalid:border-error-7",
				// Invalid Hover
				"data-invalid:hover:not-disabled:border-error-8",
				// Invalid Focus
				"data-invalid:focus-visible:ring-error-7",
				// Disabled
				"data-disabled:cursor-not-allowed data-disabled:opacity-50",
				// Overwrite
				className,
			)}
			{...rest}
		>
			<CheckboxPrimitive.Indicator
				className="size-4 stroke-3 transition data-ending-style:scale-0 data-starting-style:scale-0 data-ending-style:opacity-0 data-starting-style:opacity-0"
				render={(props, state) => {
					if (state.indeterminate) {
						return <MinusIcon {...props} />;
					}

					return <CheckIcon {...props} />;
				}}
			/>
		</CheckboxPrimitive.Root>
	);
}
