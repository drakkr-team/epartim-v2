import { createFileRoute } from "@tanstack/react-router";
import { useTranslation } from "react-i18next";

import { Button } from "@workspace/ui-react/components/button";
import { DownloadIcon, PlusIcon } from "@workspace/ui-react/icons";

import { PageHeader } from "#/components/app/page-header";
import { useCreateSubscriptionMutation } from "#/features/subscriptions/hooks/use-create-mutation";
import type { BreadcrumbStaticData } from "#/libs/breadcrumb";

export const Route = createFileRoute("/(protected)/(operations)/client-portfolio/")({
	staticData: {
		breadcrumb: { labelKey: "client-portfolio", to: "/client-portfolio" },
	} satisfies BreadcrumbStaticData,
	component: ClientPortfolioPage,
});

function ClientPortfolioPage() {
	const { t: tRoute } = useTranslation("routes.(private)");
	const { t } = useTranslation("routes.(private).(operations).client-portfolio");
	const { mutate: createSubscription, isPending } = useCreateSubscriptionMutation();

	return (
		<PageHeader
			actions={
				<>
					<Button variant="default">
						<DownloadIcon />
						{t("action.export")}
					</Button>
					<Button onClick={() => createSubscription({})} disabled={isPending} variant="primary">
						<PlusIcon />
						{t("action.new-subscription")}
					</Button>
				</>
			}
			description={t("description")}
			section={tRoute("operations")}
			title={tRoute("client-portfolio")}
		/>
	);
}
