import { createFileRoute } from "@tanstack/react-router";
import { useTranslation } from "react-i18next";

import { PageHeader } from "#/components/app/page-header";
import type { BreadcrumbStaticData } from "#/libs/breadcrumb";

export const Route = createFileRoute("/(protected)/(operations)/souscription/$id/")({
	staticData: {
		breadcrumb: { labelKey: "new-subscription", to: "/souscription/$id" },
	} satisfies BreadcrumbStaticData,
	component: NewSubscriptionPage,
});

function NewSubscriptionPage() {
	const { t: tRoute } = useTranslation("routes.(private)");
	const { t } = useTranslation("routes.(private).(operations).souscription.$id");

	return (
		<PageHeader
			description={t("description")}
			section={tRoute("operations")}
			title={tRoute("new-subscription")}
		/>
	);
}
