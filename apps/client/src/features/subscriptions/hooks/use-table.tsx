import { useNavigate, useRouter } from "@tanstack/react-router";
import { createColumnHelper, getCoreRowModel, useReactTable } from "@tanstack/react-table";
import { useMemo } from "react";
import { useTranslation } from "react-i18next";

import type { Company, Pagination, Subscription } from "@workspace/api/data";

import { SubscriptionCompanyCell } from "#/features/subscriptions/components/table-cells/company-cell";
import { SubscriptionCreatedAtCell } from "#/features/subscriptions/components/table-cells/created-at-cell";
import { SubscriptionOpenCell } from "#/features/subscriptions/components/table-cells/open-cell";
import { SubscriptionProgressCell } from "#/features/subscriptions/components/table-cells/progress-cell";
import { SubscriptionReferenceCell } from "#/features/subscriptions/components/table-cells/reference-cell";
import { SubscriptionStatusCell } from "#/features/subscriptions/components/table-cells/status-cell";
import { SubscriptionUpdatedAtCell } from "#/features/subscriptions/components/table-cells/updated-at-cell";

export type SubscriptionRow = Subscription & {
	company: Pick<Company, "name">;
};

type UseSubscriptionsTableParams = {
	data: SubscriptionRow[];
	pagination: Pagination;
};

const columnHelper = createColumnHelper<SubscriptionRow>();

export function useSubscriptionsTable(params: UseSubscriptionsTableParams) {
	const { data, pagination } = params;

	const { t } = useTranslation("features.subscriptions.hooks.use-table");
	const navigate = useNavigate();
	const router = useRouter();
	const columns = useMemo(
		() => [
			columnHelper.accessor("id", {
				header: t("header.reference"),
				cell: ({ row }) => <SubscriptionReferenceCell {...row.original} />,
			}),
			columnHelper.accessor("company", {
				header: t("header.client"),
				cell: ({ getValue }) => <SubscriptionCompanyCell company={getValue()} />,
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
				cell: ({ getValue }) => <SubscriptionCreatedAtCell createdAt={getValue()} />,
			}),
			columnHelper.accessor("updatedAt", {
				header: t("header.updated-at"),
				cell: ({ getValue }) => <SubscriptionUpdatedAtCell updatedAt={getValue()} />,
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
		pageCount: pagination.lastPage,
		state: {
			pagination: {
				pageIndex: pagination.currentPage - 1,
				pageSize: pagination.perPage,
			},
		},
	});
}
