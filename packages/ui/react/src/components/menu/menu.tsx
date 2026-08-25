import { Menu as MenuHeadless } from "@base-ui/react/menu";
import { cn, tv, type VariantProps } from "tailwind-variants";

import { CheckIcon, ChevronRightIcon } from "../../icons";
import { ScrollArea } from "../scroll-area";

export type MenuRootProps = MenuHeadless.Root.Props;

export function MenuRoot(props: MenuRootProps) {
	return <MenuHeadless.Root {...props} />;
}

export type MenuTriggerProps = MenuHeadless.Trigger.Props;

export function MenuTrigger(props: MenuTriggerProps) {
	return <MenuHeadless.Trigger {...props} />;
}

export type MenuContentProps = MenuHeadless.Positioner.Props;

export function MenuContent(props: MenuContentProps) {
	const { children, className, sideOffset = 4, collisionPadding = 16, ...rest } = props;

	return (
		<MenuHeadless.Portal>
			<MenuHeadless.Positioner
				sideOffset={sideOffset}
				collisionPadding={collisionPadding}
				{...rest}
			>
				<MenuHeadless.Popup
					className={cn(
						"max-w-(--available-width) origin-(--transform-origin) rounded-md border border-neutral-6 bg-neutral-1 py-1 shadow shadow-neutral-5 outline-none blur-none transition",
						"data-starting-style:data-[side=inline-end]:-translate-x-1 data-starting-style:data-[side=inline-start]:translate-x-1 data-starting-style:data-[side=left]:translate-x-1 data-starting-style:data-[side=right]:-translate-x-1 data-starting-style:data-[side=bottom]:-translate-y-1 data-starting-style:data-[side=top]:translate-y-1 data-starting-style:scale-95 data-starting-style:opacity-0 data-starting-style:blur-xs",
						"data-ending-style:data-[side=inline-end]:-translate-x-1 data-ending-style:data-[side=inline-start]:translate-x-1 data-ending-style:data-[side=left]:translate-x-1 data-ending-style:data-[side=right]:-translate-x-1 data-ending-style:data-[side=bottom]:-translate-y-1 data-ending-style:data-[side=top]:translate-y-1 data-ending-style:scale-95 data-ending-style:opacity-0 data-ending-style:blur-xs",
						className,
					)}
				>
					<ScrollArea>
						<div className="max-h-(--available-height)">{children}</div>
					</ScrollArea>
				</MenuHeadless.Popup>
			</MenuHeadless.Positioner>
		</MenuHeadless.Portal>
	);
}

export type MenuSubmenuProps = MenuHeadless.SubmenuRoot.Props;

export function MenuSubmenu(props: MenuSubmenuProps) {
	return <MenuHeadless.SubmenuRoot {...props} />;
}

export type MenuSubmenuTriggerProps = MenuHeadless.SubmenuTrigger.Props;

export function MenuSubmenuTrigger(props: MenuSubmenuTriggerProps) {
	const { children, className, ...rest } = props;

	return (
		<MenuHeadless.SubmenuTrigger
			className={cn(
				"mx-1 flex cursor-default select-none items-center gap-2 rounded-md px-3 py-1.5 text-neutral-12 text-sm outline-none [&_svg]:size-4",
				"hover:not-data-disabled:bg-neutral-3",
				"data-highlighted:not-data-disabled:bg-neutral-3",
				"data-popup-open:bg-neutral-4",
				"data-disabled:cursor-not-allowed data-disabled:opacity-50",
				className,
			)}
			{...rest}
		>
			{children}
			<span className="ml-auto pl-2">
				<ChevronRightIcon />
			</span>
		</MenuHeadless.SubmenuTrigger>
	);
}

export type MenuGroupProps = MenuHeadless.Group.Props;

export function MenuGroup(props: MenuGroupProps) {
	return <MenuHeadless.Group {...props} />;
}

export type MenuGroupLabelProps = MenuHeadless.GroupLabel.Props;

export function MenuGroupLabel(props: MenuGroupLabelProps) {
	const { className, ...rest } = props;

	return (
		<MenuHeadless.GroupLabel
			className={cn("mx-1 px-3 py-1 text-neutral-11 text-sm", className)}
			{...rest}
		/>
	);
}

export type MenuSeparatorProps = MenuHeadless.Separator.Props;

export function MenuSeparator(props: MenuSeparatorProps) {
	const { className, ...rest } = props;

	return <MenuHeadless.Separator className={cn("my-1.5 h-px bg-neutral-6", className)} {...rest} />;
}

const menuItemVariants = tv({
	base: [
		"mx-1 flex cursor-pointer select-none items-center gap-2 rounded-md px-3 py-1.5 text-sm outline-none [&_svg]:size-4",
		"data-disabled:cursor-not-allowed data-disabled:opacity-50",
	],
	variants: {
		variant: {
			default: [
				"text-neutral-12",
				"hover:not-data-disabled:bg-neutral-3",
				"data-highlighted:not-data-disabled:bg-neutral-3",
				"active:not-data-disabled:bg-neutral-4!",
			],
			destructive: [
				"text-error-9",
				"hover:not-data-disabled:bg-error-3",
				"data-highlighted:not-data-disabled:bg-error-3",
				"active:not-data-disabled:bg-error-4!",
			],
		},
	},
	defaultVariants: {
		variant: "default",
	},
});

export type MenuItemProps = MenuHeadless.Item.Props & VariantProps<typeof menuItemVariants>;

export function MenuItem(props: MenuItemProps) {
	const { className, variant, ...rest } = props;

	return (
		<MenuHeadless.Item
			className={menuItemVariants({ variant, className: className?.toString() })}
			{...rest}
		/>
	);
}

export type MenuCheckboxItemProps = MenuHeadless.CheckboxItem.Props;

export function MenuCheckboxItem(props: MenuCheckboxItemProps) {
	const { children, className, ...rest } = props;

	return (
		<MenuHeadless.CheckboxItem
			className={cn(
				"mx-1 flex cursor-pointer select-none items-center gap-2 rounded-md px-3 py-1.5 text-neutral-12 text-sm outline-none [&_svg]:size-4",
				"hover:not-data-disabled:bg-neutral-3",
				"data-highlighted:not-data-disabled:bg-neutral-3",
				"active:not-data-disabled:bg-neutral-4!",
				"data-disabled:cursor-not-allowed data-disabled:opacity-50",
				className,
			)}
			{...rest}
		>
			{children}
			<MenuHeadless.CheckboxItemIndicator
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
		</MenuHeadless.CheckboxItem>
	);
}

export type MenuRadioGroupProps = MenuHeadless.RadioGroup.Props;

export function MenuRadioGroup(props: MenuRadioGroupProps) {
	return <MenuHeadless.RadioGroup {...props} />;
}

export type MenuRadioItemProps = MenuHeadless.RadioItem.Props;

export function MenuRadioItem(props: MenuRadioItemProps) {
	const { children, className, ...rest } = props;

	return (
		<MenuHeadless.RadioItem
			className={cn(
				"mx-1 flex cursor-pointer select-none items-center gap-2 rounded-md px-3 py-1.5 text-neutral-12 text-sm outline-none [&_svg]:size-4",
				"hover:not-data-disabled:bg-neutral-3",
				"data-highlighted:not-data-disabled:bg-neutral-3",
				"active:not-data-disabled:bg-neutral-4!",
				"data-disabled:cursor-not-allowed data-disabled:opacity-50",
				className,
			)}
			{...rest}
		>
			{children}
			<MenuHeadless.RadioItemIndicator
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
		</MenuHeadless.RadioItem>
	);
}
