import type { ComponentProps } from "react";
import { cn } from "tailwind-variants";

export type SidebarRootProps = ComponentProps<"aside">;

export function SidebarRoot(props: SidebarRootProps) {
	const { className, ...rest } = props;

	return (
		<aside
			className={cn(
				"grid h-svh w-72 shrink-0 grid-rows-[auto_1fr_auto] border-neutral-7 border-r bg-neutral-1",
				className,
			)}
			{...rest}
		/>
	);
}

export type SidebarHeaderProps = ComponentProps<"header">;

export function SidebarHeader(props: SidebarHeaderProps) {
	const { className, ...rest } = props;

	return <header className={cn("p-2", className)} {...rest} />;
}

export type SidebarBodyProps = ComponentProps<"div">;

export function SidebarBody(props: SidebarBodyProps) {
	const { className, ...rest } = props;

	return <div className={cn("overflow-auto p-2", className)} {...rest} />;
}

export type SidebarFooterProps = ComponentProps<"footer">;

export function SidebarFooter(props: SidebarFooterProps) {
	const { className, ...rest } = props;

	return <footer className={cn("mt-auto p-2", className)} {...rest} />;
}

export type SidebarGroupProps = ComponentProps<"section">;

export function SidebarGroup(props: SidebarGroupProps) {
	const { className, ...rest } = props;

	return <section className={cn("flex flex-col", className)} {...rest} />;
}

export type SidebarGroupLabelProps = ComponentProps<"p">;

export function SidebarGroupLabel(props: SidebarGroupLabelProps) {
	const { className, ...rest } = props;

	return <p className={cn("px-3", className)} {...rest} />;
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
				"flex h-10 w-full items-center gap-3 rounded-lg px-3 transition-colors [&_svg]:size-5",
				className,
			)}
			{...rest}
		/>
	);
}
