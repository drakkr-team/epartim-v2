import { Combobox as ComboboxPrimitive } from "@base-ui/react/combobox";
import { createContext, useContext } from "react";
import { cn } from "tailwind-variants";

import { CheckIcon, ChevronsUpDownIcon, SearchIcon, XIcon } from "../../icons";
import { Button } from "../button";
import { ScrollArea } from "../scroll-area";

const ComboboxContext = createContext<{ multiple?: boolean }>({ multiple: false });

export type ComboboxRootProps<
	Value,
	Multiple extends boolean | undefined = false,
> = ComboboxPrimitive.Root.Props<Value, Multiple>;

export function ComboboxRoot<Value, Multiple extends boolean | undefined = false>(
	props: ComboboxRootProps<Value, Multiple>,
) {
	const { autoHighlight = true, ...rest } = props;

	return (
		<ComboboxContext value={{ multiple: props.multiple }}>
			<ComboboxPrimitive.Root autoHighlight={autoHighlight} {...rest} />
		</ComboboxContext>
	);
}

export type ComboboxInputProps = ComboboxPrimitive.InputGroup.Props;

export function ComboboxInput(props: ComboboxInputProps) {
	const { children, className, ...rest } = props;

	const { multiple } = useContext(ComboboxContext);

	return (
		<ComboboxPrimitive.InputGroup
			className={cn(
				// Default
				"group relative inline-flex items-center justify-between gap-2 rounded-lg border border-neutral-7 bg-neutral-1 px-2 text-base text-neutral-12 outline-none ring-primary-7 transition sm:text-sm",
				// Placeholder
				"data-placeholder:text-neutral-9",
				// Hover
				"hover:not-disabled:border-neutral-8",
				// Focus
				"has-focus-visible:border-primary-8 has-focus-visible:ring-3 has-focus-visible:hover:border-primary-8",
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
				// Multiple
				multiple ? "min-h-10 py-1 sm:min-h-9" : "h-10 sm:h-9",
				// Overwrite
				className,
			)}
			{...rest}
		>
			{multiple ? (
				<ComboboxPrimitive.Chips className="flex flex-wrap items-center gap-1">
					{children}
				</ComboboxPrimitive.Chips>
			) : (
				<>
					{children}
					<ComboboxPrimitive.Clear
						className="absolute top-1/2 right-1.5 z-10 hidden -translate-y-1/2 bg-neutral-1 group-has-hover:inline-flex data-popup-open:inline-flex data-popup-open:bg-neutral-1"
						render={<Button size="icon-sm" variant="ghost" />}
					>
						<XIcon />
					</ComboboxPrimitive.Clear>

					<ComboboxPrimitive.Icon
						className="size-4 shrink-0 text-neutral-11"
						render={<ChevronsUpDownIcon />}
					/>
				</>
			)}

			<ComboboxPrimitive.Trigger className="absolute inset-0 outline-none" />
		</ComboboxPrimitive.InputGroup>
	);
}

export type ComboboxValueProps = ComboboxPrimitive.Value.Props;

export function ComboboxValue(props: ComboboxValueProps) {
	return <ComboboxPrimitive.Value {...props} />;
}

export type ComboboxChipProps = ComboboxPrimitive.Chip.Props;

export function ComboboxChip(props: ComboboxChipProps) {
	const { children, className, ...rest } = props;

	return (
		<ComboboxPrimitive.Chip
			className={cn(
				// Default
				"relative z-10 flex items-center gap-1 rounded-sm bg-neutral-3 px-1 text-neutral-12 text-sm",
				// Overwrite
				className,
			)}
			{...rest}
		>
			{children}
			<ComboboxPrimitive.ChipRemove
				className="shrink-0"
				render={<Button variant="ghost" size="icon-sm" />}
			>
				<XIcon />
			</ComboboxPrimitive.ChipRemove>
		</ComboboxPrimitive.Chip>
	);
}

export type ComboboxDropdownProps = ComboboxPrimitive.Positioner.Props;

export function ComboboxDropdown(props: ComboboxDropdownProps) {
	const {
		children,
		className,
		align = "start",
		sideOffset = 8,
		collisionPadding = 16,
		...rest
	} = props;

	return (
		<ComboboxPrimitive.Portal>
			<ComboboxPrimitive.Positioner
				className="select-none outline-none"
				align={align}
				sideOffset={sideOffset}
				collisionPadding={collisionPadding}
				{...rest}
			>
				<ComboboxPrimitive.Popup
					className={cn(
						// Default
						"grid max-h-[min(24rem,var(--available-height))] min-w-(--anchor-width) max-w-(--available-width) origin-(--transform-origin) grid-rows-[auto_1fr] rounded-lg border border-neutral-6 bg-neutral-1 shadow shadow-neutral-5 outline-none transition",
						// Starting Animation
						"data-starting-style:data-[side=inline-end]:-translate-x-1 data-starting-style:data-[side=inline-start]:translate-x-1 data-starting-style:data-[side=left]:translate-x-1 data-starting-style:data-[side=right]:-translate-x-1 data-starting-style:data-[side=bottom]:-translate-y-1 data-starting-style:data-[side=top]:translate-y-1 data-starting-style:scale-95 data-starting-style:opacity-0 data-starting-style:blur-xs",
						// Ending Animation
						"data-ending-style:data-[side=inline-end]:-translate-x-1 data-ending-style:data-[side=inline-start]:translate-x-1 data-ending-style:data-[side=left]:translate-x-1 data-ending-style:data-[side=right]:-translate-x-1 data-ending-style:data-[side=bottom]:-translate-y-1 data-ending-style:data-[side=top]:translate-y-1 data-ending-style:scale-95 data-ending-style:opacity-0 data-ending-style:blur-xs",
						// Overwrite
						className,
					)}
				>
					{children}
				</ComboboxPrimitive.Popup>
			</ComboboxPrimitive.Positioner>
		</ComboboxPrimitive.Portal>
	);
}

export type ComboboxListProps = ComboboxPrimitive.List.Props;

export function ComboboxList(props: ComboboxListProps) {
	const { className, ...rest } = props;

	return (
		<ScrollArea>
			<ComboboxPrimitive.List
				className={cn(
					// Default
					"row-span-2 py-1 outline-none",
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

export type ComboboxSearchInputProps = ComboboxPrimitive.Input.Props;

export function ComboboxSearchInput(props: ComboboxSearchInputProps) {
	const { className, size = 1, ...rest } = props;

	return (
		<div className="relative">
			<ComboboxPrimitive.Input
				size={size}
				className={cn(
					// Default
					"row-span-1 h-10 w-full rounded-t-lg border-neutral-7 border-b bg-neutral-2 px-2 pl-8 text-base text-neutral-12 outline-none sm:h-9 sm:text-sm",
					// Placeholder
					"placeholder:text-neutral-9",
					// Overwrite
					className,
				)}
				{...rest}
			/>

			<SearchIcon className="pointer-events-none absolute top-1/2 left-2 size-4 -translate-y-1/2 text-neutral-11" />
		</div>
	);
}

export type ComboboxEmptyProps = ComboboxPrimitive.Empty.Props;

export function ComboboxEmpty(props: ComboboxEmptyProps) {
	const { className, ...rest } = props;

	return <ComboboxPrimitive.Empty className={cn("row-span-2", className)} {...rest} />;
}

export type ComboboxItemProps = ComboboxPrimitive.Item.Props;

export function ComboboxItem(props: ComboboxItemProps) {
	const { children, className, ...rest } = props;

	return (
		<ComboboxPrimitive.Item
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
			{children}
			<ComboboxPrimitive.ItemIndicator className="size-4 shrink-0" render={<CheckIcon />} />
		</ComboboxPrimitive.Item>
	);
}

export type ComboboxCollectionProps = ComboboxPrimitive.Collection.Props;

export function ComboboxCollection(props: ComboboxCollectionProps) {
	return <ComboboxPrimitive.Collection {...props} />;
}

export type ComboboxGroupProps = ComboboxPrimitive.Group.Props;

export function ComboboxGroup(props: ComboboxGroupProps) {
	return <ComboboxPrimitive.Group {...props} />;
}

export type ComboboxGroupLabelProps = ComboboxPrimitive.GroupLabel.Props;

export function ComboboxGroupLabel(props: ComboboxGroupLabelProps) {
	const { className, ...rest } = props;

	return (
		<ComboboxPrimitive.GroupLabel
			className={cn("p-2 text-neutral-11 text-xs uppercase", className)}
			{...rest}
		/>
	);
}

export type ComboboxSeparatorProps = ComboboxPrimitive.Separator.Props;

export function ComboboxSeparator(props: ComboboxSeparatorProps) {
	const { className, ...rest } = props;

	return (
		<ComboboxPrimitive.Separator className={cn("my-1 h-px bg-neutral-6", className)} {...rest} />
	);
}
