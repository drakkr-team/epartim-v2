import { keepPreviousData, useSuspenseQuery } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";
import { useTranslation } from "react-i18next";
import z from "zod";

import { Button } from "@workspace/ui-react/components/button";
import { Card } from "@workspace/ui-react/components/card";
import { Select } from "@workspace/ui-react/components/select";
import { Spinner } from "@workspace/ui-react/components/spinner";
import { PlusIcon } from "@workspace/ui-react/icons";

import { DataTable } from "#/components/app/data-table";
import { useFirmsTable } from "#/features/firms/hooks/use-table";
import { api } from "#/libs/tuyau";

const searchParamsSchema = z.object({
	page: z.int().positive().optional(),
	perPage: z.int().positive().optional(),
	q: z.string().optional(),
	networkId: z.int().positive().optional(),
	orderBy: z.string().optional(),
});

export const Route = createFileRoute("/(protected)/firms/")({
	validateSearch: searchParamsSchema,
	loaderDeps: ({ search }) => ({
		page: search.page,
		perPage: search.perPage,
		q: search.q,
		networkId: search.networkId,
		orderBy: search.orderBy,
	}),
	loader: async ({ context, deps }) => {
		await Promise.all([
			context.queryClient.query(
				api.firms.list.queryOptions({ query: deps }, { staleTime: "static" }),
			),
			context.queryClient.query(
				api.networks.list.queryOptions(
					{
						query: { perPage: 1_000, orderBy: "name_asc" },
					},
					{ staleTime: "static" },
				),
			),
		]);
	},
	pendingComponent: Pending,
	pendingMs: 0,
	component: Page,
});

function Pending() {
	const { t } = useTranslation("routes.(protected).firms");

	return (
		<main aria-live="polite">
			<Card className="flex items-center justify-center gap-3 py-16">
				<Spinner />
				<p className="text-neutral-11 text-sm">{t("loading")}</p>
			</Card>
		</main>
	);
}

function Page() {
	"use no memo";

	const { t } = useTranslation("routes.(protected).firms");
	const searchParams = Route.useSearch();
	const navigate = Route.useNavigate();

	const { data: firms } = useSuspenseQuery(
		api.firms.list.queryOptions({ query: searchParams }, { placeholderData: keepPreviousData }),
	);
	const { data: networks } = useSuspenseQuery(
		api.networks.list.queryOptions({
			query: { perPage: 1_000, orderBy: "name_asc" },
		}),
	);
	const table = useFirmsTable({
		data: firms.data,
		pagination: firms.meta,
		q: searchParams.q,
		orderBy: searchParams.orderBy,
	});

	return (
		<main className="grid gap-9">
			<header className="grid gap-1">
				<h2 className="font-bold text-primary-11 text-xs uppercase tracking-widest">
					{t("headline")}
				</h2>
				<h1 className="font-bold text-3xl text-secondary-12">{t("title")}</h1>
				<p className="text-neutral-11 text-sm">{t("description")}</p>
			</header>

			<DataTable table={table}>
				<div className="flex flex-wrap items-center justify-between gap-4">
					<div className="flex flex-1 flex-wrap items-center gap-2">
						<DataTable.SearchInput
							className="min-w-64 flex-1"
							placeholder={t("search.placeholder")}
						/>
						<Select
							items={[
								{ value: "all", label: t("filters.network.all") },
								...networks.data.map((network) => ({
									value: network.id.toString(),
									label: network.name,
								})),
							]}
							value={searchParams.networkId?.toString() ?? "all"}
							onValueChange={(value) =>
								navigate({
									search: (previous) => ({
										...previous,
										networkId: value === "all" ? undefined : Number(value),
										page: undefined,
									}),
								})
							}
						>
							<Select.Input className="w-56" aria-label={t("filters.network.label")}>
								<Select.Value placeholder={t("filters.network.placeholder")} />
							</Select.Input>
							<Select.Dropdown>
								<Select.Option value="all">{t("filters.network.all")}</Select.Option>
								{networks.data.map((network) => (
									<Select.Option
										key={network.id}
										value={network.id.toString()}
										label={network.name}
									>
										{network.name}
									</Select.Option>
								))}
							</Select.Dropdown>
						</Select>
					</div>

					<div className="flex items-center gap-2">
						{firms.meta.canCreate && (
							<Button
								className="text-secondary-12"
								variant="primary"
								nativeButton={false}
								render={<a href="/firms/new" />}
							>
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
						{searchParams.q || searchParams.networkId
							? t("empty.title-filtered")
							: t("empty.title")}
					</h3>
					<p className="text-neutral-11 text-sm">
						{searchParams.q || searchParams.networkId
							? t("empty.description-filtered")
							: t("empty.description")}
					</p>
					{firms.meta.canCreate && (
						<Button
							className="text-secondary-12"
							variant="primary"
							nativeButton={false}
							render={<a href="/firms/new" />}
						>
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
