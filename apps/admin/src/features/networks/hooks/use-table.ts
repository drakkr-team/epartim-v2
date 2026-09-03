import { useNavigate, useRouter } from "@tanstack/react-router";
import { createColumnHelper, getCoreRowModel, useReactTable } from "@tanstack/react-table";
import { useMemo } from "react";
import { useTranslation } from "react-i18next";

import type { Network, Pagination } from "@workspace/api/data";

import { NetworksTableActionCell } from "#/features/networks/components/table/action-cell";
import { useColumnVisibilityStore } from "#/hooks/use-column-visibility-store";
import { orderByToSortingSate, sortingStateToOrderBy } from "#/utils/table";

export type NetworkRow = Network & {
	meta: {
		canUpdate: boolean;
		canDelete: boolean;
	};
};

type UseNetworksTableParams = {
	data: NetworkRow[];
	pagination: Pagination;
	q?: string;
	orderBy?: string;
};

export function useNetworksTable(params: UseNetworksTableParams) {
	const { data, pagination, q, orderBy } = params;

	const { t } = useTranslation("features.networks.hooks.use-table");
	const navigate = useNavigate();
	const router = useRouter();
	const sorting = orderByToSortingSate(orderBy);
	const { columnVisibility, setColumnVisibility } = useColumnVisibilityStore({
		name: "networks-table-column-visibility",
		defaultValue: {},
	});

	const columnHelper = createColumnHelper<NetworkRow>();
	const columns = useMemo(
		() => [
			columnHelper.accessor("id", {
				header: t("header.id"),
			}),
			columnHelper.accessor("name", {
				header: t("header.name"),
			}),
			columnHelper.accessor("amundiOrgId", {
				header: t("header.amundiOrgId"),
			}),
			columnHelper.accessor("goCode", {
				header: t("header.goCode"),
			}),
			columnHelper.accessor("createdAt", {
				header: t("header.createdAt"),
				cell: (props) => props.getValue().toLocaleDateString("fr-FR"),
			}),
			columnHelper.accessor("updatedAt", {
				header: t("header.updatedAt"),
				cell: (props) => props.getValue().toLocaleDateString("fr-FR"),
			}),
			columnHelper.display({
				id: "actions",
				cell: (cell) => NetworksTableActionCell({ cell }),
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
					navigate({
						to: "/networks/$networkId",
						params: { networkId: row.id.toString() },
					}),
				onMouseEnter: (row) =>
					router.preloadRoute({
						to: "/networks/$networkId",
						params: { networkId: row.id.toString() },
					}),
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
				search: (previous) => ({ ...previous, q: query || undefined, page: undefined }),
			});
		},
		onSortingChange: (updaterOrValue) => {
			const nextSorting =
				typeof updaterOrValue === "function" ? updaterOrValue(sorting) : updaterOrValue;

			return navigate({
				to: ".",
				search: (previous) => ({
					...previous,
					orderBy: sortingStateToOrderBy(nextSorting),
					page: undefined,
				}),
			});
		},
		onPaginationChange: (updaterOrValue) => {
			const nextPagination =
				typeof updaterOrValue === "function"
					? updaterOrValue({
							pageIndex: pagination.currentPage - 1,
							pageSize: pagination.perPage,
						})
					: updaterOrValue;

			return navigate({
				to: ".",
				search: (previous: Record<string, unknown>) => ({
					...previous,
					page: nextPagination.pageIndex + 1,
					perPage: nextPagination.pageSize,
				}),
			});
		},
		pageCount: pagination.lastPage,
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
