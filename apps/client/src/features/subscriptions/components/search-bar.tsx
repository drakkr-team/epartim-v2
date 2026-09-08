import { useTranslation } from "react-i18next";

import { DataTable } from "#/components/app/data-table";

export function SubscriptionsSearchBar() {
	const { t } = useTranslation("routes.(private).(operations).subscriptions");

	return (
		<div className="max-w-md">
			<DataTable.SearchInput aria-label={t("search.label")} placeholder={t("search.placeholder")} />
		</div>
	);
}
