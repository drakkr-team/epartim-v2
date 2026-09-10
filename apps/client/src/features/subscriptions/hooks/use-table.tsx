import { useNavigate, useRouter } from "@tanstack/react-router";
import { createColumnHelper, getCoreRowModel, useReactTable } from "@tanstack/react-table";
import { useMemo } from "react";
import { useTranslation } from "react-i18next";

import type { Company, Pagination, Subscription } from "@workspace/api/data";

import { SubscriptionOpenCell } from "#/features/subscriptions/components/table-cells/open-cell";
import { SubscriptionProgressCell } from "#/features/subscriptions/components/table-cells/progress-cell";
import { SubscriptionStatusCell } from "#/features/subscriptions/components/table-cells/status-cell";

export type SubscriptionRow = Subscription & {
	company: Pick<Company, "name">;
};

type UseSubscriptionsTableParams = {
	data: SubscriptionRow[];
	pagination: Pagination;
	q?: string;
};

const columnHelper = createColumnHelper<SubscriptionRow>();

export function useSubscriptionsTable(params: UseSubscriptionsTableParams) {
	const { data, pagination, q } = params;

	const { t } = useTranslation("features.subscriptions.hooks.use-table");
	const navigate = useNavigate();
	const router = useRouter();
	const columns = useMemo(
		() => [
			columnHelper.accessor("id", {
				header: t("header.reference"),
				cell: ({ row }) =>
					t("reference", {
						year: row.original.createdAt.getFullYear(),
						id: row.original.id.toString().padStart(4, "0"),
					}),
				meta: { className: "font-semibold" },
			}),
			columnHelper.accessor("company", {
				header: t("header.client"),
				cell: ({ getValue }) => getValue().name || t("client.new-company"),
				meta: { className: "font-semibold" },
			}),
			columnHelper.accessor("completedSteps", {
				header: t("header.progress"),
				cell: ({ getValue }) => <SubscriptionProgressCell completedSteps={getValue()} />,
			}),
			columnHelper.accessor("status", {
				header: t("header.status"),
				cell: ({ getValue }) => <SubscriptionStatusCell status={getValue()} />,
			}),
			columnHelper.accessor("createdAt", {
				header: t("header.created-at"),
				cell: ({ getValue }) => getValue().toLocaleDateString("fr-FR"),
				meta: { className: "text-neutral-9 text-xs" },
			}),
			columnHelper.accessor("updatedAt", {
				header: t("header.updated-at"),
				cell: ({ getValue }) =>
					getValue().toLocaleString("fr-FR", { dateStyle: "medium", timeStyle: "short" }),
				meta: { className: "text-neutral-9 text-xs" },
			}),
			columnHelper.display({
				id: "open",
				header: () => <span className="sr-only">{t("header.open")}</span>,
				cell: ({ row }) => <SubscriptionOpenCell {...row.original} />,
			}),
		],
		[t],
	);

	return useReactTable({
		data,
		columns,
		enableSorting: false,
		getCoreRowModel: getCoreRowModel(),
		initialState: {
			globalFilter: q ?? "",
		},
		manualFiltering: true,
		getRowId: (row) => row.id.toString(),
		manualPagination: true,
		meta: {
			rows: {
				onClick: (row) =>
					navigate({
						to: "/subscriptions/$id",
						params: { id: row.id.toString() },
					}),
				onMouseEnter: (row) =>
					router.preloadRoute({
						to: "/subscriptions/$id",
						params: { id: row.id.toString() },
					}),
			},
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
				search: (previous) => ({ ...previous, page: nextPagination.pageIndex + 1 }),
			});
		},
		onGlobalFilterChange: (updaterOrValue) => {
			const query = typeof updaterOrValue === "function" ? updaterOrValue(q) : updaterOrValue;

			return navigate({
				to: ".",
				search: ({ page: _page, q: _q, ...previous }) =>
					query ? { ...previous, q: query } : previous,
			});
		},
		pageCount: pagination.lastPage,
		state: {
			globalFilter: q ?? "",
			pagination: {
				pageIndex: pagination.currentPage - 1,
				pageSize: pagination.perPage,
			},
		},
	});
}
