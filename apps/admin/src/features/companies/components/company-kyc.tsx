import { useTranslation } from "react-i18next";

import { Card } from "@workspace/ui-react/components/card";

import { DetailField } from "#/components/app/detail-field";
import type { CompanyDetail } from "#/features/companies/types";

export function CompanyKyc({ profile }: { profile: CompanyDetail["kycProfile"] }) {
	const { t } = useTranslation("routes.(protected).companies.$companyId");
	const empty = t("status.notProvided");

	return (
		<Card className="grid grid-cols-2 gap-4">
			<h2 className="col-span-2 font-semibold text-lg text-secondary-12">{t("section.kyc")}</h2>
			{profile ? (
				<>
					<DetailField
						label={t("field.kyc.regulatedActivity")}
						value={t(profile.regulatedActivity ? "status.yes" : "status.no")}
					/>
					<DetailField
						label={t("field.kyc.regulatedActivityReference")}
						value={profile.regulatedActivityReference ?? empty}
					/>
					<DetailField
						label={t("field.kyc.listedCompany")}
						value={t(profile.listedCompany ? "status.yes" : "status.no")}
					/>
					<DetailField
						label={t("field.kyc.listedCompanyReference")}
						value={profile.listedCompanyReference ?? empty}
					/>
					<DetailField
						label={t("field.kyc.bicId")}
						value={t(profile.bicId ? "status.yes" : "status.no")}
					/>
					<DetailField
						label={t("field.kyc.bearerBondsStructure")}
						value={t(profile.bearerBondsStructure ? "status.yes" : "status.no")}
					/>
					<DetailField
						label={t("field.kyc.bearerBondsStructurePercentage")}
						value={
							profile.bearerBondsStructurePercentage === null
								? empty
								: `${profile.bearerBondsStructurePercentage} %`
						}
					/>
					<DetailField
						label={t("field.kyc.countryOfActivity")}
						value={t(`geography.${profile.countryOfActivity}`)}
					/>
					<DetailField
						label={t("field.kyc.countryOfActivityBreakdown")}
						value={
							profile.countryOfActivityBreakdown?.length
								? profile.countryOfActivityBreakdown
										.map(({ country, percentage }) => `${country}: ${percentage} %`)
										.join(", ")
								: empty
						}
					/>
					<DetailField
						label={t("field.kyc.countryOfActivityReference")}
						value={profile.countryOfActivityReference ?? empty}
					/>
					<DetailField
						label={t("field.kyc.countryProvider")}
						value={t(`geography.${profile.countryProvider}`)}
					/>
					<DetailField
						label={t("field.kyc.countryProviderCountries")}
						value={profile.countryProviderCountries?.join(", ") || empty}
					/>
					<DetailField
						label={t("field.kyc.countryProviderReference")}
						value={profile.countryProviderReference ?? empty}
					/>
					<DetailField
						label={t("field.kyc.mainMarkets")}
						value={t(`geography.${profile.mainMarkets}`)}
					/>
					<DetailField
						label={t("field.kyc.mainMarketsCountries")}
						value={profile.mainMarketsCountries?.join(", ") || empty}
					/>
					<DetailField
						label={t("field.kyc.mainMarketsReference")}
						value={profile.mainMarketsReference ?? empty}
					/>
				</>
			) : (
				<p className="col-span-2 text-neutral-11 text-sm">{empty}</p>
			)}
		</Card>
	);
}
