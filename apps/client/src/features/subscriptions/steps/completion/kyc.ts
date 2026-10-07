import z from "zod";

import { CompanyBeneficialOwnerRoleCode } from "@workspace/api/constants/company_beneficial_owner_role";

import {
	calendarDate,
	country,
	documentCompletion,
	percentage,
	postalCode,
	type RequiredDocument,
	requiredText,
	type SubscriptionSnapshot,
	summarizeCompletion,
	valid,
} from "#/features/subscriptions/steps/completion/completion";

type Profile = NonNullable<SubscriptionSnapshot["kyc"]["profile"]>;
type Owner = SubscriptionSnapshot["kyc"]["owners"][number];
export type KycInput = {
	kyc: {
		profile: Pick<
			Profile,
			| "regulatedActivity"
			| "regulatedActivityReference"
			| "listedCompany"
			| "listedCompanyReference"
			| "bicId"
			| "bearerBondsStructure"
			| "bearerBondsStructurePercentage"
			| "countryOfActivity"
			| "countryOfActivityBreakdown"
			| "countryProvider"
			| "mainMarkets"
		> | null;
		owners: Pick<
			Owner,
			| "kind"
			| "firstName"
			| "lastName"
			| "legalName"
			| "birthDate"
			| "birthCity"
			| "nationality"
			| "roles"
			| "function"
			| "shareholdingPercentage"
			| "address"
		>[];
	};
	kycDocuments: RequiredDocument[];
};

export function kycCompletion({ kyc: { profile, owners }, kycDocuments }: KycInput) {
	const requirements = [
		...(["regulatedActivity", "listedCompany", "bicId", "bearerBondsStructure"] as const).map(
			(field) => valid(z.boolean(), profile?.[field]),
		),
		...(["countryOfActivity", "countryProvider", "mainMarkets"] as const).map((field) =>
			valid(z.enum(["france_and_eu", "other"]), profile?.[field]),
		),
		...documentCompletion(kycDocuments),
	];
	if (profile?.regulatedActivity)
		requirements.push(valid(requiredText, profile.regulatedActivityReference));
	if (profile?.listedCompany)
		requirements.push(valid(requiredText, profile.listedCompanyReference));
	if (profile?.bearerBondsStructure)
		requirements.push(valid(percentage, profile.bearerBondsStructurePercentage));
	if (profile?.countryOfActivity === "other") {
		const activities = profile.countryOfActivityBreakdown ?? [];
		const total = activities.reduce((sum, activity) => sum + (activity.percentage ?? 0), 0);
		// The empty editor displays one country/percentage row. Invalid totals invalidate its percentages.
		for (const activity of activities.length > 0
			? activities
			: [{ country: null, percentage: null }]) {
			requirements.push(
				valid(country, activity.country),
				valid(percentage.positive(), activity.percentage) && Math.abs(total - 100) < 0.001,
			);
		}
	}
	for (const owner of owners) {
		requirements.push(
			valid(z.literal([1, 2]), owner.kind),
			valid(z.array(z.enum(CompanyBeneficialOwnerRoleCode)).min(1), owner.roles),
			valid(percentage, owner.shareholdingPercentage),
			valid(country, owner.nationality),
			valid(requiredText, owner.address.lineOne),
			valid(postalCode, owner.address.zip),
			valid(requiredText, owner.address.city),
		);
		if (owner.kind === 1) {
			requirements.push(
				valid(requiredText.max(100), owner.firstName),
				valid(requiredText.max(100), owner.lastName),
				valid(calendarDate, owner.birthDate),
				valid(requiredText.max(100), owner.birthCity),
			);
		} else if (owner.kind === 2) requirements.push(valid(requiredText, owner.legalName));
		if (!owner.roles.includes(CompanyBeneficialOwnerRoleCode.SHAREHOLDER))
			requirements.push(valid(requiredText, owner.function));
	}
	return summarizeCompletion(requirements);
}
