import { useSuspenseQuery } from "@tanstack/react-query";
import { createFileRoute, notFound } from "@tanstack/react-router";
import { TuyauError } from "@tuyau/core/client";
import { useTranslation } from "react-i18next";

import { Card } from "@workspace/ui-react/components/card";

import { FirmForm } from "#/features/firms/components/form";
import { api } from "#/libs/tuyau";

export const Route = createFileRoute("/(protected)/firms/$firmId/edit/")({
	loader: async ({ context, params }) => {
		await context.queryClient.query(
			api.firms.view.queryOptions({ params: { firmId: params.firmId } }, { staleTime: "static" }),
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
	const { t } = useTranslation("routes.(protected).firms.$firmId.edit");

	const { firmId } = Route.useParams();
	const { data: firm } = useSuspenseQuery(api.firms.view.queryOptions({ params: { firmId } }));

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
				<FirmForm action="update" firmId={firmId} defaultValues={firm} />
			</Card>
		</main>
	);
}
