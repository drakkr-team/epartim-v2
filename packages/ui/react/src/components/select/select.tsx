import { Select as SelectHeadless } from "@base-ui/react/select";
import { cn } from "tailwind-variants";

import { CheckIcon, ChevronsUpDownIcon } from "../../icons";
import { ScrollArea } from "../scroll-area";

export type SelectRootProps<
	Value,
	Multiple extends boolean | undefined = false,
> = SelectHeadless.Root.Props<Value, Multiple>;

export function SelectRoot<Value, Multiple extends boolean | undefined = false>(
	props: SelectRootProps<Value, Multiple>,
) {
	return <SelectHeadless.Root {...props} />;
}

export type SelectInputProps = SelectHeadless.Trigger.Props;

export function SelectInput(props: SelectInputProps) {
	const { children, className, ...rest } = props;

	return (
		<SelectHeadless.Trigger
			className={cn(
				"inline-flex h-10 items-center justify-between gap-2 rounded-lg border border-neutral-7 bg-neutral-1 px-2 outline-none ring-primary-7 transition sm:h-9",
				"hover:not-disabled:border-neutral-8",
				"focus-visible:border-primary-8 focus-visible:ring-3 focus-visible:hover:border-primary-8",
				"data-popup-open:border-primary-8 data-popup-open:ring-3 data-popup-open:hover:border-primary-8",
				"data-invalid:border-error-7 data-invalid:ring-error-7",
				"data-invalid:hover:not-data-disabled:border-error-8",
				"data-invalid:focus-visible:border-error-8 data-invalid:hover:border-error-8",
				"data-invalid:data-popup-open:border-error-8 data-invalid:data-popup-open:hover:border-error-8",
				"data-disabled:cursor-not-allowed data-disabled:opacity-50",
				className,
			)}
			{...rest}
		>
			{children}
			<SelectHeadless.Icon
				className="size-4 shrink-0 text-neutral-11"
				render={<ChevronsUpDownIcon />}
			/>
		</SelectHeadless.Trigger>
	);
}

export type SelectValueProps = SelectHeadless.Value.Props;

export function SelectValue(props: SelectValueProps) {
	const { className, ...rest } = props;

	return (
		<SelectHeadless.Value
			className={cn(
				"truncate text-base text-neutral-12 sm:text-sm",
				"data-placeholder:text-neutral-9",
				className,
			)}
			{...rest}
		/>
	);
}

export type SelectDropdownProps = Omit<SelectHeadless.Positioner.Props, "alignItemWithTrigger">;

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
		<SelectHeadless.Portal>
			<SelectHeadless.Positioner
				className="select-none outline-none"
				alignItemWithTrigger={false}
				align={align}
				sideOffset={sideOffset}
				collisionPadding={collisionPadding}
				{...rest}
			>
				<SelectHeadless.Popup
					className={cn(
						"grid max-h-[min(24rem,var(--available-height))] min-w-(--anchor-width) max-w-(--available-width) origin-(--transform-origin) grid-rows-1 rounded-lg border border-neutral-6 bg-neutral-1 shadow shadow-neutral-5 outline-none transition",
						"data-starting-style:data-[side=inline-end]:-translate-x-1 data-starting-style:data-[side=inline-start]:translate-x-1 data-starting-style:data-[side=left]:translate-x-1 data-starting-style:data-[side=right]:-translate-x-1 data-starting-style:data-[side=bottom]:-translate-y-1 data-starting-style:data-[side=top]:translate-y-1 data-starting-style:scale-95 data-starting-style:opacity-0 data-starting-style:blur-xs",
						"data-ending-style:data-[side=inline-end]:-translate-x-1 data-ending-style:data-[side=inline-start]:translate-x-1 data-ending-style:data-[side=left]:translate-x-1 data-ending-style:data-[side=right]:-translate-x-1 data-ending-style:data-[side=bottom]:-translate-y-1 data-ending-style:data-[side=top]:translate-y-1 data-ending-style:scale-95 data-ending-style:opacity-0 data-ending-style:blur-xs",
						className,
					)}
				>
					<ScrollArea>
						<SelectHeadless.List className="py-1 outline-none">{children}</SelectHeadless.List>
					</ScrollArea>
				</SelectHeadless.Popup>
			</SelectHeadless.Positioner>
		</SelectHeadless.Portal>
	);
}

export type SelectOptionProps = SelectHeadless.Item.Props;

export function SelectOption(props: SelectOptionProps) {
	const { children, className, ...rest } = props;

	return (
		<SelectHeadless.Item
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
			<SelectHeadless.ItemText className="truncate">{children}</SelectHeadless.ItemText>
			<SelectHeadless.ItemIndicator className="size-4 shrink-0" render={<CheckIcon />} />
		</SelectHeadless.Item>
	);
}

export type SelectGroupProps = SelectHeadless.Group.Props;

export function SelectGroup(props: SelectGroupProps) {
	return <SelectHeadless.Group {...props} />;
}

export type SelectGroupLabelProps = SelectHeadless.GroupLabel.Props;

export function SelectGroupLabel(props: SelectGroupLabelProps) {
	const { className, ...rest } = props;

	return (
		<SelectHeadless.GroupLabel
			className={cn("p-2 text-neutral-11 text-xs uppercase", className)}
			{...rest}
		/>
	);
}

export type SelectSeparatorProps = SelectHeadless.Separator.Props;

export function SelectSeparator(props: SelectSeparatorProps) {
	const { className, ...rest } = props;

	return <SelectHeadless.Separator className={cn("my-1 h-px bg-neutral-6", className)} {...rest} />;
}
