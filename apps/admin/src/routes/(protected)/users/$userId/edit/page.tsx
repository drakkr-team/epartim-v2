import { useSuspenseQuery } from "@tanstack/react-query";
import { createFileRoute, notFound } from "@tanstack/react-router";
import { TuyauError } from "@tuyau/core/client";
import { useTranslation } from "react-i18next";

import { Card } from "@workspace/ui-react/components/card";

import { UserForm } from "#/features/users/components/form";
import { api } from "#/libs/tuyau";

export const Route = createFileRoute("/(protected)/users/$userId/edit/")({
	loader: async ({ context, params }) => {
		await context.queryClient.query(
			api.users.view.queryOptions({ params: { userId: params.userId } }, { staleTime: "static" }),
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
	const { t } = useTranslation("routes.(protected).users.$userId.edit");

	const { userId } = Route.useParams();

	const { data: user } = useSuspenseQuery(api.users.view.queryOptions({ params: { userId } }));

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
				<UserForm action="update" userId={userId} defaultValues={user} />
			</Card>
		</main>
	);
}
