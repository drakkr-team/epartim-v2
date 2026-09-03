import { createFileRoute } from "@tanstack/react-router";
import { useTranslation } from "react-i18next";

import { Card } from "@workspace/ui-react/components/card";

import { NetworkForm } from "#/features/networks/components/form";

export const Route = createFileRoute("/(protected)/networks/new/")({
	component: Page,
});

function Page() {
	const { t } = useTranslation("routes.(protected).networks.new");

	return (
		<main className="mx-auto grid max-w-xl gap-9">
			<header className="grid gap-1">
				<h2 className="font-bold text-primary-9 text-xs uppercase tracking-widest">
					{t("headline")}
				</h2>
				<h1 className="font-bold text-3xl text-secondary-12">{t("title")}</h1>
				<p className="text-neutral-11 text-sm">{t("description")}</p>
			</header>

			<Card>
				<NetworkForm action="create" />
			</Card>
		</main>
	);
}
