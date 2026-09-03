import { useSuspenseQuery } from "@tanstack/react-query";
import { createFileRoute, notFound } from "@tanstack/react-router";
import { TuyauError } from "@tuyau/core/client";
import { useTranslation } from "react-i18next";

import { Card } from "@workspace/ui-react/components/card";

import { AdminForm } from "#/features/admins/components/form";
import { api } from "#/libs/tuyau";

export const Route = createFileRoute("/(protected)/admins/$adminId/edit/")({
	loader: async ({ context, params }) => {
		await context.queryClient.query(
			api.admins.view.queryOptions({ params: { adminId: params.adminId } }),
		);
	},
	onError: (error) => {
		if (error instanceof TuyauError) {
			if (error.isStatus(404)) {
				throw notFound();
			}
		}
	},
	component: Page,
});

function Page() {
	const { t } = useTranslation("routes.(protected).admins.$adminId.edit");

	const { adminId } = Route.useParams();

	const { data: admin } = useSuspenseQuery(api.admins.view.queryOptions({ params: { adminId } }));

	return (
		<main className="mx-auto grid max-w-lg gap-9">
			<header className="grid gap-1">
				<h2 className="font-bold text-primary-9 text-xs uppercase tracking-widest">
					{t("headline")}
				</h2>
				<h1 className="font-bold text-3xl text-secondary-12">{t("title")}</h1>
				<p className="text-neutral-11 text-sm">{t("description")}</p>
			</header>

			<Card>
				<AdminForm action="update" adminId={adminId} defaultValues={admin} />
			</Card>
		</main>
	);
}
