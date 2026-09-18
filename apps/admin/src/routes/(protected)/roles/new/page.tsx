import { createFileRoute, redirect } from "@tanstack/react-router";
import { useTranslation } from "react-i18next";

import { Card } from "@workspace/ui-react/components/card";

import { RoleForm } from "#/features/roles/components/form";
import { api } from "#/libs/tuyau";

export const Route = createFileRoute("/(protected)/roles/new/")({
	loader: async ({ context }) => {
		const roles = await context.queryClient.query(
			api.roles.list.queryOptions({ query: { perPage: 1 } }),
		);

		if (!roles.meta.canCreate) {
			throw redirect({ to: "/roles" });
		}
	},
	component: Page,
});

function Page() {
	const { t } = useTranslation("routes.(protected).roles.new");

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
				<RoleForm action="create" />
			</Card>
		</main>
	);
}
