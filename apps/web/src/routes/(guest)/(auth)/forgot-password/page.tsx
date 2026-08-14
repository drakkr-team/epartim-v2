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
			<h1 className="mb-6 font-bold font-display text-3xl text-primary-12 leading-tight">
				{t("title")}
			</h1>

			<ForgotPasswordForm />
		</>
	);
}
