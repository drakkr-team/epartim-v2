import { Combobox as ComboboxHeadless } from "@base-ui/react/combobox";
import { createContext, useContext } from "react";
import { cn } from "tailwind-variants";

import { CheckIcon, ChevronsUpDownIcon, SearchIcon, XIcon } from "../../icons";
import { Button } from "../button";
import { ScrollArea } from "../scroll-area";

const ComboboxContext = createContext<{ multiple?: boolean }>({ multiple: false });

export type ComboboxRootProps<
	Value,
	Multiple extends boolean | undefined = false,
> = ComboboxHeadless.Root.Props<Value, Multiple>;

export function ComboboxRoot<Value, Multiple extends boolean | undefined = false>(
	props: ComboboxRootProps<Value, Multiple>,
) {
	const { autoHighlight = true, ...rest } = props;

	return (
		<ComboboxContext value={{ multiple: props.multiple }}>
			<ComboboxHeadless.Root autoHighlight={autoHighlight} {...rest} />
		</ComboboxContext>
	);
}

export type ComboboxInputProps = ComboboxHeadless.InputGroup.Props;

export function ComboboxInput(props: ComboboxInputProps) {
	const { children, className, ...rest } = props;

	const { multiple } = useContext(ComboboxContext);

	return (
		<ComboboxHeadless.InputGroup
			className={cn(
				"group relative inline-flex items-center justify-between gap-2 rounded-lg border border-neutral-7 bg-neutral-1 px-2 text-base text-neutral-12 outline-none ring-primary-7 transition sm:text-sm",
				"data-placeholder:text-neutral-9",
				"hover:not-disabled:border-neutral-8",
				"has-focus-visible:border-primary-8 has-focus-visible:ring-3 has-focus-visible:hover:border-primary-8",
				"data-popup-open:border-primary-8 data-popup-open:ring-3 data-popup-open:hover:border-primary-8",
				"data-invalid:border-error-7 data-invalid:ring-error-7",
				"data-invalid:hover:not-data-disabled:border-error-8",
				"data-invalid:focus-visible:border-error-8 data-invalid:hover:border-error-8",
				"data-invalid:data-popup-open:border-error-8 data-invalid:data-popup-open:hover:border-error-8",
				"data-disabled:cursor-not-allowed data-disabled:opacity-50",
				multiple ? "min-h-10 py-1 sm:min-h-9" : "h-10 sm:h-9",
				className,
			)}
			{...rest}
		>
			{multiple ? (
				<ComboboxHeadless.Chips className="flex flex-wrap items-center gap-1">
					{children}
				</ComboboxHeadless.Chips>
			) : (
				<>
					{children}
					<ComboboxHeadless.Clear
						className="absolute top-1/2 right-1.5 z-10 hidden -translate-y-1/2 bg-neutral-1 group-has-hover:inline-flex data-popup-open:inline-flex data-popup-open:bg-neutral-1"
						render={<Button size="icon-sm" variant="ghost" />}
					>
						<XIcon />
					</ComboboxHeadless.Clear>

					<ComboboxHeadless.Icon
						className="size-4 shrink-0 text-neutral-11"
						render={<ChevronsUpDownIcon />}
					/>
				</>
			)}

			<ComboboxHeadless.Trigger className="absolute inset-0 outline-none" />
		</ComboboxHeadless.InputGroup>
	);
}

export type ComboboxValueProps = ComboboxHeadless.Value.Props;

export function ComboboxValue(props: ComboboxValueProps) {
	return <ComboboxHeadless.Value {...props} />;
}

export type ComboboxChipProps = ComboboxHeadless.Chip.Props;

export function ComboboxChip(props: ComboboxChipProps) {
	const { children, className, ...rest } = props;

	return (
		<ComboboxHeadless.Chip
			className={cn(
				"relative z-10 flex items-center gap-1 rounded-sm bg-neutral-3 px-1 text-neutral-12 text-sm",
				className,
			)}
			{...rest}
		>
			{children}
			<ComboboxHeadless.ChipRemove
				className="shrink-0"
				render={<Button variant="ghost" size="icon-sm" />}
			>
				<XIcon />
			</ComboboxHeadless.ChipRemove>
		</ComboboxHeadless.Chip>
	);
}

export type ComboboxDropdownProps = ComboboxHeadless.Positioner.Props;

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
		<ComboboxHeadless.Portal>
			<ComboboxHeadless.Positioner
				className="select-none outline-none"
				align={align}
				sideOffset={sideOffset}
				collisionPadding={collisionPadding}
				{...rest}
			>
				<ComboboxHeadless.Popup
					className={cn(
						"grid max-h-[min(24rem,var(--available-height))] min-w-(--anchor-width) max-w-(--available-width) origin-(--transform-origin) grid-rows-[auto_1fr] rounded-lg border border-neutral-6 bg-neutral-1 shadow shadow-neutral-5 outline-none transition",
						"data-starting-style:data-[side=inline-end]:-translate-x-1 data-starting-style:data-[side=inline-start]:translate-x-1 data-starting-style:data-[side=left]:translate-x-1 data-starting-style:data-[side=right]:-translate-x-1 data-starting-style:data-[side=bottom]:-translate-y-1 data-starting-style:data-[side=top]:translate-y-1 data-starting-style:scale-95 data-starting-style:opacity-0 data-starting-style:blur-xs",
						"data-ending-style:data-[side=inline-end]:-translate-x-1 data-ending-style:data-[side=inline-start]:translate-x-1 data-ending-style:data-[side=left]:translate-x-1 data-ending-style:data-[side=right]:-translate-x-1 data-ending-style:data-[side=bottom]:-translate-y-1 data-ending-style:data-[side=top]:translate-y-1 data-ending-style:scale-95 data-ending-style:opacity-0 data-ending-style:blur-xs",
						className,
					)}
				>
					{children}
				</ComboboxHeadless.Popup>
			</ComboboxHeadless.Positioner>
		</ComboboxHeadless.Portal>
	);
}

export type ComboboxListProps = ComboboxHeadless.List.Props;

export function ComboboxList(props: ComboboxListProps) {
	const { className, ...rest } = props;

	return (
		<ScrollArea>
			<ComboboxHeadless.List
				className={cn("row-span-2 py-1 outline-none", "data-empty:hidden", className)}
				{...rest}
			/>
		</ScrollArea>
	);
}

export type ComboboxSearchInputProps = ComboboxHeadless.Input.Props;

export function ComboboxSearchInput(props: ComboboxSearchInputProps) {
	const { className, size = 1, ...rest } = props;

	return (
		<div className="relative">
			<ComboboxHeadless.Input
				size={size}
				className={cn(
					"row-span-1 h-10 w-full rounded-t-lg border-neutral-7 border-b bg-neutral-2 px-2 pl-8 text-base text-neutral-12 outline-none sm:h-9 sm:text-sm",
					"placeholder:text-neutral-9",
					className,
				)}
				{...rest}
			/>

			<SearchIcon className="pointer-events-none absolute top-1/2 left-2 size-4 -translate-y-1/2 text-neutral-11" />
		</div>
	);
}

export type ComboboxEmptyProps = ComboboxHeadless.Empty.Props;

export function ComboboxEmpty(props: ComboboxEmptyProps) {
	const { className, ...rest } = props;

	return <ComboboxHeadless.Empty className={cn("row-span-2", className)} {...rest} />;
}

export type ComboboxItemProps = ComboboxHeadless.Item.Props;

export function ComboboxItem(props: ComboboxItemProps) {
	const { children, className, ...rest } = props;

	return (
		<ComboboxHeadless.Item
			className={cn(
				"mx-1 flex h-9 items-center justify-between gap-2 rounded-md px-2 text-base text-neutral-12 outline-none sm:text-sm",
				"hover:not-data-disabled:bg-neutral-3",
				"data-highlighted:bg-neutral-3",
				"data-selected:bg-neutral-3",
				"data-selected:hover:not-data-disabled:bg-neutral-4",
				"data-selected:data-highlighted:bg-neutral-4",
				"data-disabled:cursor-not-allowed data-disabled:opacity-50",
				className,
			)}
			{...rest}
		>
			{children}
			<ComboboxHeadless.ItemIndicator className="size-4 shrink-0" render={<CheckIcon />} />
		</ComboboxHeadless.Item>
	);
}

export type ComboboxCollectionProps = ComboboxHeadless.Collection.Props;

export function ComboboxCollection(props: ComboboxCollectionProps) {
	return <ComboboxHeadless.Collection {...props} />;
}

export type ComboboxGroupProps = ComboboxHeadless.Group.Props;

export function ComboboxGroup(props: ComboboxGroupProps) {
	return <ComboboxHeadless.Group {...props} />;
}

export type ComboboxGroupLabelProps = ComboboxHeadless.GroupLabel.Props;

export function ComboboxGroupLabel(props: ComboboxGroupLabelProps) {
	const { className, ...rest } = props;

	return (
		<ComboboxHeadless.GroupLabel
			className={cn("p-2 text-neutral-11 text-xs uppercase", className)}
			{...rest}
		/>
	);
}

export type ComboboxSeparatorProps = ComboboxHeadless.Separator.Props;

export function ComboboxSeparator(props: ComboboxSeparatorProps) {
	const { className, ...rest } = props;

	return (
		<ComboboxHeadless.Separator className={cn("my-1 h-px bg-neutral-6", className)} {...rest} />
	);
}
