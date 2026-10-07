import {
	SubscriptionMatchingCalculationMethod,
	SubscriptionMatchingDistributionPeriod,
} from "#constants/subscription_matching";
import SubscriptionNotEditableException from "#exceptions/subscription_not_editable.exception";
import Company from "#models/company";
import { CompanyKycGeography } from "#models/company_kyc_profile";
import Contact from "#models/contact";
import Subscription from "#models/subscription";
import SubscriptionFormalism from "#models/subscription_formalism";

function hasValues(attributes: Record<string, unknown>, ignored: string[] = []) {
	return Object.entries(attributes).some(
		([key, value]) =>
			!["id", "createdAt", "updatedAt", ...ignored].includes(key) &&
			value !== null &&
			value !== undefined &&
			value !== "" &&
			value !== false &&
			(!Array.isArray(value) || value.length > 0),
	);
}

export default class ChangeSubscriptionCompanyService {
	assertEditable(subscription: Subscription) {
		if (!subscription.isDraft && !subscription.isWaitingForEpartimValidation) {
			throw new SubscriptionNotEditableException();
		}
	}

	async requiresConfirmation(subscription: Subscription, company: Company, siren: string | null) {
		if (siren === company.siren) return false;
		if (
			hasValues(company.$attributes, [
				"subscriptionId",
				"siren",
				"addressId",
				"paymentDetailId",
				"companyLegalAgentId",
				"companySignerId",
				"companyCorrespondentId",
			])
		)
			return true;
		if (subscription.completedSteps?.length) return true;
		const [
			address,
			bank,
			contacts,
			profile,
			owners,
			documents,
			plan,
			agreements,
			fees,
			contactsWithRoles,
			formalism,
		] = await Promise.all([
			company.related("address").query().first(),
			company.related("paymentDetail").query().first(),
			Contact.query().whereIn(
				"id",
				[
					company.companyLegalAgentId,
					company.companySignerId,
					company.companyCorrespondentId,
				].filter((id): id is number => id != null),
			),
			company.related("kycProfile").query().first(),
			company.related("beneficialOwners").query().first(),
			subscription.related("documents").query().first(),
			subscription.related("plan").query().preload("adhesions").preload("matchingRules").first(),
			subscription.related("existingAgreements").query().first(),
			subscription.related("contractFees").query().first(),
			subscription
				.related("company")
				.query()
				.whereHas("contacts", () => {})
				.first(),
			SubscriptionFormalism.query().where("subscriptionId", subscription.id).first(),
		]);
		if (address && hasValues(address.$attributes)) return true;
		if (bank && hasValues(bank.$attributes)) return true;
		if (
			contacts.some((contact) =>
				hasValues(contact.$attributes, ["kind", "isSignatoryOnKbis", "isSameAsLegal"]),
			)
		)
			return true;
		if (
			profile &&
			[profile.countryOfActivity, profile.countryProvider, profile.mainMarkets].some(
				(value) => value !== CompanyKycGeography.FRANCE_AND_EU,
			)
		)
			return true;
		if (
			profile &&
			hasValues(profile.$attributes, [
				"companyId",
				"countryOfActivity",
				"countryProvider",
				"mainMarkets",
			])
		)
			return true;
		if (owners || documents || agreements || fees || contactsWithRoles || formalism) return true;
		if (
			plan &&
			(plan.matchingCalculationMethod !== SubscriptionMatchingCalculationMethod.AMUNDI ||
				plan.matchingDistributionPeriod !== SubscriptionMatchingDistributionPeriod.YEARS)
		)
			return true;
		if (
			plan &&
			(plan.adhesions.length ||
				plan.matchingRules.length ||
				hasValues(plan.$attributes, [
					"subscriptionId",
					"matchingCalculationMethod",
					"matchingDistributionPeriod",
				]))
		)
			return true;
		return false;
	}
}
