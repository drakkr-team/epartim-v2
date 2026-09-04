import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useTranslation } from "react-i18next";

import { Button } from "@workspace/ui-react/components/button";
import { PlusIcon } from "@workspace/ui-react/icons";

import { PageHeader } from "#/components/app/page-header";
import type { BreadcrumbStaticData } from "#/libs/breadcrumb";

export const Route = createFileRoute("/(protected)/(operations)/souscriptions/")({
	staticData: {
		breadcrumb: { labelKey: "subscriptions", to: "/souscriptions" },
	} satisfies BreadcrumbStaticData,
	component: SubscriptionsPage,
});

function SubscriptionsPage() {
	const { t: tRoute } = useTranslation("routes.(private)");
	const { t } = useTranslation("routes.(private).(operations).souscriptions");
	const navigate = useNavigate();

	return (
		<PageHeader
			actions={
				<Button
					onClick={() =>
						navigate({
							to: "/souscription/$id",
							params: { id: crypto.randomUUID() },
						})
					}
					variant="primary"
				>
					<PlusIcon />
					{t("action.new-subscription")}
				</Button>
			}
			description={t("description")}
			section={tRoute("operations")}
			title={tRoute("subscriptions")}
		/>
	);
}
