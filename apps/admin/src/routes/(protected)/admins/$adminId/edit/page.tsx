import { createFileRoute, Link } from "@tanstack/react-router";
import { TuyauError } from "@tuyau/core/client";
import { useState } from "react";
import { useTranslation } from "react-i18next";

import { Button } from "@workspace/ui-react/components/button";
import { Card } from "@workspace/ui-react/components/card";
import { Skeleton } from "@workspace/ui-react/components/skeleton";
import { ArrowLeftIcon } from "@workspace/ui-react/icons";

import { AdminForm } from "#/features/admins/components/admin-form";
import { isAdminForbidden, isAdminNetworkError, isAdminNotFound } from "#/features/admins/errors";
import { useAdminQuery } from "#/features/admins/hooks/use-admin-query";
import { useUpdateAdminMutation } from "#/features/admins/hooks/use-update-admin-mutation";
import type { AdminFieldErrors } from "#/features/admins/model";

export const Route = createFileRoute("/(protected)/admins/$adminId/edit/")({
	component: EditAdminPage,
});

function EditAdminPage() {
	const { t } = useTranslation("features.admins");
	const { adminId } = Route.useParams();
	const navigate = Route.useNavigate();
	const [apiErrors, setApiErrors] = useState<AdminFieldErrors>({});
	const adminQuery = useAdminQuery(adminId);
	const mutation = useUpdateAdminMutation({ onValidationError: setApiErrors });
	const admin = adminQuery.data;

	if (adminQuery.isPending) {
		return (
			<section aria-busy="true" className="mx-auto max-w-2xl space-y-6">
				<p className="sr-only" role="status">
					{t("detail.loading")}
				</p>
				<Skeleton className="block h-10 w-72 rounded-md" />
				<Skeleton className="block h-72 w-full rounded-md" />
			</section>
		);
	}

	if (adminQuery.isError || !admin || !admin.meta.canUpdate) {
		const error = adminQuery.error;
		const title =
			(admin !== undefined && !admin.meta.canUpdate) || isAdminForbidden(error)
				? t("detail.forbidden")
				: isAdminNotFound(error)
					? t("detail.notFound")
					: isAdminNetworkError(error)
						? t("detail.network")
						: t("detail.unexpected");

		return (
			<Card className="mx-auto max-w-2xl p-8 text-center" role="alert">
				<h1 className="font-bold text-2xl text-neutral-12">{title}</h1>
				<Button
					className="mt-6"
					nativeButton={false}
					render={<Link params={{ adminId }} to="/admins/$adminId" />}
				>
					{t("actions.view")}
				</Button>
			</Card>
		);
	}

	return (
		<section className="mx-auto max-w-2xl space-y-6">
			<header className="border-primary-9 border-b pb-5">
				<Button
					nativeButton={false}
					render={
						<Link params={{ adminId }} to="/admins/$adminId">
							<ArrowLeftIcon aria-hidden="true" />
							{t("detail.title")}
						</Link>
					}
					variant="ghost"
				/>
				<p className="mt-5 font-semibold text-primary-9 text-xs uppercase tracking-widest">
					{t("eyebrow")}
				</p>
				<h1 className="mt-2 font-bold text-4xl text-neutral-12 tracking-tight">
					{t("update.title")}
				</h1>
				<p className="mt-2 text-neutral-11">{t("update.description")}</p>
			</header>

			<Card className="p-6">
				<AdminForm
					admin={admin}
					apiErrors={apiErrors}
					cancelAction={
						<Button
							nativeButton={false}
							render={<Link params={{ adminId }} to="/admins/$adminId" />}
							variant="ghost"
						>
							{t("actions.cancel")}
						</Button>
					}
					isPending={mutation.isPending}
					mode="update"
					onSubmit={async (payload) => {
						setApiErrors({});
						try {
							await mutation.mutateAsync({ params: { adminId }, body: payload });
						} catch (error) {
							if (error instanceof TuyauError) {
								return;
							}
							throw error;
						}
						await navigate({ to: "/admins/$adminId", params: { adminId } });
					}}
				/>
			</Card>
		</section>
	);
}
