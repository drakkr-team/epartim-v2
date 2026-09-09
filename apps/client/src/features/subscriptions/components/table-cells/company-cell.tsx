import { useTranslation } from "react-i18next";

import type { Company } from "@workspace/api/data";

export function SubscriptionCompanyCell({ company }: { company: Pick<Company, "name"> }) {
	const { t } = useTranslation("features.subscriptions.hooks.use-table");

	return company.name ? (
		<span className="font-semibold">{company.name}</span>
	) : (
		t("client.new-company")
	);
}
