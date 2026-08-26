import { useNavigate, useRouter } from "@tanstack/react-router";
import { createColumnHelper, getCoreRowModel, useReactTable } from "@tanstack/react-table";
import { useMemo } from "react";
import { useTranslation } from "react-i18next";

import type { Admin, Pagination } from "@workspace/api/data";

import { AdminsTableActionCell } from "#/features/admins/components/table/action-cell";
import { useColumnVisibilityStore } from "#/hooks/use-column-visibility-store";
import { orderByToSortingSate, sortingStateToOrderBy } from "#/utils/table";

type UseAdminsTableParams = {
	data: Array<
		Admin & {
			meta: {
				canUpdate: boolean;
				canDelete: boolean;
			};
		}
	>;
	pagination: Pagination;
	q?: string;
	orderBy?: string;
};

export function useAdminsTable(params: UseAdminsTableParams) {
	const { data, pagination, q, orderBy } = params;

	const { t } = useTranslation("features.admins.hooks.use-table");
	const navigate = useNavigate();
	const router = useRouter();
	const sorting = orderByToSortingSate(orderBy);
	const { columnVisibility, setColumnVisibility } = useColumnVisibilityStore({
		name: "admins-table-column-visibility",
		defaultValue: {},
	});

	const columnHelper = createColumnHelper<
		Admin & {
			meta: {
				canUpdate: boolean;
				canDelete: boolean;
			};
		}
	>();
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
				meta: {
					classNames: {
						header: "w-0 p-0",
						cell: "p-1",
					},
				},
			}),
		],
		[columnHelper, t],
	);

	return useReactTable({
		data,
		columns,
		meta: {
			rows: {
				onClick: (row) =>
					navigate({ to: "/admins/$adminId", params: { adminId: row.id.toString() } }),
				onMouseEnter: (row) =>
					router.preloadRoute({ to: "/admins/$adminId", params: { adminId: row.id.toString() } }),
			},
		},
		manualSorting: true,
		manualPagination: true,
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
		onPaginationChange: (updaterOrValue) => {
			const newPaginationState =
				typeof updaterOrValue === "function"
					? updaterOrValue({ pageIndex: pagination.currentPage - 1, pageSize: pagination.perPage })
					: updaterOrValue;

			return navigate({
				to: ".",
				search: (prev: Record<string, unknown>) => ({
					...prev,
					page: newPaginationState.pageIndex + 1,
				}),
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
