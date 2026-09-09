import { useTranslation } from "react-i18next";

import type { Subscription } from "@workspace/api/data";
import { Badge } from "@workspace/ui-react/components/badge";

const subscriptionStatuses = [
	{ translationKey: "draft", variant: "neutral" },
	{ translationKey: "waiting-for-signatures", variant: "warning" },
	{ translationKey: "to-be-sent", variant: "info" },
	{ translationKey: "complete", variant: "success" },
	{ translationKey: "error", variant: "error" },
] as const;

export function SubscriptionStatusCell({ status }: Pick<Subscription, "status">) {
	const { t } = useTranslation("features.subscriptions.hooks.use-table");
	const subscriptionStatus = subscriptionStatuses[status];

	return (
		<Badge variant={subscriptionStatus.variant}>
			{t(`status.${subscriptionStatus.translationKey}`)}
		</Badge>
	);
}
