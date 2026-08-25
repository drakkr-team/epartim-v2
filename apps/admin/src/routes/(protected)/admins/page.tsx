import { createFileRoute, Link } from "@tanstack/react-router";
import { useTranslation } from "react-i18next";

import { Button } from "@workspace/ui-react/components/button";
import { Input } from "@workspace/ui-react/components/input";
import { SearchIcon } from "@workspace/ui-react/icons";

import { AdminList, AdminListSkeleton } from "#/features/admins/components/admin-list";
import { isAdminNetworkError } from "#/features/admins/errors";
import { useAdminsQuery } from "#/features/admins/hooks/use-admins-query";
import { ADMIN_ORDER_OPTIONS, adminListSearchSchema } from "#/features/admins/model";

export const Route = createFileRoute("/(protected)/admins/")({
	validateSearch: (search) => adminListSearchSchema.parse(search),
	component: AdminsPage,
});

function AdminsPage() {
	const { t } = useTranslation("features.admins");
	const search = Route.useSearch();
	const navigate = Route.useNavigate();
	const adminsQuery = useAdminsQuery(search);
	const result = adminsQuery.data;

	const updateSearch = (next: Partial<typeof search>) => {
		navigate({
			search: (current) => ({
				...current,
				...next,
			}),
		});
	};

	return (
		<section className="space-y-6">
			<header className="flex flex-wrap items-end justify-between gap-4 border-primary-9 border-b pb-5">
				<div>
					<p className="font-semibold text-primary-9 text-xs uppercase tracking-widest">
						{t("eyebrow")}
					</p>
					<h1 className="mt-2 font-bold text-4xl text-neutral-12 tracking-tight">
						{t("list.title")}
					</h1>
					<p className="mt-2 max-w-2xl text-neutral-11">{t("list.description")}</p>
				</div>
				{result?.meta.canCreate && (
					<Button nativeButton={false} render={<Link to="/admins/new" />} variant="primary">
						{t("actions.create")}
					</Button>
				)}
			</header>

			<form
				className="flex flex-wrap items-end gap-3"
				key={search.q ?? ""}
				onSubmit={(event) => {
					event.preventDefault();
					const query = new FormData(event.currentTarget).get("q");
					updateSearch({
						page: 1,
						q: typeof query === "string" ? query.trim() || undefined : undefined,
					});
				}}
			>
				<div className="min-w-64 flex-1 space-y-2">
					<label className="block font-medium text-neutral-12 text-sm" htmlFor="admin-search">
						{t("list.searchLabel")}
					</label>
					<Input
						defaultValue={search.q ?? ""}
						id="admin-search"
						leftSlot={<SearchIcon aria-hidden="true" />}
						name="q"
						placeholder={t("list.searchPlaceholder")}
					/>
				</div>
				<Button type="submit">{t("list.searchAction")}</Button>

				<label className="space-y-2">
					<span className="block font-medium text-neutral-12 text-sm">{t("list.sortLabel")}</span>
					<select
						className="h-10 rounded-md border border-neutral-7 bg-neutral-1 px-3 text-sm outline-none ring-primary-7 focus-visible:ring-3 sm:h-9"
						value={search.orderBy}
						onChange={(event) =>
							updateSearch({
								page: 1,
								orderBy: adminListSearchSchema.shape.orderBy.parse(event.target.value),
							})
						}
					>
						{ADMIN_ORDER_OPTIONS.map((orderBy) => (
							<option key={orderBy} value={orderBy}>
								{t(`list.sort.${orderBy}`)}
							</option>
						))}
					</select>
				</label>
			</form>

			{adminsQuery.isPending && (
				<div>
					<p className="sr-only" role="status">
						{t("list.loading")}
					</p>
					<AdminListSkeleton />
				</div>
			)}

			{adminsQuery.isError && (
				<div className="rounded-md border border-error-7 bg-error-3 p-4" role="alert">
					<p className="font-semibold text-error-11">{t("list.error")}</p>
					<p className="mt-1 text-error-11 text-sm">
						{isAdminNetworkError(adminsQuery.error)
							? t("errors.network.description")
							: t("errors.unexpected.description")}
					</p>
					<Button className="mt-3" onClick={() => adminsQuery.refetch()}>
						{t("actions.retry")}
					</Button>
				</div>
			)}

			{result && result.data.length === 0 && (
				<div className="rounded-md border border-neutral-7 bg-neutral-1 p-8 text-center">
					<p className="font-semibold text-neutral-12">
						{search.q ? t("list.noResults") : t("list.empty")}
					</p>
				</div>
			)}

			{result && result.data.length > 0 && (
				<>
					<AdminList admins={result.data} />
					<div className="flex flex-wrap items-center justify-between gap-3">
						<p className="text-neutral-11 text-sm">
							{t("list.total", { count: result.meta.total })}
						</p>
						<div className="flex flex-wrap items-center gap-2">
							<label className="flex items-center gap-2 text-neutral-11 text-sm">
								{t("list.perPageLabel")}
								<select
									className="h-9 rounded-md border border-neutral-7 bg-neutral-1 px-2"
									value={search.perPage}
									onChange={(event) =>
										updateSearch({ page: 1, perPage: Number(event.target.value) })
									}
								>
									{[20, 50, 100].map((size) => (
										<option key={size} value={size}>
											{size}
										</option>
									))}
								</select>
							</label>
							<Button
								disabled={result.meta.currentPage <= result.meta.firstPage}
								onClick={() => updateSearch({ page: search.page - 1 })}
							>
								{t("list.previous")}
							</Button>
							<span className="text-neutral-11 text-sm">
								{t("list.page", {
									current: result.meta.currentPage,
									total: result.meta.lastPage,
								})}
							</span>
							<Button
								disabled={!result.meta.hasMorePages}
								onClick={() => updateSearch({ page: search.page + 1 })}
							>
								{t("list.next")}
							</Button>
						</div>
					</div>
				</>
			)}
		</section>
	);
}
