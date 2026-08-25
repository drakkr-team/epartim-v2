import { createFileRoute, Link } from "@tanstack/react-router";
import { useTranslation } from "react-i18next";

import { Button } from "@workspace/ui-react/components/button";
import { Card } from "@workspace/ui-react/components/card";
import { Skeleton } from "@workspace/ui-react/components/skeleton";
import { ArrowLeftIcon } from "@workspace/ui-react/icons";

import { AdminStatus } from "#/features/admins/components/admin-status";
import { DeleteAdminDialog } from "#/features/admins/components/delete-admin-dialog";
import { isAdminForbidden, isAdminNetworkError, isAdminNotFound } from "#/features/admins/errors";
import { useAdminQuery } from "#/features/admins/hooks/use-admin-query";
import { formatAdminDate } from "#/features/admins/model";

export const Route = createFileRoute("/(protected)/admins/$adminId/")({
	component: AdminDetailPage,
});

function AdminDetailPage() {
	const { t } = useTranslation("features.admins");
	const { adminId } = Route.useParams();
	const navigate = Route.useNavigate();
	const adminQuery = useAdminQuery(adminId);
	const admin = adminQuery.data;

	if (adminQuery.isPending) {
		return (
			<section aria-busy="true" className="space-y-6">
				<p className="sr-only" role="status">
					{t("detail.loading")}
				</p>
				<Skeleton className="block h-10 w-72 rounded-md" />
				<Skeleton className="block h-64 w-full rounded-md" />
			</section>
		);
	}

	if (adminQuery.isError) {
		const title = isAdminNotFound(adminQuery.error)
			? t("detail.notFound")
			: isAdminForbidden(adminQuery.error)
				? t("detail.forbidden")
				: isAdminNetworkError(adminQuery.error)
					? t("detail.network")
					: t("detail.unexpected");
		const description = isAdminNotFound(adminQuery.error)
			? t("detail.notFoundDescription")
			: isAdminForbidden(adminQuery.error)
				? t("errors.forbidden.description")
				: isAdminNetworkError(adminQuery.error)
					? t("errors.network.description")
					: t("errors.unexpected.description");

		return (
			<section className="mx-auto max-w-2xl">
				<Card className="p-8 text-center" role="alert">
					<h1 className="font-bold text-2xl text-neutral-12">{title}</h1>
					<p className="mt-2 text-neutral-11">{description}</p>
					<Button
						className="mt-6"
						nativeButton={false}
						render={
							<Link
								search={{ page: 1, perPage: 20, q: undefined, orderBy: "createdAt_desc" }}
								to="/admins"
							>
								<ArrowLeftIcon aria-hidden="true" />
								{t("detail.back")}
							</Link>
						}
					/>
				</Card>
			</section>
		);
	}

	if (!admin) {
		return null;
	}

	return (
		<section className="space-y-6">
			<header className="flex flex-wrap items-end justify-between gap-4 border-primary-9 border-b pb-5">
				<div>
					<Button
						nativeButton={false}
						render={
							<Link
								search={{ page: 1, perPage: 20, q: undefined, orderBy: "createdAt_desc" }}
								to="/admins"
							>
								<ArrowLeftIcon aria-hidden="true" />
								{t("detail.back")}
							</Link>
						}
						variant="ghost"
					/>
					<p className="mt-5 font-semibold text-primary-9 text-xs uppercase tracking-widest">
						{t("eyebrow")}
					</p>
					<h1 className="mt-2 font-bold text-4xl text-neutral-12 tracking-tight">{admin.name}</h1>
					<p className="mt-2 text-neutral-11">{t("detail.title")}</p>
				</div>
				<div className="flex flex-wrap gap-2">
					{admin.meta.canUpdate && (
						<Button
							nativeButton={false}
							render={
								<Link params={{ adminId }} to="/admins/$adminId/edit">
									{t("actions.edit")}
								</Link>
							}
						/>
					)}
					{admin.meta.canDelete && (
						<DeleteAdminDialog
							admin={admin}
							onDeleted={() =>
								navigate({
									to: "/admins",
									search: {
										page: 1,
										perPage: 20,
										q: undefined,
										orderBy: "createdAt_desc",
									},
								})
							}
						/>
					)}
				</div>
			</header>

			<Card className="grid gap-6 p-6 sm:grid-cols-2">
				<DetailItem label={t("detail.email")} value={admin.email} />
				<div>
					<p className="text-neutral-11 text-sm">{t("detail.status")}</p>
					<div className="mt-2">
						<AdminStatus activated={admin.activatedAt !== null} />
					</div>
				</div>
				<DetailItem label={t("detail.createdAt")} value={formatAdminDate(admin.createdAt)} />
				<DetailItem label={t("detail.updatedAt")} value={formatAdminDate(admin.updatedAt)} />
			</Card>
		</section>
	);
}

type DetailItemProps = {
	readonly label: string;
	readonly value: string;
};

function DetailItem({ label, value }: DetailItemProps) {
	return (
		<div>
			<p className="text-neutral-11 text-sm">{label}</p>
			<p className="mt-2 font-medium text-neutral-12">{value}</p>
		</div>
	);
}
