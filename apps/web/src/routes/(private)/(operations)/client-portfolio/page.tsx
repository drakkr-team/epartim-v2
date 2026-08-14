import { createFileRoute } from "@tanstack/react-router";
import { useTranslation } from "react-i18next";

import type { BreadcrumbStaticData } from "#/libs/breadcrumb";

export const Route = createFileRoute("/(private)/(operations)/client-portfolio/")({
	staticData: {
		breadcrumb: { labelKey: "client-portfolio" },
	} satisfies BreadcrumbStaticData,
	component: ClientPortfolioPage,
});

function ClientPortfolioPage() {
	const { t } = useTranslation("routes.(private)");

	return (
		<div>
			<h1 className="font-bold text-4xl">{t("client-portfolio")}</h1>
		</div>
	);
}
