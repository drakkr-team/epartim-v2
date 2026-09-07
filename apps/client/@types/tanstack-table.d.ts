import type { RowData } from "@tanstack/react-table";

declare module "@tanstack/react-table" {
	interface TableMeta<TData extends RowData> {
		rows?: {
			onClick?: (row: TData) => void;
			onMouseEnter?: (row: TData) => void;
		};
	}
}
