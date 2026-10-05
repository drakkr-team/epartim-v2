import { useTranslation } from "react-i18next";

import { OperationsServicesTable } from "#/features/subscriptions/contract_fees/components/operations-services-table";

export function OperationsServicesSection() {
	const { t } = useTranslation("features.subscriptions.contract_fees");

	return (
		<section aria-labelledby="operations-services-heading" className="grid gap-6">
			<div className="border-neutral-4 border-b pb-4">
				<p className="font-bold text-primary-9 text-xs uppercase tracking-widest">
					{t("operations.eyebrow")}
				</p>
				<h2 id="operations-services-heading" className="mt-2 font-bold text-secondary-12 text-xl">
					{t("operations.title")}
				</h2>
				<p className="mt-1 text-neutral-11 text-sm">{t("operations.description")}</p>
			</div>
			<OperationsServicesTable />
			<div className="grid gap-2 text-neutral-11 text-xs">
				<p>{t("operations.note")}</p>
				<p>{t("operations.directPaymentNote")}</p>
			</div>
		</section>
	);
}
