import { createFileRoute } from "@tanstack/react-router";
import { useTranslation } from "react-i18next";
import z from "zod";

import { ActivationForm } from "#/features/user_management/invitation/components/activation-form";

const searchParamsSchema = z.object({ token: z.string().optional() });

export const Route = createFileRoute("/(guest)/(auth)/activate-account/")({
	validateSearch: searchParamsSchema,
	component: Page,
});

function Page() {
	const { t } = useTranslation("routes.(guest).(auth).activate-account");
	const { token } = Route.useSearch();

	if (!token) {
		return <p>{t("missing-token")}</p>;
	}

	return (
		<>
			<h1 className="mb-4 font-bold font-display text-3xl text-primary-12 leading-tight">
				{t("title")}
			</h1>
			<p className="mb-9 text-neutral-11">{t("description")}</p>
			<ActivationForm token={token} />
		</>
	);
}
