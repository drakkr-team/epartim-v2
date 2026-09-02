import { useDebouncedCallback } from "@tanstack/react-pacer";
import { flexRender, type Header, type Table as ReactTable } from "@tanstack/react-table";
import { type ComponentProps, createContext, useContext } from "react";
import { useTranslation } from "react-i18next";
import { cn } from "tailwind-variants";

import { Button } from "@workspace/ui-react/components/button";
import { Card, type CardProps } from "@workspace/ui-react/components/card";
import { Input, type InputProps } from "@workspace/ui-react/components/input";
import { Menu } from "@workspace/ui-react/components/menu";
import { Table } from "@workspace/ui-react/components/table";
import { Tooltip } from "@workspace/ui-react/components/tooltip";
import {
	ArrowDownUpIcon,
	ArrowDownWideNarrowIcon,
	ArrowUpNarrowWideIcon,
	ChevronLeftIcon,
	ChevronRightIcon,
	SearchIcon,
	Table2Icon,
} from "@workspace/ui-react/icons";

const DataTableContext = createContext<unknown>(null);

function useDataTableContext<TData>() {
	const context = useContext(DataTableContext);

	if (!context) {
		throw new Error("useDataTableContext must be used within a <DataTable />");
	}
	return context as ReactTable<TData>;
}

type DataTableRootProps<TData> = {
	table: ReactTable<TData>;
} & ComponentProps<"div">;

function DataTableRoot<TData>(props: DataTableRootProps<TData>) {
	const { table, children, className, ...rest } = props;

	return (
		<DataTableContext.Provider value={table}>
			<div className={cn("grid gap-4", className)} {...rest}>
				{children}
			</div>
		</DataTableContext.Provider>
	);
}

function DataTableTable<TData>() {
	"use no memo";

	const table = useDataTableContext<TData>();

	if (table.getRowModel().rows.length === 0) return null;

	return (
		<Table>
			{table.getHeaderGroups().map((headerGroup) => (
				<Table.Header key={headerGroup.id}>
					<Table.Row>
						{headerGroup.headers.map((header) => (
							<Table.HeaderCell
								key={header.id}
								className={cn(
									{
										"p-1": header.column.getCanSort(),
									},
									header.column.columnDef.meta?.classNames?.header,
								)}
							>
								{header.isPlaceholder ||
								header.column.columnDef.header === undefined ? null : header.column.getCanSort() ? (
									<DataTableSortButton header={header} />
								) : (
									flexRender(header.column.columnDef.header, header.getContext())
								)}
							</Table.HeaderCell>
						))}
					</Table.Row>
				</Table.Header>
			))}
			<Table.Body>
				{table.getRowModel().rows.map((row) => (
					<Table.Row
						key={row.id}
						interactive={!!table.options.meta?.rows?.onClick}
						onClick={(event) => {
							const target = event.target;
							if (!(target instanceof Node) || !event.currentTarget.contains(target)) {
								return;
							}
							if (
								target instanceof Element &&
								target.closest(
									"a, button, input, label, select, summary, textarea, [contenteditable]:not([contenteditable='false']), [role='button'], [role='checkbox'], [role='link'], [role='menuitem'], [role='menuitemcheckbox'], [role='menuitemradio'], [role='option'], [role='radio'], [role='switch'], [role='tab'], [role='treeitem'], [tabindex]:not([tabindex='-1'])",
								)
							) {
								return;
							}
							table.options.meta?.rows?.onClick?.(row.original);
						}}
						onMouseEnter={() => table.options.meta?.rows?.onMouseEnter?.(row.original)}
					>
						{row.getVisibleCells().map((cell) => (
							<Table.Cell
								key={cell.id}
								className={cn(cell.column.columnDef.meta?.classNames?.cell)}
							>
								{flexRender(cell.column.columnDef.cell, cell.getContext())}
							</Table.Cell>
						))}
					</Table.Row>
				))}
			</Table.Body>
		</Table>
	);
}

type DataTableEmptyProps = CardProps;

function DataTableEmpty<TData>(props: DataTableEmptyProps) {
	const table = useDataTableContext<TData>();

	if (table.getRowModel().rows.length > 0) return null;

	return <Card {...props} />;
}

type DataTableSortButtonProps<TData> = {
	header: Header<TData, unknown>;
};

function DataTableSortButton<TData>(props: DataTableSortButtonProps<TData>) {
	"use no memo";

	const { header } = props;

	return (
		<Button variant="ghost" onClick={header.column.getToggleSortingHandler()}>
			{flexRender(header.column.columnDef.header, header.getContext())}
			{{
				asc: <ArrowUpNarrowWideIcon />,
				desc: <ArrowDownWideNarrowIcon />,
				false: <ArrowDownUpIcon />,
			}[header.column.getIsSorted() as string] ?? null}
		</Button>
	);
}

function DataTableColumnsVisiblitySelector<TData>() {
	"use no memo";

	const { t } = useTranslation("components.app.data-table");
	const table = useDataTableContext<TData>();
	const columns = table
		.getAllColumns()
		.filter((column) => typeof column.columnDef.header === "string");

	return (
		<Menu>
			<Tooltip>
				<Tooltip.Trigger
					render={<Menu.Trigger render={<Button variant="default" size="icon-md" />} />}
				>
					<Table2Icon />
				</Tooltip.Trigger>
				<Tooltip.Content sideOffset={8}>{t("visibility-selector.tooltip")}</Tooltip.Content>
			</Tooltip>
			<Menu.Content align="end">
				{columns.map((column) => (
					<Menu.CheckboxItem
						key={column.id}
						checked={column.getIsVisible()}
						disabled={!column.getCanHide()}
						onCheckedChange={(checked) => column.toggleVisibility(checked)}
					>
						{column.columnDef.header?.toString()}
					</Menu.CheckboxItem>
				))}
			</Menu.Content>
		</Menu>
	);
}

type DataTableSearchInputProps = Omit<
	InputProps,
	"type" | "onValueChange" | "defaultValue" | "leftSlot"
>;

function DataTableSearchInput<TData>(props: DataTableSearchInputProps) {
	"use no memo";

	const table = useDataTableContext<TData>();

	const handleSearch = useDebouncedCallback(
		(search: string) => {
			table.setGlobalFilter(search);
		},
		{ wait: 300 },
	);

	return (
		<Input
			type="search"
			leftSlot={<SearchIcon className="mx-1 size-4 text-neutral-11" />}
			onValueChange={handleSearch}
			defaultValue={table.initialState.globalFilter}
			{...props}
		/>
	);
}

function DataTablePagination<TData>() {
	"use no memo";

	const { t } = useTranslation("components.app.data-table");
	const table = useDataTableContext<TData>();

	return (
		<div className="flex items-center justify-end gap-2">
			<Tooltip>
				<Tooltip.Trigger
					render={
						<Button
							variant="default"
							size="icon-md"
							onClick={() => {
								table.previousPage();
							}}
							disabled={!table.getCanPreviousPage()}
						/>
					}
				>
					<ChevronLeftIcon />
				</Tooltip.Trigger>
				<Tooltip.Content>{t("pagination.previous.tooltip")}</Tooltip.Content>
			</Tooltip>
			<Tooltip>
				<Tooltip.Trigger
					render={
						<Button
							variant="default"
							size="icon-md"
							onClick={() => {
								table.nextPage();
							}}
							disabled={!table.getCanNextPage()}
						/>
					}
				>
					<ChevronRightIcon />
				</Tooltip.Trigger>
				<Tooltip.Content>{t("pagination.next.tooltip")}</Tooltip.Content>
			</Tooltip>
		</div>
	);
}

export const DataTable = Object.assign(DataTableRoot, {
	Table: DataTableTable,
	Empty: DataTableEmpty,
	Pagination: DataTablePagination,
	SearchInput: DataTableSearchInput,
	ColumnsVisiblitySelector: DataTableColumnsVisiblitySelector,
});
