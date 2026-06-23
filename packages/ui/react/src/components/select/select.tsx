import { Select as SelectPrimitive } from "@base-ui/react/select";
import { cn } from "tailwind-variants";

import { CheckIcon, ChevronsUpDownIcon } from "../../icons";
import { ScrollArea } from "../scroll-area";

export type SelectRootProps<
	Value,
	Multiple extends boolean | undefined = false,
> = SelectPrimitive.Root.Props<Value, Multiple>;

export function SelectRoot<Value, Multiple extends boolean | undefined = false>(
	props: SelectRootProps<Value, Multiple>,
) {
	return <SelectPrimitive.Root {...props} />;
}

export type SelectInputProps = SelectPrimitive.Trigger.Props;

export function SelectInput(props: SelectInputProps) {
	const { children, className, ...rest } = props;

	return (
		<SelectPrimitive.Trigger
			className={cn(
				// Default
				"inline-flex h-10 items-center justify-between gap-2 rounded-lg border border-neutral-7 bg-neutral-1 px-2 outline-none ring-primary-7 transition sm:h-9",
				// Hover
				"hover:not-disabled:border-neutral-8",
				// Focus
				"focus-visible:border-primary-8 focus-visible:ring-3 focus-visible:hover:border-primary-8",
				// Popup open
				"data-popup-open:border-primary-8 data-popup-open:ring-3 data-popup-open:hover:border-primary-8",
				// Invalid
				"data-invalid:border-error-7 data-invalid:ring-error-7",
				// Invalid Hover
				"data-invalid:hover:not-data-disabled:border-error-8",
				// Invalid Focus
				"data-invalid:focus-visible:border-error-8 data-invalid:hover:border-error-8",
				// Invalid Popup open
				"data-invalid:data-popup-open:border-error-8 data-invalid:data-popup-open:hover:border-error-8",
				// Disabled
				"data-disabled:cursor-not-allowed data-disabled:opacity-50",
				// Overwrite
				className,
			)}
			{...rest}
		>
			{children}
			<SelectPrimitive.Icon
				className="size-4 shrink-0 text-neutral-11"
				render={<ChevronsUpDownIcon />}
			/>
		</SelectPrimitive.Trigger>
	);
}

export type SelectValueProps = SelectPrimitive.Value.Props;

export function SelectValue(props: SelectValueProps) {
	const { className, ...rest } = props;

	return (
		<SelectPrimitive.Value
			className={cn(
				// Default
				"truncate text-base text-neutral-12 sm:text-sm",
				// Placeholder
				"data-placeholder:text-neutral-9",
				// Overwrite
				className,
			)}
			{...rest}
		/>
	);
}

export type SelectDropdownProps = Omit<SelectPrimitive.Positioner.Props, "alignItemWithTrigger">;

export function SelectDropdown(props: SelectDropdownProps) {
	const {
		children,
		className,
		align = "start",
		sideOffset = 8,
		collisionPadding = 16,
		...rest
	} = props;

	return (
		<SelectPrimitive.Portal>
			<SelectPrimitive.Positioner
				className="select-none outline-none"
				alignItemWithTrigger={false}
				align={align}
				sideOffset={sideOffset}
				collisionPadding={collisionPadding}
				{...rest}
			>
				<SelectPrimitive.Popup
					className={cn(
						// Default
						"grid max-h-[min(24rem,var(--available-height))] min-w-(--anchor-width) max-w-(--available-width) origin-(--transform-origin) grid-rows-1 rounded-lg border border-neutral-6 bg-neutral-1 shadow shadow-neutral-5 outline-none transition",
						// Starting Animation
						"data-starting-style:data-[side=inline-end]:-translate-x-1 data-starting-style:data-[side=inline-start]:translate-x-1 data-starting-style:data-[side=left]:translate-x-1 data-starting-style:data-[side=right]:-translate-x-1 data-starting-style:data-[side=bottom]:-translate-y-1 data-starting-style:data-[side=top]:translate-y-1 data-starting-style:scale-95 data-starting-style:opacity-0 data-starting-style:blur-xs",
						// Ending Animation
						"data-ending-style:data-[side=inline-end]:-translate-x-1 data-ending-style:data-[side=inline-start]:translate-x-1 data-ending-style:data-[side=left]:translate-x-1 data-ending-style:data-[side=right]:-translate-x-1 data-ending-style:data-[side=bottom]:-translate-y-1 data-ending-style:data-[side=top]:translate-y-1 data-ending-style:scale-95 data-ending-style:opacity-0 data-ending-style:blur-xs",
						// Overwrite
						className,
					)}
				>
					<ScrollArea>
						<SelectPrimitive.List className="py-1 outline-none">{children}</SelectPrimitive.List>
					</ScrollArea>
				</SelectPrimitive.Popup>
			</SelectPrimitive.Positioner>
		</SelectPrimitive.Portal>
	);
}

export type SelectOptionProps = SelectPrimitive.Item.Props;

export function SelectOption(props: SelectOptionProps) {
	const { children, className, ...rest } = props;

	return (
		<SelectPrimitive.Item
			className={cn(
				// Default
				"mx-1 flex h-9 items-center justify-between gap-2 rounded-md px-2 text-base text-neutral-12 outline-none sm:text-sm",
				// Hover
				"hover:not-data-disabled:bg-neutral-3",
				// Highlighted
				"data-highlighted:bg-neutral-3",
				// Selected
				"data-selected:bg-neutral-3",
				// Selected Hover
				"data-selected:hover:not-data-disabled:bg-neutral-4",
				// Selected Highlighted
				"data-selected:data-highlighted:bg-neutral-4",
				// Disabled
				"data-disabled:cursor-not-allowed data-disabled:opacity-50",
				// Overwrite
				className,
			)}
			{...rest}
		>
			<SelectPrimitive.ItemText className="truncate">{children}</SelectPrimitive.ItemText>
			<SelectPrimitive.ItemIndicator className="size-4 shrink-0" render={<CheckIcon />} />
		</SelectPrimitive.Item>
	);
}

export type SelectGroupProps = SelectPrimitive.Group.Props;

export function SelectGroup(props: SelectGroupProps) {
	return <SelectPrimitive.Group {...props} />;
}

export type SelectGroupLabelProps = SelectPrimitive.GroupLabel.Props;

export function SelectGroupLabel(props: SelectGroupLabelProps) {
	const { className, ...rest } = props;

	return (
		<SelectPrimitive.GroupLabel
			className={cn("p-2 text-neutral-11 text-xs uppercase", className)}
			{...rest}
		/>
	);
}

export type SelectSeparatorProps = SelectPrimitive.Separator.Props;

export function SelectSeparator(props: SelectSeparatorProps) {
	const { className, ...rest } = props;

	return (
		<SelectPrimitive.Separator className={cn("my-1 h-px bg-neutral-6", className)} {...rest} />
	);
}
