import { useSuspenseQuery } from "@tanstack/react-query";
import { createFileRoute, notFound } from "@tanstack/react-router";
import { TuyauError } from "@tuyau/core/client";
import { useTranslation } from "react-i18next";

import { Card } from "@workspace/ui-react/components/card";

import { NetworkForm } from "#/features/networks/components/form";
import { api } from "#/libs/tuyau";

export const Route = createFileRoute("/(protected)/networks/$networkId/edit/")({
	loader: async ({ context, params }) => {
		await context.queryClient.query(
			api.networks.view.queryOptions({ params: { networkId: params.networkId } }),
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
	const { t } = useTranslation("routes.(protected).networks.$networkId.edit");
	const { networkId } = Route.useParams();
	const { data: network } = useSuspenseQuery(
		api.networks.view.queryOptions({ params: { networkId } }),
	);

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
				<NetworkForm action="update" networkId={networkId} defaultValues={network} />
			</Card>
		</main>
	);
}
