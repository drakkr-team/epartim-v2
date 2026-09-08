import { keepPreviousData, useSuspenseQuery } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";
import { useTranslation } from "react-i18next";
import z from "zod";

import { Button } from "@workspace/ui-react/components/button";
import { PlusIcon } from "@workspace/ui-react/icons";

import { DataTable } from "#/components/app/data-table";
import { PageHeader } from "#/components/app/page-header";
import { SubscriptionsFilters } from "#/features/subscriptions/components/filters";
import { SubscriptionStatusTabs } from "#/features/subscriptions/components/status-tabs";
import { useCreateSubscriptionMutation } from "#/features/subscriptions/hooks/use-create-mutation";
import { useSubscriptionsTable } from "#/features/subscriptions/hooks/use-table";
import {
	DEFAULT_SUBSCRIPTION_LIST_STATUS,
	type SubscriptionTabsListStatus,
	subscriptionListStatuses,
} from "#/features/subscriptions/utils/helpers/status-options";
import { api } from "#/libs/tuyau";

const searchParamsSchema = z.object({
	page: z.int().positive().optional(),
	perPage: z.int().positive().optional(),
	q: z.string().optional(),
	status: z.enum(subscriptionListStatuses).optional(),
	progress: z.int().min(1).max(5).optional(),
	createdAtFrom: z.iso.date().optional(),
	createdAtTo: z.iso.date().optional(),
});

function formatDate(date: Date | undefined) {
	if (!date) return undefined;

	const year = date.getFullYear();
	const month = String(date.getMonth() + 1).padStart(2, "0");
	const day = String(date.getDate()).padStart(2, "0");

	return `${year}-${month}-${day}`;
}

export const Route = createFileRoute("/(protected)/(operations)/subscriptions/")({
	validateSearch: searchParamsSchema,
	loaderDeps: ({ search }) => ({
		page: search.page,
		perPage: search.perPage,
		q: search.q,
		status: search.status ?? DEFAULT_SUBSCRIPTION_LIST_STATUS,
		progress: search.progress,
		createdAtFrom: search.createdAtFrom,
		createdAtTo: search.createdAtTo,
	}),
	loader: async ({ context, deps }) => {
		await context.queryClient.query({
			...api.subscriptions.list.queryOptions({ query: deps }),
			staleTime: "static",
		});
	},
	component: SubscriptionsPage,
});

function SubscriptionsPage() {
	"use no memo";

	const { t: tRoute } = useTranslation("routes.(private)");
	const { t } = useTranslation("routes.(private).(operations).subscriptions");
	const { mutate: createSubscription, isPending } = useCreateSubscriptionMutation();
	const searchParams = Route.useSearch();
	const navigate = Route.useNavigate();
	const status = searchParams.status ?? DEFAULT_SUBSCRIPTION_LIST_STATUS;
	const query = { ...searchParams, status };
	const { data: subscriptions } = useSuspenseQuery(
		api.subscriptions.list.queryOptions({ query }, { placeholderData: keepPreviousData }),
	);
	const table = useSubscriptionsTable({
		data: subscriptions.data,
		pagination: subscriptions.meta,
		q: searchParams.q,
	});
	const isFiltered =
		Boolean(
			searchParams.q ||
				searchParams.progress ||
				searchParams.createdAtFrom ||
				searchParams.createdAtTo,
		) || Object.values(subscriptions.meta.statusCounts).some(Boolean);

	return (
		<main className="grid gap-9">
			<PageHeader
				actions={
					<Button onClick={() => createSubscription({})} disabled={isPending} variant="primary">
						<PlusIcon />
						{t("action.new-subscription")}
					</Button>
				}
				description={t("description")}
				section={tRoute("operations")}
				title={tRoute("subscriptions")}
			/>

			<DataTable table={table}>
				<SubscriptionStatusTabs
					status={status}
					statusCounts={subscriptions.meta.statusCounts}
					onValueChange={(nextStatus: SubscriptionTabsListStatus) =>
						navigate({
							to: ".",
							search: (previous) => ({ ...previous, status: nextStatus, page: undefined }),
						})
					}
				/>

				<SubscriptionsFilters
					createdAtFrom={searchParams.createdAtFrom}
					createdAtTo={searchParams.createdAtTo}
					onPeriodChange={(range) =>
						navigate({
							to: ".",
							search: (previous) => ({
								...previous,
								createdAtFrom: formatDate(range?.from),
								createdAtTo: formatDate(range?.to),
								page: undefined,
							}),
						})
					}
					onProgressChange={(progress) =>
						navigate({
							to: ".",
							search: (previous) => ({ ...previous, progress, page: undefined }),
						})
					}
					progress={searchParams.progress}
				/>

				<DataTable.Table />

				<DataTable.Empty className="flex flex-col items-center justify-center gap-2 py-16">
					<h2 className="font-bold text-neutral-12 text-xl">
						{isFiltered ? t("empty.filtered.title") : t("empty.title")}
					</h2>
					<p className="text-neutral-11 text-sm">
						{isFiltered ? t("empty.filtered.description") : t("empty.description")}
					</p>
				</DataTable.Empty>

				<DataTable.Pagination />
			</DataTable>
		</main>
	);
}
