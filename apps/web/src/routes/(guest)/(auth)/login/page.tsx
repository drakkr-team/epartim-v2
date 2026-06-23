import { createFileRoute } from "@tanstack/react-router";
import { useTranslation } from "react-i18next";
import { z } from "zod";

import { LoginForm } from "#/features/user_management/authentication/components/login-form";

const searchParamsSchema = z.object({
	redirectTo: z.string().optional(),
});

export const Route = createFileRoute("/(guest)/(auth)/login/")({
	validateSearch: searchParamsSchema,
	component: Page,
});

function Page() {
	const { t } = useTranslation("routes.(guest).(auth).login");

	const { redirectTo } = Route.useSearch();

	return (
		<>
			<h1 className="mb-9 font-serif text-4xl text-primary-11 sm:text-5xl">{t("title")}</h1>

			<LoginForm redirectTo={redirectTo} />
		</>
	);
}
