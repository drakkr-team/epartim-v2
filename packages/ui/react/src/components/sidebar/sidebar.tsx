import type { ComponentProps } from "react";
import { cn } from "tailwind-variants";

export type SidebarRootProps = ComponentProps<"aside">;

export function SidebarRoot(props: SidebarRootProps) {
	const { className, ...rest } = props;

	return (
		<aside
			className={cn(
				"grid h-svh w-64 shrink-0 grid-rows-[auto_1fr_auto] border-r-0 bg-primary-12 text-primary-1",
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

	return (
		<footer className={cn("mt-auto border-primary-4/15 border-t px-6 py-6", className)} {...rest} />
	);
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
				"px-3 font-semibold text-secondary-9 text-xs uppercase tracking-[0.2em]",
				className,
			)}
			{...rest}
		/>
	);
}

export type SidebarItemProps = ComponentProps<"span"> & {
	active?: boolean;
};

export function SidebarItem(props: SidebarItemProps) {
	const { active, className, ...rest } = props;

	return (
		<span
			data-active={active || undefined}
			className={cn(
				"flex h-10 w-full items-center gap-3 rounded-lg px-3 text-primary-6 text-xs transition-colors hover:bg-primary-5/10 hover:text-primary-1 focus-visible:outline-2 focus-visible:outline-secondary-9 focus-visible:outline-offset-2 [&_svg]:size-5",
				active &&
					"relative bg-primary-5/15 font-semibold text-secondary-9 before:absolute before:inset-y-2 before:left-0 before:w-0.5 before:rounded-r before:bg-secondary-9",
				className,
			)}
			{...rest}
		/>
	);
}
