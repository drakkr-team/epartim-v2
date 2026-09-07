import { keepPreviousData, useSuspenseQuery } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";
import { useTranslation } from "react-i18next";
import z from "zod";

import { Button } from "@workspace/ui-react/components/button";
import { PlusIcon } from "@workspace/ui-react/icons";

import { DataTable } from "#/components/app/data-table";
import { PageHeader } from "#/components/app/page-header";
import { useCreateSubscriptionMutation } from "#/features/subscriptions/hooks/use-create-mutation";
import { useSubscriptionsTable } from "#/features/subscriptions/hooks/use-subscriptions-table";
import { api } from "#/libs/tuyau";

const searchParamsSchema = z.object({
	page: z.int().positive().optional(),
	perPage: z.int().positive().optional(),
});

export const Route = createFileRoute("/(protected)/(operations)/subscriptions/")({
	validateSearch: searchParamsSchema,
	loaderDeps: ({ search }) => ({
		page: search.page,
		perPage: search.perPage,
	}),
	loader: async ({ context, deps }) => {
		await context.queryClient.ensureQueryData(api.subscriptions.list.queryOptions({ query: deps }));
	},
	component: SubscriptionsPage,
});

function SubscriptionsPage() {
	const { t: tRoute } = useTranslation("routes.(private)");
	const { t } = useTranslation("routes.(private).(operations).subscriptions");
	const { mutate: createSubscription, isPending } = useCreateSubscriptionMutation();
	const searchParams = Route.useSearch();
	const { data: subscriptions } = useSuspenseQuery(
		api.subscriptions.list.queryOptions(
			{ query: searchParams },
			{ placeholderData: keepPreviousData },
		),
	);
	const table = useSubscriptionsTable({
		data: subscriptions.data,
		pagination: subscriptions.meta,
	});

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
				<DataTable.Table />

				<DataTable.Empty className="flex flex-col items-center justify-center gap-2 py-16">
					<h2 className="font-bold text-neutral-12 text-xl">{t("empty.title")}</h2>
					<p className="text-neutral-11 text-sm">{t("empty.description")}</p>
				</DataTable.Empty>

				<DataTable.Pagination />
			</DataTable>
		</main>
	);
}
