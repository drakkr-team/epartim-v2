import { useTranslation } from "react-i18next";

import { Table } from "@workspace/ui-react/components/table";

const currency = new Intl.NumberFormat("fr-FR", { style: "currency", currency: "EUR" });

export function OperationsServicesTable() {
	const { t } = useTranslation("features.subscriptions.contract_fees");
	const rows = [
		{ key: "collectiveTransfer", amount: currency.format(500) },
		{ key: "digitalCommunication", amount: t("operations.table.onQuote") },
		{ key: "recentDocumentSearch", amount: currency.format(15) },
		{ key: "olderDocumentSearch", amount: currency.format(30) },
		{ key: "accountStatement", amount: currency.format(3) },
		{ key: "simpleReporting", amount: currency.format(200) },
		{ key: "complexReporting", amount: t("operations.table.onQuote") },
		{ key: "individualCorrection", amount: currency.format(50) },
		{ key: "otherCorrections", amount: t("operations.table.onQuote") },
	] as const;

	return (
		<Table aria-labelledby="operations-services-heading">
			<Table.Header>
				<Table.Row>
					<Table.HeaderCell scope="col">{t("operations.table.service")}</Table.HeaderCell>
					<Table.HeaderCell scope="col">{t("operations.table.frequency")}</Table.HeaderCell>
					<Table.HeaderCell scope="col">{t("operations.table.amount")}</Table.HeaderCell>
				</Table.Row>
			</Table.Header>
			<Table.Body>
				{rows.map((row) => (
					<Table.Row key={row.key}>
						<Table.Cell className="min-w-48 whitespace-normal font-medium">
							{t(`operations.table.rows.${row.key}.label`)}
						</Table.Cell>
						<Table.Cell className="min-w-32 whitespace-normal text-neutral-11">
							{t(`operations.table.rows.${row.key}.frequency`)}
						</Table.Cell>
						<Table.Cell className="whitespace-nowrap">{row.amount}</Table.Cell>
					</Table.Row>
				))}
			</Table.Body>
		</Table>
	);
}
