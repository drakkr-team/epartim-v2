import { createFileRoute } from "@tanstack/react-router";
import { useTranslation } from "react-i18next";

import { Card } from "@workspace/ui-react/components/card";

import { ForgotPasswordForm } from "#/features/account_management/password/components/forgot-form";

export const Route = createFileRoute("/(guest)/forgot-password/")({
	component: Page,
});

function Page() {
	const { t } = useTranslation("routes.(guest).forgot-password");

	return (
		<Card className="grid gap-6 p-8">
			<header className="grid gap-1">
				<h2 className="font-bold text-2xs text-primary-9 uppercase tracking-widest">
					{t("headline")}
				</h2>
				<h1 className="font-bold text-2xl text-secondary-12">{t("title")}</h1>
				<p className="text-neutral-11 text-xs">{t("description")}</p>
			</header>

			<ForgotPasswordForm />
		</Card>
	);
}
