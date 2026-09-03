import { Autocomplete as AutocompleteHeadless } from "@base-ui/react/autocomplete";
import { cn } from "tailwind-variants";

import { Input, type InputProps } from "../input";
import { ScrollArea } from "../scroll-area";

export type AutocompleteRootProps<ItemValue> = AutocompleteHeadless.Root.Props<ItemValue>;

export function AutocompleteRoot<ItemValue>(props: AutocompleteRootProps<ItemValue>) {
	const { autoHighlight = true, ...rest } = props;

	// @ts-expect-error - type inference issue with generic component on Base UI end
	return <AutocompleteHeadless.Root autoHighlight={autoHighlight} {...rest} />;
}

export type AutoCompleteInputProps = Omit<InputProps, "render">;

export function AutocompleteInput(props: AutoCompleteInputProps) {
	return <AutocompleteHeadless.Input render={<Input />} {...props} />;
}

export type AutocompleteDropdownProps = AutocompleteHeadless.Positioner.Props;

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
		<AutocompleteHeadless.Portal>
			<AutocompleteHeadless.Positioner
				className="select-none outline-none"
				align={align}
				sideOffset={sideOffset}
				collisionPadding={collisionPadding}
				{...rest}
			>
				<AutocompleteHeadless.Popup
					className={cn(
						"flex max-h-[min(24rem,var(--available-height))] min-w-(--anchor-width) max-w-(--available-width) origin-(--transform-origin) grid-rows-1 flex-col rounded-md border border-neutral-6 bg-neutral-1 shadow shadow-neutral-5 outline-none transition",
						"data-starting-style:data-[side=inline-end]:-translate-x-1 data-starting-style:data-[side=inline-start]:translate-x-1 data-starting-style:data-[side=left]:translate-x-1 data-starting-style:data-[side=right]:-translate-x-1 data-starting-style:data-[side=bottom]:-translate-y-1 data-starting-style:data-[side=top]:translate-y-1 data-starting-style:scale-95 data-starting-style:opacity-0 data-starting-style:blur-xs",
						"data-ending-style:data-[side=inline-end]:-translate-x-1 data-ending-style:data-[side=inline-start]:translate-x-1 data-ending-style:data-[side=left]:translate-x-1 data-ending-style:data-[side=right]:-translate-x-1 data-ending-style:data-[side=bottom]:-translate-y-1 data-ending-style:data-[side=top]:translate-y-1 data-ending-style:scale-95 data-ending-style:opacity-0 data-ending-style:blur-xs",
						className,
					)}
				>
					{children}
				</AutocompleteHeadless.Popup>
			</AutocompleteHeadless.Positioner>
		</AutocompleteHeadless.Portal>
	);
}

export type AutocompleteListProps = AutocompleteHeadless.List.Props;

export function AutocompleteList(props: AutocompleteListProps) {
	const { className, ...rest } = props;

	return (
		<ScrollArea>
			<AutocompleteHeadless.List
				className={cn("py-1 outline-none", "data-empty:hidden", className)}
				{...rest}
			/>
		</ScrollArea>
	);
}

export type AutocompleteItemProps = AutocompleteHeadless.Item.Props;

export function AutocompleteItem(props: AutocompleteItemProps) {
	const { className, ...rest } = props;

	return (
		<AutocompleteHeadless.Item
			className={cn(
				"mx-1 flex h-10 items-center rounded-md px-2 text-base text-neutral-12 outline-none sm:h-9 sm:text-sm",
				"hover:not-data-disabled:bg-neutral-3",
				"data-highlighted:bg-neutral-3",
				"data-selected:bg-neutral-3",
				"data-selected:hover:not-data-disabled:bg-neutral-4",
				"data-selected:data-highlighted:bg-neutral-4",
				"data-disabled:cursor-not-allowed data-disabled:opacity-50",
				className,
			)}
			{...rest}
		/>
	);
}

export type AutocompleteEmptyProps = AutocompleteHeadless.Empty.Props;

export function AutocompleteEmpty(props: AutocompleteEmptyProps) {
	return <AutocompleteHeadless.Empty {...props} />;
}

export type AutocompleteCollectionProps = AutocompleteHeadless.Collection.Props;

export function AutocompleteCollection(props: AutocompleteCollectionProps) {
	return <AutocompleteHeadless.Collection {...props} />;
}

export type AutocompleteGroupProps = AutocompleteHeadless.Group.Props;

export function AutocompleteGroup(props: AutocompleteGroupProps) {
	return <AutocompleteHeadless.Group {...props} />;
}

export type AutocompleteGroupLabelProps = AutocompleteHeadless.GroupLabel.Props;

export function AutocompleteGroupLabel(props: AutocompleteGroupLabelProps) {
	const { className, ...rest } = props;

	return (
		<AutocompleteHeadless.GroupLabel
			className={cn("p-2 text-neutral-11 text-xs uppercase", className)}
			{...rest}
		/>
	);
}

export type AutocompleteSeparatorProps = AutocompleteHeadless.Separator.Props;

export function AutocompleteSeparator(props: AutocompleteSeparatorProps) {
	const { className, ...rest } = props;

	return (
		<AutocompleteHeadless.Separator className={cn("my-1 h-px bg-neutral-6", className)} {...rest} />
	);
}
