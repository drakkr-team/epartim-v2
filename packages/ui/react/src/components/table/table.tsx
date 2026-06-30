import type { ComponentProps } from "react";
import { cn } from "tailwind-variants";

export type TableRootProps = ComponentProps<"table">;

export function TableRoot(props: TableRootProps) {
	const { className, ...rest } = props;

	return (
		<div className={cn("overflow-auto rounded-lg border border-neutral-7 bg-neutral-1", className)}>
			<table className="h-full w-full" {...rest} />
		</div>
	);
}

export type TableHeaderProps = ComponentProps<"thead">;

export function TableHeader(props: TableHeaderProps) {
	const { className, ...rest } = props;

	return <thead className={cn("border-neutral-7 border-b bg-neutral-3/50", className)} {...rest} />;
}

export type TableBodyProps = ComponentProps<"tbody">;

export function TableBody(props: TableBodyProps) {
	const { className, ...rest } = props;

	return <tbody className={cn("divide-y divide-neutral-7", className)} {...rest} />;
}

export type TableRowProps = ComponentProps<"tr"> & {
	interactive?: boolean;
};

export function TableRow(props: TableRowProps) {
	const { className, interactive, ...rest } = props;

	return (
		<tr
			className={cn(
				{
					"cursor-pointer hover:bg-neutral-3": interactive,
				},
				className,
			)}
			{...rest}
		/>
	);
}

export type TableCellProps = ComponentProps<"td"> & {
	interactive?: boolean;
};

export function TableCell(props: TableCellProps) {
	const { className, interactive, ...rest } = props;

	return (
		<td
			className={cn(
				"truncate px-4 py-3 text-start text-neutral-12 text-sm",
				{
					"cursor-pointer hover:bg-neutral-3": interactive,
				},
				className,
			)}
			{...rest}
		/>
	);
}

export type TableHeaderCellProps = ComponentProps<"th">;

export function TableHeaderCell(props: TableHeaderCellProps) {
	const { className, ...rest } = props;

	return (
		<th
			className={cn(
				"truncate px-4 py-3 text-start font-semibold text-neutral-12 text-sm",
				className,
			)}
			{...rest}
		/>
	);
}

export type TableFooterProps = ComponentProps<"tfoot">;

export function TableFooter(props: TableFooterProps) {
	return <tfoot {...props} />;
}
