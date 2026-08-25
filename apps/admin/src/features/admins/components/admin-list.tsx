import { Link } from "@tanstack/react-router";
import { type ColumnDef, flexRender, getCoreRowModel, useReactTable } from "@tanstack/react-table";
import { useMemo } from "react";
import { useTranslation } from "react-i18next";

import { Button } from "@workspace/ui-react/components/button";
import { Skeleton } from "@workspace/ui-react/components/skeleton";
import { Table } from "@workspace/ui-react/components/table";

import { AdminStatus } from "#/features/admins/components/admin-status";
import { DeleteAdminDialog } from "#/features/admins/components/delete-admin-dialog";
import type { AdminWithPermissions } from "#/features/admins/model";
import { formatAdminDate } from "#/features/admins/model";

type AdminListProps = {
	readonly admins: AdminWithPermissions[];
};

export function AdminList({ admins }: AdminListProps) {
	const { t } = useTranslation("features.admins");
	const columns = useMemo<ColumnDef<AdminWithPermissions>[]>(
		() => [
			{
				accessorKey: "name",
				header: t("list.columns.name"),
				cell: ({ row }) => <span className="font-medium">{row.original.name}</span>,
			},
			{
				accessorKey: "email",
				header: t("list.columns.email"),
			},
			{
				id: "status",
				header: t("list.columns.status"),
				cell: ({ row }) => <AdminStatus activated={row.original.activatedAt !== null} />,
			},
			{
				accessorKey: "createdAt",
				header: t("list.columns.createdAt"),
				cell: ({ row }) => formatAdminDate(row.original.createdAt),
			},
			{
				accessorKey: "updatedAt",
				header: t("list.columns.updatedAt"),
				cell: ({ row }) => formatAdminDate(row.original.updatedAt),
			},
			{
				id: "actions",
				header: t("list.columns.actions"),
				cell: ({ row }) => {
					const admin = row.original;

					return (
						<div className="flex flex-wrap gap-2">
							<Button
								nativeButton={false}
								render={<Link params={{ adminId: String(admin.id) }} to="/admins/$adminId" />}
							>
								{t("actions.view")}
							</Button>
							{admin.meta.canUpdate && (
								<Button
									nativeButton={false}
									render={
										<Link params={{ adminId: String(admin.id) }} to="/admins/$adminId/edit" />
									}
								>
									{t("actions.edit")}
								</Button>
							)}
							{admin.meta.canDelete && <DeleteAdminDialog admin={admin} />}
						</div>
					);
				},
			},
		],
		[t],
	);
	const table = useReactTable({
		data: admins,
		columns,
		getCoreRowModel: getCoreRowModel(),
	});

	return (
		<Table aria-label={t("list.title")}>
			<Table.Header>
				{table.getHeaderGroups().map((headerGroup) => (
					<Table.Row key={headerGroup.id}>
						{headerGroup.headers.map((header) => (
							<Table.HeaderCell key={header.id}>
								{header.isPlaceholder
									? null
									: flexRender(header.column.columnDef.header, header.getContext())}
							</Table.HeaderCell>
						))}
					</Table.Row>
				))}
			</Table.Header>
			<Table.Body>
				{table.getRowModel().rows.map((row) => (
					<Table.Row key={row.id}>
						{row.getVisibleCells().map((cell) => (
							<Table.Cell key={cell.id}>
								{flexRender(cell.column.columnDef.cell, cell.getContext())}
							</Table.Cell>
						))}
					</Table.Row>
				))}
			</Table.Body>
		</Table>
	);
}

export function AdminListSkeleton() {
	const rows = ["row-1", "row-2", "row-3", "row-4", "row-5"] as const;

	return (
		<div aria-busy="true" aria-live="polite" className="space-y-3">
			{rows.map((row) => (
				<Skeleton className="block h-14 w-full rounded-md" key={row} />
			))}
		</div>
	);
}
