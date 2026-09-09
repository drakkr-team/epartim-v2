import { useTranslation } from "react-i18next";

import type { Subscription } from "@workspace/api/data";
import { Badge } from "@workspace/ui-react/components/badge";

const subscriptionStatuses = [
	{ translationKey: "draft", color: "neutral" },
	{ translationKey: "waiting-for-signatures", color: "warning" },
	{ translationKey: "to-be-sent", color: "info" },
	{ translationKey: "complete", color: "success" },
	{ translationKey: "error", color: "error" },
] as const;

export function SubscriptionStatusCell({ status }: Pick<Subscription, "status">) {
	const { t } = useTranslation("features.subscriptions.hooks.use-table");
	const subscriptionStatus = subscriptionStatuses[status];

	return (
		<Badge color={subscriptionStatus.color}>
			{t(`status.${subscriptionStatus.translationKey}`)}
		</Badge>
	);
}
