import { useTranslation } from "react-i18next";

import type { Contact } from "@workspace/api/data";
import { Card } from "@workspace/ui-react/components/card";

import { DetailField } from "#/components/app/detail-field.tsx";

type CompanyLegalAgentCardProps = {
	legalAgent?: Contact | null;
};

export function CompanyLegalAgentCard(props: CompanyLegalAgentCardProps) {
	const { legalAgent } = props;

	const { t } = useTranslation("features.companies.components.legal-agent-card");
	const emptyMessage = t("value.empty");

	return (
		<Card className="grid grid-cols-2 gap-4">
			<h2 className="col-span-2 font-semibold text-lg text-secondary-12">{t("title")}</h2>

			{legalAgent ? (
				<>
					<DetailField label={t("field.id")} value={legalAgent.id ?? emptyMessage} />
					<DetailField label={t("field.kind")} value={legalAgent.kind ?? emptyMessage} />

					<DetailField label={t("field.firstName")} value={legalAgent.firstName ?? emptyMessage} />
					<DetailField label={t("field.lastName")} value={legalAgent.lastName ?? emptyMessage} />
					<DetailField label={t("field.email")} value={legalAgent.email ?? emptyMessage} />
					<DetailField
						label={t("field.phoneNumber")}
						value={legalAgent.phoneNumber ?? emptyMessage}
					/>
					<DetailField label={t("field.civility")} value={legalAgent.civility ?? emptyMessage} />
					<DetailField label={t("field.function")} value={legalAgent.function ?? emptyMessage} />
				</>
			) : (
				<p className="col-span-2 text-neutral-11 text-sm">{emptyMessage}</p>
			)}
		</Card>
	);
}
