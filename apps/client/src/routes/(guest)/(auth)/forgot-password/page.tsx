import { createFileRoute } from "@tanstack/react-router";
import { useTranslation } from "react-i18next";

import { ForgotPasswordForm } from "#/features/user_management/password/components/forgot-form";

export const Route = createFileRoute("/(guest)/(auth)/forgot-password/")({
	component: Page,
});

function Page() {
	const { t } = useTranslation("routes.(guest).(auth).forgot-password");

	return (
		<>
			<header className="mb-6">
				<p className="font-semibold text-[10.5px] text-secondary-11 uppercase tracking-[0.18em]">
					{t("eyebrow")}
				</p>
				<h1 className="mt-1.5 font-bold text-[26px] text-primary-12 leading-tight">{t("title")}</h1>
				<p className="mt-1.5 text-[13px] text-neutral-11 leading-snug">{t("description")}</p>
			</header>

			<ForgotPasswordForm />
		</>
	);
}
