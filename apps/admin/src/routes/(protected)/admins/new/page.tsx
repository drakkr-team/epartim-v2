import { createFileRoute, Link } from "@tanstack/react-router";
import { TuyauError } from "@tuyau/core/client";
import { useState } from "react";
import { useTranslation } from "react-i18next";

import { Button } from "@workspace/ui-react/components/button";
import { Card } from "@workspace/ui-react/components/card";
import { ArrowLeftIcon } from "@workspace/ui-react/icons";

import { AdminForm } from "#/features/admins/components/admin-form";
import { useCreateAdminMutation } from "#/features/admins/hooks/use-create-admin-mutation";
import type { AdminFieldErrors } from "#/features/admins/model";
import { ADMIN_LIST_DEFAULTS } from "#/features/admins/model";

export const Route = createFileRoute("/(protected)/admins/new/")({
	component: NewAdminPage,
});

function NewAdminPage() {
	const { t } = useTranslation("features.admins");
	const navigate = Route.useNavigate();
	const [apiErrors, setApiErrors] = useState<AdminFieldErrors>({});
	const mutation = useCreateAdminMutation({ onValidationError: setApiErrors });
	const listSearch = { ...ADMIN_LIST_DEFAULTS, q: undefined };

	return (
		<section className="mx-auto max-w-2xl space-y-6">
			<header className="border-primary-9 border-b pb-5">
				<Button
					nativeButton={false}
					render={
						<Link search={listSearch} to="/admins">
							<ArrowLeftIcon aria-hidden="true" />
							{t("detail.back")}
						</Link>
					}
					variant="ghost"
				/>
				<p className="mt-5 font-semibold text-primary-9 text-xs uppercase tracking-widest">
					{t("eyebrow")}
				</p>
				<h1 className="mt-2 font-bold text-4xl text-neutral-12 tracking-tight">
					{t("create.title")}
				</h1>
				<p className="mt-2 text-neutral-11">{t("create.description")}</p>
			</header>

			<Card className="p-6">
				<AdminForm
					apiErrors={apiErrors}
					cancelAction={
						<Button
							nativeButton={false}
							render={<Link search={listSearch} to="/admins" />}
							variant="ghost"
						>
							{t("actions.cancel")}
						</Button>
					}
					isPending={mutation.isPending}
					mode="create"
					onSubmit={async (payload) => {
						setApiErrors({});
						try {
							await mutation.mutateAsync({ body: payload });
						} catch (error) {
							if (error instanceof TuyauError) {
								return;
							}
							throw error;
						}
						await navigate({ to: "/admins", search: listSearch });
					}}
				/>
			</Card>
		</section>
	);
}
