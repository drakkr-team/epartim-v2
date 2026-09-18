import { useSuspenseQuery } from "@tanstack/react-query";
import { createFileRoute, notFound } from "@tanstack/react-router";
import { TuyauError } from "@tuyau/core/client";
import { useTranslation } from "react-i18next";

import { Card } from "@workspace/ui-react/components/card";

import { RoleForm } from "#/features/roles/components/form";
import { api } from "#/libs/tuyau";

export const Route = createFileRoute("/(protected)/roles/$roleId/edit/")({
	loader: async ({ context, params }) => {
		await context.queryClient.query(
			api.roles.view.queryOptions({ params: { roleId: params.roleId } }, { staleTime: "static" }),
		);
	},
	onError: (error) => {
		if (error instanceof TuyauError && error.isStatus(404)) {
			throw notFound();
		}
	},
	component: Page,
});

function Page() {
	const { t } = useTranslation("routes.(protected).roles.$roleId.edit");
	const { roleId } = Route.useParams();
	const { data: role } = useSuspenseQuery(api.roles.view.queryOptions({ params: { roleId } }));

	return (
		<main className="mx-auto grid max-w-3xl gap-9">
			<header className="grid gap-1">
				<h2 className="font-bold text-primary-9 text-xs uppercase tracking-widest">
					{t("headline")}
				</h2>
				<h1 className="font-bold text-3xl text-secondary-12">{t("title")}</h1>
				<p className="text-neutral-11 text-sm">{t("description")}</p>
			</header>

			<Card>
				<RoleForm action="update" roleId={roleId} defaultValues={role} />
			</Card>
		</main>
	);
}
