import type CompanyKycProfile from "#models/company_kyc_profile";

export default class CompanyKycProfilePresenter {
	toJSON(profile: CompanyKycProfile) {
		return {
			id: profile.id,
			companyId: profile.companyId,
			regulatedActivity: profile.regulatedActivity,
			regulatedActivityReference: profile.regulatedActivityReference,
			listedCompany: profile.listedCompany,
			listedCompanyReference: profile.listedCompanyReference,
			bicId: profile.bicId,
			bearerBondsStructure: profile.bearerBondsStructure,
			bearerBondsStructurePercentage:
				profile.bearerBondsStructurePercentage === null
					? null
					: Number(profile.bearerBondsStructurePercentage),
			countryOfActivity: profile.countryOfActivity,
			countryOfActivityReference: profile.countryOfActivityReference,
			countryProvider: profile.countryProvider,
			countryProviderReference: profile.countryProviderReference,
			mainMarkets: profile.mainMarkets,
			mainMarketsReference: profile.mainMarketsReference,
		};
	}
}
