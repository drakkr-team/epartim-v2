import { useTranslation } from "react-i18next";

export function SaverFeesSection() {
	const { t } = useTranslation("features.subscriptions.contract_fees");

	return (
		<section aria-labelledby="saver-fees-heading" className="grid gap-6">
			<div className="border-neutral-4 border-b pb-4">
				<p className="font-bold text-primary-9 text-xs uppercase tracking-widest">
					{t("savers.eyebrow")}
				</p>
				<h2 id="saver-fees-heading" className="mt-2 font-bold text-secondary-12 text-xl">
					{t("savers.title")}
				</h2>
				<p className="mt-1 text-neutral-11 text-sm">{t("savers.description")}</p>
			</div>
			<p className="text-neutral-11 text-sm">{t("savers.information")}</p>
		</section>
	);
}
