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
			<header className="mb-6">
				<p className="font-semibold text-[10.5px] text-brand-gold-strong uppercase tracking-[0.18em]">
					{t("eyebrow")}
				</p>
				<h1 className="mt-1.5 font-bold text-[26px] text-brand-navy leading-tight">{t("title")}</h1>
				<p className="mt-1.5 text-[13px] text-brand-ink-muted leading-snug">{t("description")}</p>
			</header>

			<LoginForm redirectTo={redirectTo} />
		</>
	);
}
