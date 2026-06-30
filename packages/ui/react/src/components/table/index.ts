import {
	TableBody,
	TableCell,
	TableFooter,
	TableHeader,
	TableHeaderCell,
	TableRoot,
	TableRow,
} from "./table";

export const Table = Object.assign(TableRoot, {
	Header: TableHeader,
	Body: TableBody,
	Footer: TableFooter,
	Row: TableRow,
	Cell: TableCell,
	HeaderCell: TableHeaderCell,
});

export type {
	TableBodyProps,
	TableCellProps,
	TableFooterProps,
	TableHeaderCellProps,
	TableHeaderProps,
	TableRootProps as TableProps,
	TableRowProps,
} from "./table";
