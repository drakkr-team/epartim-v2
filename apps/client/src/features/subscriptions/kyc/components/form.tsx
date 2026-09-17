import { useCallback } from "react";

import type { routes } from "@workspace/api/registry";

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

function isRequiredText(value: string) {
	return value.trim().length > 0;
}

function isKycProfileComplete(profile: KycProfileValues) {
	return (
		(!profile.regulatedActivity || isRequiredText(profile.regulatedActivityReference)) &&
		(!profile.listedCompany || isRequiredText(profile.listedCompanyReference)) &&
		(!profile.bearerBondsStructure ||
			(profile.bearerBondsStructurePercentage !== null &&
				profile.bearerBondsStructurePercentage >= 0 &&
				profile.bearerBondsStructurePercentage <= 100)) &&
		(profile.countryOfActivity !== "other" || isRequiredText(profile.countryOfActivityReference)) &&
		(profile.countryProvider !== "other" || isRequiredText(profile.countryProviderReference)) &&
		(profile.mainMarkets !== "other" || isRequiredText(profile.mainMarketsReference))
	);
}

function isKycOwnerComplete(owner: KycOwnerValues) {
	const hasShareholderRole = owner.roles.includes(KYC_OWNER_ROLES[3]);

	return (
		owner.roles.length > 0 &&
		owner.shareholdingPercentage !== null &&
		owner.shareholdingPercentage >= 0 &&
		owner.shareholdingPercentage <= 100 &&
		owner.nationality !== null &&
		isRequiredText(owner.address.lineOne) &&
		/^\d{5}$/.test(owner.address.zip) &&
		isRequiredText(owner.address.city) &&
		(hasShareholderRole || isRequiredText(owner.function)) &&
		(owner.kind === KYC_OWNER_KIND.PHYSICAL_PERSON
			? isRequiredText(owner.firstName) &&
				isRequiredText(owner.lastName) &&
				isRequiredText(owner.birthDate) &&
				isRequiredText(owner.birthCity)
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
		<form noValidate className="grid gap-8">
			<KycProfileSection form={form} updateKycProfile={updateKycProfile} />
			<BeneficialOwnersSection
				createKycOwner={createKycOwner}
				deleteKycOwner={deleteKycOwner}
				form={form}
				updateKycOwner={updateKycOwner}
			/>
		</form>
	);
}
