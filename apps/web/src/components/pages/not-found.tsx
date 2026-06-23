import { Link, type NotFoundRouteProps } from "@tanstack/react-router";
import { useTranslation } from "react-i18next";

import { Button } from "@workspace/ui-react/components/button";

export function NotFoundPage(_props: NotFoundRouteProps) {
	const { t } = useTranslation("components.pages.not-found");

	return (
		<main className="flex min-h-svh flex-col items-center justify-center p-4 text-center">
			<h1 className="mb-2 font-serif text-5xl text-primary-11">{t("title")}</h1>
			<p className="mb-8 text-neutral-11 text-sm">{t("descritpion")}</p>
			<Button nativeButton={false} variant="primary" render={<Link to="/" />}>
				{t("back")}
			</Button>
		</main>
	);
}
