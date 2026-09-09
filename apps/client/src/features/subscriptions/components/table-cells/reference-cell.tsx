import { useTranslation } from "react-i18next";

import type { Subscription } from "@workspace/api/data";

export function SubscriptionReferenceCell({
	createdAt,
	id,
}: Pick<Subscription, "createdAt" | "id">) {
	const { t } = useTranslation("features.subscriptions.hooks.use-table");

	return (
		<span className="font-semibold">{t("reference", { year: createdAt.getFullYear(), id })}</span>
	);
}
