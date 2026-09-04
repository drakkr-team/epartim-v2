import { createFileRoute } from "@tanstack/react-router";
import { useTranslation } from "react-i18next";

import { Button } from "@workspace/ui-react/components/button";
import { PlusIcon } from "@workspace/ui-react/icons";

import { PageHeader } from "#/components/app/page-header";
import { useCreateSubscriptionMutation } from "#/features/subscriptions/hooks/use-create-mutation";
import type { BreadcrumbStaticData } from "#/libs/breadcrumb";

export const Route = createFileRoute("/(protected)/(operations)/subscriptions/")({
	staticData: {
		breadcrumb: { labelKey: "subscriptions", to: "/subscriptions" },
	} satisfies BreadcrumbStaticData,
	component: SubscriptionsPage,
});

function SubscriptionsPage() {
	const { t: tRoute } = useTranslation("routes.(private)");
	const { t } = useTranslation("routes.(private).(operations).subscriptions");
	const { mutate: createSubscription, isPending } = useCreateSubscriptionMutation();

	return (
		<PageHeader
			actions={
				<Button onClick={() => createSubscription({})} disabled={isPending} variant="primary">
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
