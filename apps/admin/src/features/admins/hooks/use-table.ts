import { useNavigate } from "@tanstack/react-router";
import { createColumnHelper, getCoreRowModel, useReactTable } from "@tanstack/react-table";
import { useMemo } from "react";
import { useTranslation } from "react-i18next";

import type { Admin, Pagination } from "@workspace/api/data";

import { AdminsTableActionCell } from "#/features/admins/components/table/action-cell";
import { useColumnVisibilityStore } from "#/hooks/use-column-visibility-store";
import { orderByToSortingSate, sortingStateToOrderBy } from "#/utils/table";

type UseAdminsTableParams = {
	data: Admin[];
	pagination: Pagination;
	q?: string;
	orderBy?: string;
};

export function useAdminsTable(params: UseAdminsTableParams) {
	const { data, pagination, q, orderBy } = params;

	const { t } = useTranslation("features.admins.hooks.use-table");
	const navigate = useNavigate();
	const sorting = orderByToSortingSate(orderBy);
	const { columnVisibility, setColumnVisibility } = useColumnVisibilityStore({
		name: "admins-table-column-visibility",
		defaultValue: {},
	});

	const columnHelper = createColumnHelper<Admin>();
	const columns = useMemo(
		() => [
			columnHelper.accessor("id", {
				header: t("header.id"),
			}),
			columnHelper.accessor("name", {
				header: t("header.name"),
			}),
			columnHelper.accessor("email", {
				header: t("header.email"),
			}),
			columnHelper.accessor("activatedAt", {
				header: t("header.activatedAt"),
				cell: (props) => props.getValue()?.toLocaleDateString(),
			}),
			columnHelper.accessor("createdAt", {
				header: t("header.createdAt"),
				cell: (props) => props.getValue().toLocaleDateString(),
			}),
			columnHelper.accessor("updatedAt", {
				header: t("header.updatedAt"),
				cell: (props) => props.getValue().toLocaleDateString(),
			}),
			columnHelper.display({
				id: "actions",
				cell: (cell) => AdminsTableActionCell({ cell }),
			}),
		],
		[columnHelper, t],
	);

	return useReactTable({
		data,
		columns,
		manualSorting: true,
		getCoreRowModel: getCoreRowModel(),
		onColumnVisibilityChange: setColumnVisibility,
		onGlobalFilterChange: (updaterOrValue) => {
			const query = typeof updaterOrValue === "function" ? updaterOrValue(q) : updaterOrValue;

			return navigate({
				to: ".",
				search: (prev) => ({ ...prev, q: query, page: undefined }),
			});
		},
		onSortingChange: (updaterOrValue) => {
			const newSortingState =
				typeof updaterOrValue === "function" ? updaterOrValue(sorting) : updaterOrValue;

			const newOrderBy = sortingStateToOrderBy(newSortingState);
			return navigate({
				to: ".",
				search: (prev) => ({ ...prev, orderBy: newOrderBy, page: undefined }),
			});
		},
		pageCount: pagination.total,
		initialState: {
			globalFilter: q,
		},
		state: {
			columnVisibility,
			sorting,
			pagination: {
				pageSize: pagination.perPage,
				pageIndex: pagination.currentPage - 1,
			},
		},
	});
}
