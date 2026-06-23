import { Menu as MenuPrimitive } from "@base-ui/react/menu";
import { cn, tv, type VariantProps } from "tailwind-variants";

import { CheckIcon, ChevronRightIcon } from "../../icons";
import { ScrollArea } from "../scroll-area";

export type MenuRootProps = MenuPrimitive.Root.Props;

export function MenuRoot(props: MenuRootProps) {
	return <MenuPrimitive.Root {...props} />;
}

export type MenuTriggerProps = MenuPrimitive.Trigger.Props;

export function MenuTrigger(props: MenuTriggerProps) {
	return <MenuPrimitive.Trigger {...props} />;
}

export type MenuContentProps = MenuPrimitive.Positioner.Props;

export function MenuContent(props: MenuContentProps) {
	const { children, className, sideOffset = 4, collisionPadding = 16, ...rest } = props;

	return (
		<MenuPrimitive.Portal>
			<MenuPrimitive.Positioner
				sideOffset={sideOffset}
				collisionPadding={collisionPadding}
				{...rest}
			>
				<MenuPrimitive.Popup
					className={cn(
						// Default
						"max-w-(--available-width) origin-(--transform-origin) rounded-lg border border-neutral-6 bg-neutral-1 py-1 shadow shadow-neutral-5 outline-none blur-none transition",
						// Starting Animation
						"data-starting-style:data-[side=inline-end]:-translate-x-1 data-starting-style:data-[side=inline-start]:translate-x-1 data-starting-style:data-[side=left]:translate-x-1 data-starting-style:data-[side=right]:-translate-x-1 data-starting-style:data-[side=bottom]:-translate-y-1 data-starting-style:data-[side=top]:translate-y-1 data-starting-style:scale-95 data-starting-style:opacity-0 data-starting-style:blur-xs",
						// Ending Animation
						"data-ending-style:data-[side=inline-end]:-translate-x-1 data-ending-style:data-[side=inline-start]:translate-x-1 data-ending-style:data-[side=left]:translate-x-1 data-ending-style:data-[side=right]:-translate-x-1 data-ending-style:data-[side=bottom]:-translate-y-1 data-ending-style:data-[side=top]:translate-y-1 data-ending-style:scale-95 data-ending-style:opacity-0 data-ending-style:blur-xs",
						// Overwrite
						className,
					)}
				>
					<ScrollArea>
						<div className="max-h-(--available-height)">{children}</div>
					</ScrollArea>
				</MenuPrimitive.Popup>
			</MenuPrimitive.Positioner>
		</MenuPrimitive.Portal>
	);
}

export type MenuSubmenuProps = MenuPrimitive.SubmenuRoot.Props;

export function MenuSubmenu(props: MenuSubmenuProps) {
	return <MenuPrimitive.SubmenuRoot {...props} />;
}

export type MenuSubmenuTriggerProps = MenuPrimitive.SubmenuTrigger.Props;

export function MenuSubmenuTrigger(props: MenuSubmenuTriggerProps) {
	const { children, className, ...rest } = props;

	return (
		<MenuPrimitive.SubmenuTrigger
			className={cn(
				// Default
				"mx-1 flex cursor-default select-none items-center gap-2 rounded-md px-3 py-1.5 text-neutral-12 text-sm outline-none [&_svg]:size-4",
				// Hover
				"hover:not-data-disabled:bg-neutral-3",
				// Highlighted
				"data-highlighted:not-data-disabled:bg-neutral-3",
				// Popup Open
				"data-popup-open:bg-neutral-3",
				// Disabled
				"data-disabled:cursor-not-allowed data-disabled:opacity-50",
				// Overwrite
				className,
			)}
			{...rest}
		>
			{children}
			<span className="ml-auto pl-2">
				<ChevronRightIcon />
			</span>
		</MenuPrimitive.SubmenuTrigger>
	);
}

export type MenuGroupProps = MenuPrimitive.Group.Props;

export function MenuGroup(props: MenuGroupProps) {
	return <MenuPrimitive.Group {...props} />;
}

export type MenuGroupLabelProps = MenuPrimitive.GroupLabel.Props;

export function MenuGroupLabel(props: MenuGroupLabelProps) {
	const { className, ...rest } = props;

	return (
		<MenuPrimitive.GroupLabel
			className={cn("mx-1 px-3 py-1 text-neutral-11 text-sm", className)}
			{...rest}
		/>
	);
}

export type MenuSeparatorProps = MenuPrimitive.Separator.Props;

export function MenuSeparator(props: MenuSeparatorProps) {
	const { className, ...rest } = props;

	return (
		<MenuPrimitive.Separator className={cn("my-1.5 h-px bg-neutral-6", className)} {...rest} />
	);
}

const menuItemVariants = tv({
	base: [
		// Default
		"mx-1 flex cursor-pointer select-none items-center gap-2 rounded-md px-3 py-1.5 text-sm outline-none [&_svg]:size-4",
		// Disabled
		"data-disabled:cursor-not-allowed data-disabled:opacity-50",
	],
	variants: {
		variant: {
			default: [
				// Default
				"text-neutral-12",
				// Hover
				"hover:not-data-disabled:bg-neutral-3",
				// Highlighted
				"data-highlighted:not-data-disabled:bg-neutral-3",
			],
			destructive: [
				// Default
				"text-error-9",
				// Hover
				"hover:not-data-disabled:bg-error-3",
				// Highlighted
				"data-highlighted:not-data-disabled:bg-error-3",
			],
		},
	},
	defaultVariants: {
		variant: "default",
	},
});

export type MenuItemProps = MenuPrimitive.Item.Props & VariantProps<typeof menuItemVariants>;

export function MenuItem(props: MenuItemProps) {
	const { className, variant, ...rest } = props;

	return (
		<MenuPrimitive.Item
			className={menuItemVariants({ variant, className: className?.toString() })}
			{...rest}
		/>
	);
}

export type MenuCheckboxItemProps = MenuPrimitive.CheckboxItem.Props;

export function MenuCheckboxItem(props: MenuCheckboxItemProps) {
	const { children, className, ...rest } = props;

	return (
		<MenuPrimitive.CheckboxItem
			className={cn(
				// Default
				"mx-1 flex cursor-pointer select-none items-center gap-2 rounded-md px-3 py-1.5 text-neutral-12 text-sm outline-none [&_svg]:size-4",
				// Hover
				"hover:not-data-disabled:bg-neutral-3",
				// Highlighted
				"data-highlighted:not-data-disabled:bg-neutral-3",
				// Disabled
				"data-disabled:cursor-not-allowed data-disabled:opacity-50",
				// Overwrite
				className,
			)}
			{...rest}
		>
			{children}
			<MenuPrimitive.CheckboxItemIndicator
				keepMounted
				className="ml-auto size-4"
				render={(props, state) =>
					state.checked ? (
						<CheckIcon className={props.className} />
					) : (
						<span className={props.className} />
					)
				}
			/>
		</MenuPrimitive.CheckboxItem>
	);
}

export type MenuRadioGroupProps = MenuPrimitive.RadioGroup.Props;

export function MenuRadioGroup(props: MenuRadioGroupProps) {
	return <MenuPrimitive.RadioGroup {...props} />;
}

export type MenuRadioItemProps = MenuPrimitive.RadioItem.Props;

export function MenuRadioItem(props: MenuRadioItemProps) {
	const { children, className, ...rest } = props;

	return (
		<MenuPrimitive.RadioItem
			className={cn(
				// Default
				"mx-1 flex cursor-pointer select-none items-center gap-2 rounded-md px-3 py-1.5 text-neutral-12 text-sm outline-none [&_svg]:size-4",
				// Hover
				"hover:not-data-disabled:bg-neutral-3",
				// Highlighted
				"data-highlighted:not-data-disabled:bg-neutral-3",
				// Disabled
				"data-disabled:cursor-not-allowed data-disabled:opacity-50",
				// Overwrite
				className,
			)}
			{...rest}
		>
			{children}
			<MenuPrimitive.RadioItemIndicator
				className="ml-auto size-4"
				keepMounted
				render={(props, state) =>
					state.checked ? (
						<CheckIcon className={props.className} />
					) : (
						<span className={props.className} />
					)
				}
			/>
		</MenuPrimitive.RadioItem>
	);
}
