import { useTranslation } from "react-i18next";

import type { routes } from "@workspace/api/registry";

type Subscription = (typeof routes)["client.subscriptions.view"]["types"]["response"];

type SubscriptionSummaryProps = {
	subscription: Subscription;
};

export function SubscriptionSummary(props: SubscriptionSummaryProps) {
	const { subscription } = props;
	const { t } = useTranslation("features.subscriptions.components.subscription-summary");
	const { creator, legalIdentification } = subscription;
	const headcount = Number(legalIdentification?.companyHeadcount);
	const hasHeadcount = Number.isInteger(headcount) && headcount > 0;
	const emptyValue = t("empty");
	const details = [
		{
			label: t("reference"),
			value: t("reference-value", {
				year: subscription.createdAt.getFullYear(),
				id: subscription.id.toString().padStart(4, "0"),
			}),
		},
		{ label: t("siret"), value: legalIdentification?.siret || emptyValue },
		{
			label: t("headcount"),
			value: hasHeadcount ? t("headcount-value", { count: headcount }) : emptyValue,
		},
		{ label: t("distributor"), value: creator?.name || emptyValue },
	];

	return (
		<section className="rounded-sm bg-secondary-12 p-5 shadow shadow-secondary-5">
			<p className="font-bold text-primary-9 text-xs uppercase tracking-widest">{t("eyebrow")}</p>
			<h2 className="mt-3 font-bold text-neutral-1 text-xl">
				{legalIdentification?.name || emptyValue}
			</h2>

			<dl className="mt-3">
				{details.map((detail) => (
					<div
						key={detail.label}
						className="flex items-baseline justify-between gap-4 border-secondary-10 border-b py-1.5 first:border-t"
					>
						<dt className="text-secondary-8 text-xs">{detail.label}</dt>
						<dd className="text-right font-medium text-neutral-1 text-xs">{detail.value}</dd>
					</div>
				))}
			</dl>
		</section>
	);
}
