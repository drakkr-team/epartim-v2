import { Autocomplete as AutocompletePrimitive } from "@base-ui/react/autocomplete";
import { cn } from "tailwind-variants";

import { Input, type InputProps } from "../input";
import { ScrollArea } from "../scroll-area";

export type AutocompleteRootProps<ItemValue> = AutocompletePrimitive.Root.Props<ItemValue>;

export function AutocompleteRoot<ItemValue>(props: AutocompleteRootProps<ItemValue>) {
	const { autoHighlight = true, ...rest } = props;

	// @ts-expect-error - type inference issue with generic component on Base UI end
	return <AutocompletePrimitive.Root autoHighlight={autoHighlight} {...rest} />;
}

export type AutoCompleteInputProps = Omit<InputProps, "render">;

export function AutocompleteInput(props: AutoCompleteInputProps) {
	return <AutocompletePrimitive.Input render={<Input />} {...props} />;
}

export type AutocompleteDropdownProps = AutocompletePrimitive.Positioner.Props;

export function AutocompleteDropdown(props: AutocompleteDropdownProps) {
	const {
		children,
		className,
		align = "start",
		sideOffset = 8,
		collisionPadding = 16,
		...rest
	} = props;

	return (
		<AutocompletePrimitive.Portal>
			<AutocompletePrimitive.Positioner
				className="select-none outline-none"
				align={align}
				sideOffset={sideOffset}
				collisionPadding={collisionPadding}
				{...rest}
			>
				<AutocompletePrimitive.Popup
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
					{children}
				</AutocompletePrimitive.Popup>
			</AutocompletePrimitive.Positioner>
		</AutocompletePrimitive.Portal>
	);
}

export type AutocompleteListProps = AutocompletePrimitive.List.Props;

export function AutocompleteList(props: AutocompleteListProps) {
	const { className, ...rest } = props;

	return (
		<ScrollArea>
			<AutocompletePrimitive.List
				className={cn(
					// Default
					"py-1 outline-none",
					// Empty
					"data-empty:hidden",
					// Overwrite
					className,
				)}
				{...rest}
			/>
		</ScrollArea>
	);
}

export type AutocompleteItemProps = AutocompletePrimitive.Item.Props;

export function AutocompleteItem(props: AutocompleteItemProps) {
	const { className, ...rest } = props;

	return (
		<AutocompletePrimitive.Item
			className={cn(
				// Default
				"mx-1 flex h-10 items-center rounded-md px-2 text-base text-neutral-12 outline-none sm:h-9 sm:text-sm",
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
		/>
	);
}

export type AutocompleteEmptyProps = AutocompletePrimitive.Empty.Props;

export function AutocompleteEmpty(props: AutocompleteEmptyProps) {
	return <AutocompletePrimitive.Empty {...props} />;
}

export type AutocompleteCollectionProps = AutocompletePrimitive.Collection.Props;

export function AutocompleteCollection(props: AutocompleteCollectionProps) {
	return <AutocompletePrimitive.Collection {...props} />;
}

export type AutocompleteGroupProps = AutocompletePrimitive.Group.Props;

export function AutocompleteGroup(props: AutocompleteGroupProps) {
	return <AutocompletePrimitive.Group {...props} />;
}

export type AutocompleteGroupLabelProps = AutocompletePrimitive.GroupLabel.Props;

export function AutocompleteGroupLabel(props: AutocompleteGroupLabelProps) {
	const { className, ...rest } = props;

	return (
		<AutocompletePrimitive.GroupLabel
			className={cn("p-2 text-neutral-11 text-xs uppercase", className)}
			{...rest}
		/>
	);
}

export type AutocompleteSeparatorProps = AutocompletePrimitive.Separator.Props;

export function AutocompleteSeparator(props: AutocompleteSeparatorProps) {
	const { className, ...rest } = props;

	return (
		<AutocompletePrimitive.Separator
			className={cn("my-1 h-px bg-neutral-6", className)}
			{...rest}
		/>
	);
}
