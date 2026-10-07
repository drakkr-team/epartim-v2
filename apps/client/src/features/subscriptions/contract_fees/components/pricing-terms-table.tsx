import { useTranslation } from "react-i18next";

import {
	SUBSCRIPTION_PRICING_TERMS,
	SubscriptionEntryFeePayer,
} from "@workspace/api/constants/subscription_contract_fee";
import type { routes } from "@workspace/api/registry";
import { Table } from "@workspace/ui-react/components/table";

type Subscription = (typeof routes)["client.subscriptions.view"]["types"]["response"];
type PricingTermsTableProps = Pick<
	Subscription["contractFees"],
	"pricingOffer" | "entryFeePayer" | "entryFeeRate"
> & {
	contractFees: Subscription["contractFees"];
};

const currency = new Intl.NumberFormat("fr-FR", { style: "currency", currency: "EUR" });
const percentage = new Intl.NumberFormat("fr-FR", {
	style: "percent",
	maximumFractionDigits: 2,
});

export function PricingTermsTable({
	pricingOffer,
	entryFeePayer,
	entryFeeRate,
	contractFees,
}: PricingTermsTableProps) {
	const { t } = useTranslation("features.subscriptions.contract_fees");
	const terms =
		pricingOffer === contractFees.pricingOffer
			? contractFees
			: SUBSCRIPTION_PRICING_TERMS[pricingOffer];
	const rows = [
		{ key: "annualAccount", amount: currency.format(terms.annualAccountFee) },
		{
			key: "employeeAccount",
			amount:
				terms.annualAccountFeePerEmployee === 0
					? t("pricing.table.included")
					: currency.format(terms.annualAccountFeePerEmployee),
		},
		{
			key: "entryFees",
			amount:
				entryFeePayer === SubscriptionEntryFeePayer.COMPANY &&
				entryFeeRate !== null &&
				Number.isFinite(entryFeeRate)
					? percentage.format(entryFeeRate / 100)
					: t("pricing.table.entryFeeRange"),
		},
		{ key: "amundiOperation", amount: currency.format(300) },
		{ key: "companyOperation", amount: currency.format(30) },
		{ key: "placementChoices", amount: currency.format(1) },
		{ key: "digitalBulletin", amount: t("pricing.table.free") },
		{ key: "paperBulletin", amount: currency.format(1) },
		{ key: "postage", amount: t("pricing.table.currentRate") },
	] as const;

	return (
		<div className="grid gap-3">
			<h3
				id="pricing-table-heading"
				className="font-semibold text-neutral-11 text-xs uppercase tracking-wider"
			>
				{t("pricing.table.title")}
			</h3>
			<Table aria-labelledby="pricing-table-heading">
				<Table.Header>
					<Table.Row>
						<Table.HeaderCell scope="col">{t("pricing.table.service")}</Table.HeaderCell>
						<Table.HeaderCell scope="col">{t("pricing.table.frequency")}</Table.HeaderCell>
						<Table.HeaderCell scope="col">{t("pricing.table.amount")}</Table.HeaderCell>
					</Table.Row>
				</Table.Header>
				<Table.Body>
					{rows
						.filter(
							(row) =>
								row.key !== "entryFees" || entryFeePayer === SubscriptionEntryFeePayer.COMPANY,
						)
						.map((row) => (
							<Table.Row key={row.key}>
								<Table.Cell className="min-w-48 whitespace-normal font-medium">
									{t(`pricing.table.rows.${row.key}.label`)}
								</Table.Cell>
								<Table.Cell className="min-w-32 whitespace-normal text-neutral-11">
									{t(`pricing.table.rows.${row.key}.frequency`)}
								</Table.Cell>
								<Table.Cell className="whitespace-nowrap">{row.amount}</Table.Cell>
							</Table.Row>
						))}
				</Table.Body>
			</Table>
		</div>
	);
}
