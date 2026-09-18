import { inject } from "@adonisjs/core";
import db from "@adonisjs/lucid/services/db";
import type { Infer } from "@vinejs/vine/types";

import { SubscriptionStep } from "#features/client/subscriptions/services/steps/step.types";
import ValidateSubscriptionStepService from "#features/client/subscriptions/services/steps/validate.service";
import Company from "#models/company";
import CompanyKycProfile, { CompanyKycGeography } from "#models/company_kyc_profile";
import Subscription from "#models/subscription";
import { UpdateKycProfileSchema } from "#validators/subscription/kyc_profile.validator";

export type UpdateKycProfilePayload = Infer<typeof UpdateKycProfileSchema>;

@inject()
export default class UpdateKycProfileService {
	constructor(protected validateSubscriptionStepService: ValidateSubscriptionStepService) {}

	async handle(subscription: Subscription, payload: UpdateKycProfilePayload) {
		return db.transaction(async (trx) => {
			const company = await Company.findByOrFail("subscriptionId", subscription.id, {
				client: trx,
			});
			const profile =
				(await CompanyKycProfile.findBy("companyId", company.id, { client: trx })) ??
				(await CompanyKycProfile.create({ companyId: company.id }, { client: trx }));

			const {
				bearerBondsStructurePercentage,
				countryOfActivityBreakdown,
				countryProviderCountries,
				mainMarketsCountries,
				...profileChanges
			} = payload.kycProfile;
			profile.merge({
				...profileChanges,
				...(bearerBondsStructurePercentage === undefined
					? {}
					: {
							bearerBondsStructurePercentage:
								bearerBondsStructurePercentage === null
									? null
									: String(bearerBondsStructurePercentage),
						}),
				...(countryOfActivityBreakdown === undefined ? {} : { countryOfActivityBreakdown }),
				...(countryProviderCountries === undefined ? {} : { countryProviderCountries }),
				...(mainMarketsCountries === undefined ? {} : { mainMarketsCountries }),
			});
			this.#clearInactiveValues(profile);
			await profile.useTransaction(trx).save();
			await this.validateSubscriptionStepService.invalidate(
				subscription,
				trx,
				SubscriptionStep.KYC,
			);

			return profile;
		});
	}

	#clearInactiveValues(profile: CompanyKycProfile) {
		if (!profile.regulatedActivity) profile.regulatedActivityReference = null;
		if (!profile.listedCompany) profile.listedCompanyReference = null;
		if (!profile.bearerBondsStructure) profile.bearerBondsStructurePercentage = null;

		if (profile.countryOfActivity !== CompanyKycGeography.OTHER) {
			profile.countryOfActivityReference = null;
			profile.countryOfActivityBreakdown = null;
		} else if (profile.countryOfActivityBreakdown !== null) {
			profile.countryOfActivityReference = null;
		}
		if (profile.countryProvider !== CompanyKycGeography.OTHER) {
			profile.countryProviderReference = null;
			profile.countryProviderCountries = null;
		} else if (profile.countryProviderCountries !== null) {
			profile.countryProviderReference = null;
		}
		if (profile.mainMarkets !== CompanyKycGeography.OTHER) {
			profile.mainMarketsReference = null;
			profile.mainMarketsCountries = null;
		} else if (profile.mainMarketsCountries !== null) {
			profile.mainMarketsReference = null;
		}
	}
}
