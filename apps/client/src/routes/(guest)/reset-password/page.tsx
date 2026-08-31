import { createFileRoute } from "@tanstack/react-router";
import { useEffect } from "react";
import { useTranslation } from "react-i18next";
import z from "zod";

import { Card } from "@workspace/ui-react/components/card";
import { toast } from "@workspace/ui-react/components/toast";

import { ResetPasswordForm } from "#/features/account_management/password/components/reset-form";

const searchParamsSchema = z.object({
	token: z.string().optional(),
});

export const Route = createFileRoute("/(guest)/reset-password/")({
	validateSearch: searchParamsSchema,
	component: Page,
});

function Page() {
	const { t } = useTranslation("routes.(guest).reset-password");

	const { token } = Route.useSearch();
	const navigate = Route.useNavigate();

	useEffect(() => {
		if (token) return;

		const timeout = setTimeout(() => {
			toast.error(t("error.invalid-token.title"), {
				description: t("error.invalid-token.description"),
			});
		});
		navigate({ to: "/login", replace: true });

		return () => clearTimeout(timeout);
	}, [token, t, navigate]);

	if (!token) return null;

	return (
		<Card className="grid gap-6 p-8">
			<header className="grid gap-1">
				<h2 className="font-bold text-2xs text-primary-11 uppercase tracking-widest">
					{t("headline")}
				</h2>
				<h1 className="font-bold text-2xl text-secondary-12">{t("title")}</h1>
				<p className="text-neutral-11 text-xs">{t("description")}</p>
			</header>

			<ResetPasswordForm token={token} />
		</Card>
	);
}
