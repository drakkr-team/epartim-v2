import { Link, useNavigate, useRouter } from "@tanstack/react-router";
import { createColumnHelper, getCoreRowModel, useReactTable } from "@tanstack/react-table";
import { type MouseEvent, useMemo } from "react";
import { useTranslation } from "react-i18next";

import type { Company, Pagination, Subscription } from "@workspace/api/data";
import { Badge } from "@workspace/ui-react/components/badge";
import { Button } from "@workspace/ui-react/components/button";
import { ChevronRightIcon } from "@workspace/ui-react/icons";

const TOTAL_STEPS = 5;

const subscriptionStatuses = [
	{ translationKey: "draft", variant: "neutral" },
	{ translationKey: "waiting-for-signatures", variant: "warning" },
	{ translationKey: "to-be-sent", variant: "info" },
	{ translationKey: "complete", variant: "success" },
	{ translationKey: "error", variant: "error" },
] as const;

export type SubscriptionRow = Subscription & {
	company: Pick<Company, "name">;
};

type UseSubscriptionsTableParams = {
	data: SubscriptionRow[];
	pagination: Pagination;
	q?: string;
};

const columnHelper = createColumnHelper<SubscriptionRow>();

// TODO: check to avoid unknow / null type
function getCurrentStep(completedSteps: unknown[] | null) {
	return Math.min(Math.max((completedSteps?.length ?? 0) + 1, 1), TOTAL_STEPS);
}

export function useSubscriptionsTable(params: UseSubscriptionsTableParams) {
	const { data, pagination, q } = params;

	const { t } = useTranslation("features.subscriptions.hooks.use-table");
	const navigate = useNavigate();
	const router = useRouter();
	const columns = useMemo(() => {
		const getReference = (subscription: SubscriptionRow) =>
			t("reference", {
				year: subscription.createdAt.getFullYear(),
				id: subscription.id.toString().padStart(4, "0"),
			});

		return [
			columnHelper.accessor("id", {
				header: t("header.reference"),
				cell: ({ row }) => <span className="font-semibold">{getReference(row.original)}</span>,
			}),
			columnHelper.accessor("company", {
				header: t("header.client"),
				cell: ({ getValue }) => {
					const companyName = getValue().name;

					return companyName ? (
						<span className="font-semibold">{companyName}</span>
					) : (
						t("client.new-company")
					);
				},
			}),
			columnHelper.accessor("completedSteps", {
				header: t("header.progress"),
				cell: ({ getValue }) => {
					const currentStep = getCurrentStep(getValue());

					return (
						<div className="flex min-w-28 items-center gap-3">
							<div
								aria-label={t("progress.label", { current: currentStep })}
								aria-valuemax={TOTAL_STEPS}
								aria-valuemin={1}
								aria-valuenow={currentStep}
								className="h-1.5 w-20 overflow-hidden rounded-full bg-neutral-5"
								role="progressbar"
							>
								<div
									className="h-full bg-primary-9"
									style={{ width: `${(currentStep / TOTAL_STEPS) * 100}%` }}
								/>
							</div>
							<span className="font-bold text-xs">
								{t("progress.value", { current: currentStep })}
							</span>
						</div>
					);
				},
			}),
			columnHelper.accessor("status", {
				header: t("header.status"),
				cell: ({ getValue }) => {
					const status = subscriptionStatuses[getValue()];

					return <Badge variant={status.variant}>{t(`status.${status.translationKey}`)}</Badge>;
				},
			}),
			columnHelper.accessor("createdAt", {
				header: t("header.created-at"),
				cell: ({ getValue }) => (
					<span className="text-neutral-9 text-xs">{getValue().toLocaleDateString("fr-FR")}</span>
				),
			}),
			columnHelper.accessor("updatedAt", {
				header: t("header.updated-at"),
				cell: ({ getValue }) => (
					<span className="text-neutral-9 text-xs">
						{getValue().toLocaleString("fr-FR", { dateStyle: "medium", timeStyle: "short" })}
					</span>
				),
			}),
			columnHelper.display({
				id: "open",
				header: () => <span className="sr-only">{t("header.open")}</span>,
				cell: ({ row }) => {
					const reference = getReference(row.original);

					return (
						<Button
							aria-label={t("action.open", { reference })}
							nativeButton={false}
							render={
								<Link
									to="/subscriptions/$id"
									params={{ id: row.original.id.toString() }}
									onClick={(event: MouseEvent<HTMLAnchorElement>) => event.stopPropagation()}
								/>
							}
							size="icon-sm"
							variant="ghost"
						>
							<ChevronRightIcon />
						</Button>
					);
				},
			}),
		];
	}, [t]);

	return useReactTable({
		data,
		columns,
		enableSorting: false,
		getCoreRowModel: getCoreRowModel(),
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
		pageCount: pagination.lastPage,
		onGlobalFilterChange: (updaterOrValue) => {
			const query = typeof updaterOrValue === "function" ? updaterOrValue(q) : updaterOrValue;

			return navigate({
				to: ".",
				search: (previous) => ({ ...previous, q: query || undefined, page: undefined }),
			});
		},
		state: {
			globalFilter: q ?? "",
			pagination: {
				pageIndex: pagination.currentPage - 1,
				pageSize: pagination.perPage,
			},
		},
	});
}
