import { useCallback } from "react";

import type { routes } from "@workspace/api/registry";
import { Card } from "@workspace/ui-react/components/card";

import { BeneficialOwnersSection } from "#/features/subscriptions/kyc/components/beneficial-owners-section";
import { KycProfileSection } from "#/features/subscriptions/kyc/components/kyc-profile-section";
import {
	KYC_OWNER_KIND,
	KYC_OWNER_ROLES,
	type KycOwnerValues,
	type KycProfileValues,
	type KycValues,
	useKycForm,
} from "#/features/subscriptions/kyc/hooks/use-form";
import { useRegisterSubscriptionStepForm } from "#/features/subscriptions/steps/step-validation-context";

type Subscription = (typeof routes)["client.subscriptions.view"]["types"]["response"];

type KycFormProps = {
	subscription: Subscription;
	subscriptionId: string;
};

function isRequiredText(value: string, maxLength = 254) {
	const trimmedValue = value.trim();
	return trimmedValue.length > 0 && trimmedValue.length <= maxLength;
}

function isValidPercentage(value: number | null) {
	return value !== null && value >= 0 && value <= 100;
}

function isValidCountry(value: string | null) {
	return value !== null && /^[A-Z]{2}$/.test(value);
}

function isValidBirthDate(value: string) {
	return /^\d{4}-\d{2}-\d{2}$/.test(value);
}

function isKycProfileComplete(profile: KycProfileValues) {
	return (
		(!profile.regulatedActivity || isRequiredText(profile.regulatedActivityReference)) &&
		(!profile.listedCompany || isRequiredText(profile.listedCompanyReference)) &&
		(!profile.bearerBondsStructure || isValidPercentage(profile.bearerBondsStructurePercentage)) &&
		(profile.countryOfActivity !== "other" || isRequiredText(profile.countryOfActivityReference)) &&
		(profile.countryProvider !== "other" || isRequiredText(profile.countryProviderReference)) &&
		(profile.mainMarkets !== "other" || isRequiredText(profile.mainMarketsReference))
	);
}

function isKycOwnerComplete(owner: KycOwnerValues) {
	const hasShareholderRole = owner.roles.includes(KYC_OWNER_ROLES[3]);

	return (
		owner.roles.length > 0 &&
		isValidPercentage(owner.shareholdingPercentage) &&
		isValidCountry(owner.nationality) &&
		isRequiredText(owner.address.lineOne) &&
		/^\d{5}$/.test(owner.address.zip) &&
		isRequiredText(owner.address.city) &&
		(hasShareholderRole ? owner.function.trim().length <= 254 : isRequiredText(owner.function)) &&
		(owner.kind === KYC_OWNER_KIND.PHYSICAL_PERSON
			? isRequiredText(owner.firstName, 100) &&
				isRequiredText(owner.lastName, 100) &&
				isValidBirthDate(owner.birthDate) &&
				isRequiredText(owner.birthCity, 100)
			: isRequiredText(owner.legalName))
	);
}

function isKycComplete(values: KycValues) {
	return isKycProfileComplete(values.kycProfile) && values.owners.every(isKycOwnerComplete);
}

export function KycForm(props: KycFormProps) {
	const { subscription, subscriptionId } = props;
	const { form, createKycOwner, deleteKycOwner, updateKycOwner, updateKycProfile } = useKycForm({
		subscriptionId,
		profile: subscription.kyc.profile,
		owners: subscription.kyc.owners,
	});
	const isComplete = useCallback(() => isKycComplete(form.state.values), [form]);
	useRegisterSubscriptionStepForm(form, isComplete);

	return (
		<Card render={<form noValidate />} className="p-6 sm:p-8">
			<KycProfileSection form={form} updateKycProfile={updateKycProfile} />
			<BeneficialOwnersSection
				createKycOwner={createKycOwner}
				deleteKycOwner={deleteKycOwner}
				form={form}
				updateKycOwner={updateKycOwner}
			/>
		</Card>
	);
}
