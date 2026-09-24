import { useTranslation } from "react-i18next";

import { COMPANY_LEGAL_FORMS } from "@workspace/api/constants/company";
import type { Address, Company, PaymentDetail } from "@workspace/api/data";
import { Card } from "@workspace/ui-react/components/card";
import { Separator } from "@workspace/ui-react/components/separator";

import { DetailField } from "#/components/app/detail-field";
import { humanizeIBAN } from "#/helpers/iban";

type CompanyOverviewCardProps = {
	company: Company & {
		address?: Address | null;
		paymentDetail?: PaymentDetail | null;
	};
};

export function CompanyOverviewCard(props: CompanyOverviewCardProps) {
	const { company } = props;

	const { t } = useTranslation("features.companies.components.overview-card");

	const empty = t("value.empty");
	const legalFormKey = Object.entries(COMPANY_LEGAL_FORMS).find(
		([, value]) => value === company.legalForm,
	)?.[0];

	return (
		<Card className="grid gap-5">
			<div className="grid grid-cols-2 gap-4">
				<h2 className="col-span-2 font-semibold text-lg text-secondary-12">
					{t("section.general")}
				</h2>

				<DetailField label={t("field.id")} value={company.id.toString()} />
				<DetailField label={t("field.name")} value={company.name ?? empty} />
				<DetailField label={t("field.siren")} value={company.siren ?? empty} />
				<DetailField label={t("field.siret")} value={company.siret ?? empty} />
				<DetailField label={t("field.naf")} value={company.naf ?? empty} />
				<DetailField
					label={t("field.legalForm")}
					value={
						legalFormKey
							? t(`value.legalForm.${legalFormKey}`, { defaultValue: legalFormKey })
							: (company.legalForm?.toString() ?? empty)
					}
				/>
				<DetailField
					label={t("field.companyHeadcount")}
					value={company.companyHeadcount ?? empty}
				/>
				<DetailField label={t("field.vatNumber")} value={company.vatNumber ?? empty} />
				<DetailField
					label={t("field.financialYearClosingDay")}
					value={company.financialYearClosingDay ?? empty}
				/>
				<DetailField
					label={t("field.createdAt")}
					value={company.createdAt.toLocaleDateString("fr-FR")}
				/>
				<DetailField
					label={t("field.updatedAt")}
					value={company.updatedAt.toLocaleDateString("fr-FR")}
				/>
			</div>

			<Separator />

			<div className="grid grid-cols-2 gap-4">
				<h2 className="col-span-2 font-semibold text-lg text-secondary-12">
					{t("section.address")}
				</h2>
				{company.address ? (
					<>
						<DetailField
							label={t("field.address.lineOne")}
							value={company.address.lineOne ?? empty}
						/>
						<DetailField
							label={t("field.address.lineTwo")}
							value={company.address.lineTwo ?? empty}
						/>
						<DetailField label={t("field.address.zip")} value={company.address.zip ?? empty} />
						<DetailField label={t("field.address.city")} value={company.address.city ?? empty} />
					</>
				) : (
					<p className="col-span-2 text-neutral-11 text-sm">{empty}</p>
				)}
			</div>

			<Separator />

			<div className="grid grid-cols-2 gap-4">
				<h2 className="col-span-2 font-semibold text-lg text-secondary-12">
					{t("section.payment")}
				</h2>
				{company.paymentDetail ? (
					<>
						<DetailField
							label={t("field.paymentDetail.iban")}
							value={company.paymentDetail.iban ? humanizeIBAN(company.paymentDetail.iban) : empty}
						/>
						<DetailField
							label={t("field.paymentDetail.bic")}
							value={company.paymentDetail.bic ?? empty}
						/>
					</>
				) : (
					<p className="col-span-2 text-neutral-11 text-sm">{empty}</p>
				)}
			</div>
		</Card>
	);
}
