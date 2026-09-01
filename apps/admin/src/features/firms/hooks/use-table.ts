import { useLocation, useNavigate, useRouter } from "@tanstack/react-router";
import { createColumnHelper, getCoreRowModel, useReactTable } from "@tanstack/react-table";
import { useMemo } from "react";
import { useTranslation } from "react-i18next";

import type { Firm, Pagination } from "@workspace/api/data";

import { FirmsTableActionCell } from "#/features/firms/components/table/action-cell";
import { useColumnVisibilityStore } from "#/hooks/use-column-visibility-store";
import { orderByToSortingSate, sortingStateToOrderBy } from "#/utils/table";

export type FirmRow = Firm & {
	meta: {
		canUpdate: boolean;
		canDelete: boolean;
	};
};

type UseFirmsTableParams = {
	data: FirmRow[];
	pagination: Pagination;
	q?: string;
	orderBy?: string;
};

export function useFirmsTable(params: UseFirmsTableParams) {
	const { data, pagination, q, orderBy } = params;

	const { t } = useTranslation("features.firms.hooks.use-table");
	const navigate = useNavigate();
	const router = useRouter();
	const location = useLocation();
	const origin = `${location.pathname}${location.searchStr}`;
	const sorting = orderByToSortingSate(orderBy);
	const { columnVisibility, setColumnVisibility } = useColumnVisibilityStore({
		name: "firms-table-column-visibility",
		defaultValue: {},
	});

	const columnHelper = createColumnHelper<FirmRow>();
	const columns = useMemo(
		() => [
			columnHelper.accessor("name", {
				header: t("header.name"),
			}),
			columnHelper.accessor("networkId", {
				header: t("header.network"),
				cell: (props) =>
					props.getValue() === null
						? t("network.none")
						: t("network.reference", { id: props.getValue() }),
			}),
			columnHelper.accessor("orias", {
				header: t("header.orias"),
			}),
			columnHelper.accessor("amundiOrgId", {
				header: t("header.amundiOrgId"),
			}),
			columnHelper.accessor("updatedAt", {
				header: t("header.updatedAt"),
				cell: (props) => props.getValue().toLocaleDateString("fr-FR"),
			}),
			columnHelper.display({
				id: "actions",
				cell: (cell) => FirmsTableActionCell({ cell }),
				meta: {
					classNames: {
						header: "sticky right-0 z-10 w-12 bg-neutral-3 p-0",
						cell: "sticky right-0 z-10 w-12 bg-neutral-1 p-1",
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
						to: "/firms/$firmId",
						params: { firmId: row.id.toString() },
						search: { from: origin },
					}),
				onMouseEnter: (row) =>
					router.preloadRoute({
						to: "/firms/$firmId",
						params: { firmId: row.id.toString() },
						search: { from: origin },
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
