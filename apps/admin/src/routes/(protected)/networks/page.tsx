import { keepPreviousData, useSuspenseQuery } from "@tanstack/react-query";
import { createFileRoute, Link } from "@tanstack/react-router";
import { useTranslation } from "react-i18next";
import z from "zod";

import { Button } from "@workspace/ui-react/components/button";
import { PlusIcon } from "@workspace/ui-react/icons";

import { DataTable } from "#/components/app/data-table";
import { useNetworksTable } from "#/features/networks/hooks/use-table";
import { api } from "#/libs/tuyau";

const searchParamsSchema = z.object({
	page: z.int().positive().optional(),
	perPage: z.int().positive().optional(),
	q: z.string().optional(),
	orderBy: z.string().optional(),
});

export const Route = createFileRoute("/(protected)/networks/")({
	validateSearch: searchParamsSchema,
	loaderDeps: ({ search }) => ({
		page: search.page,
		perPage: search.perPage,
		q: search.q,
		orderBy: search.orderBy,
	}),
	loader: async ({ context, deps }) => {
		await context.queryClient.ensureQueryData(api.networks.list.queryOptions({ query: deps }));
	},
	component: Page,
});

function Page() {
	"use no memo";

	const { t } = useTranslation("routes.(protected).networks");
	const searchParams = Route.useSearch();

	const { data: networks } = useSuspenseQuery(
		api.networks.list.queryOptions({ query: searchParams }, { placeholderData: keepPreviousData }),
	);
	const table = useNetworksTable({
		data: networks.data,
		pagination: networks.meta,
		q: searchParams.q,
		orderBy: searchParams.orderBy,
	});

	return (
		<main className="grid gap-9">
			<header className="grid gap-1">
				<h2 className="font-bold text-primary-9 text-xs uppercase tracking-widest">
					{t("headline")}
				</h2>
				<h1 className="font-bold text-3xl text-secondary-12">{t("title")}</h1>
				<p className="text-neutral-11 text-sm">{t("description")}</p>
			</header>

			<DataTable table={table}>
				<div className="flex flex-wrap items-center justify-between gap-4">
					<DataTable.SearchInput placeholder={t("search.placeholder")} />

					<div className="flex items-center gap-2">
						{networks.meta.canCreate && (
							<Button variant="primary" nativeButton={false} render={<Link to="/networks/new" />}>
								<PlusIcon />
								{t("actions.new")}
							</Button>
						)}
						<DataTable.ColumnsVisiblitySelector />
					</div>
				</div>

				<DataTable.Table />

				<DataTable.Empty className="flex flex-col items-center justify-center gap-2 py-16">
					<h3 className="font-bold text-neutral-12 text-xl">
						{searchParams.q ? t("empty.title-search") : t("empty.title")}
					</h3>
					<p className="text-neutral-11 text-sm">
						{searchParams.q
							? t("empty.description-search", { search: searchParams.q })
							: t("empty.description")}
					</p>
					{networks.meta.canCreate && (
						<Button variant="primary" nativeButton={false} render={<Link to="/networks/new" />}>
							<PlusIcon />
							{t("actions.new")}
						</Button>
					)}
				</DataTable.Empty>

				<DataTable.Pagination />
			</DataTable>
		</main>
	);
}
