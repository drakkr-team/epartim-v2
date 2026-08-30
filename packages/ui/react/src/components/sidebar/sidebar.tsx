import type { ComponentProps } from "react";
import { cn } from "tailwind-variants";

export type SidebarRootProps = ComponentProps<"aside">;

export function SidebarRoot(props: SidebarRootProps) {
	const { className, ...rest } = props;

	return (
		<aside
			className={cn(
				"fixed top-0 left-0 grid h-svh w-64 shrink-0 grid-rows-[auto_1fr_auto] bg-secondary-9",
				className,
			)}
			{...rest}
		/>
	);
}

export type SidebarHeaderProps = ComponentProps<"header">;

export function SidebarHeader(props: SidebarHeaderProps) {
	const { className, ...rest } = props;

	return <header className={cn("px-6 pt-10 pb-4", className)} {...rest} />;
}

export type SidebarBodyProps = ComponentProps<"div">;

export function SidebarBody(props: SidebarBodyProps) {
	const { className, ...rest } = props;

	return <div className={cn("overflow-auto px-4 pt-0 pb-6", className)} {...rest} />;
}

export type SidebarFooterProps = ComponentProps<"footer">;

export function SidebarFooter(props: SidebarFooterProps) {
	const { className, ...rest } = props;

	return <footer className={cn("mt-auto px-6 py-6", className)} {...rest} />;
}

export type SidebarGroupProps = ComponentProps<"section">;

export function SidebarGroup(props: SidebarGroupProps) {
	const { className, ...rest } = props;

	return <section className={cn("mt-5 flex flex-col", className)} {...rest} />;
}

export type SidebarGroupLabelProps = ComponentProps<"p">;

export function SidebarGroupLabel(props: SidebarGroupLabelProps) {
	const { className, ...rest } = props;

	return (
		<p
			className={cn(
				"px-3 font-semibold text-2xs text-primary-9 uppercase tracking-widest",
				className,
			)}
			{...rest}
		/>
	);
}

export type SidebarItemProps = ComponentProps<"button"> & {
	active?: boolean;
};

export function SidebarItem(props: SidebarItemProps) {
	const { active, className, ...rest } = props;

	return (
		<button
			className={cn(
				"flex h-10 w-full cursor-pointer items-center gap-3 rounded-md px-3 text-neutral-1/75 text-xs transition-colors hover:bg-secondary-10/50 hover:text-neutral-1 [&_svg]:size-5",
				active &&
					"relative bg-secondary-10 font-semibold text-primary-9 before:absolute before:inset-y-2 before:left-0 before:w-0.5 before:rounded-r before:bg-primary-9 hover:text-primary-9",
				className,
			)}
			{...rest}
		/>
	);
}
