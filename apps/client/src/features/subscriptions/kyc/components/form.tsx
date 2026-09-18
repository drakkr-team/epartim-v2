import type { routes } from "@workspace/api/registry";
import { Card } from "@workspace/ui-react/components/card";

import { BeneficialOwnersSection } from "#/features/subscriptions/kyc/components/beneficial-owners-section";
import { KycProfileSection } from "#/features/subscriptions/kyc/components/kyc-profile-section";
import { useKycForm } from "#/features/subscriptions/kyc/hooks/use-form";
import { useRegisterSubscriptionStepForm } from "#/features/subscriptions/steps/step-validation-context";

type Subscription = (typeof routes)["client.subscriptions.view"]["types"]["response"];

type KycFormProps = {
	subscription: Subscription;
	subscriptionId: string;
};

export function KycForm(props: KycFormProps) {
	const { subscription, subscriptionId } = props;
	const { form, createKycOwner, deleteKycOwner, updateKycOwner, updateKycProfile } = useKycForm({
		subscriptionId,
		profile: subscription.kyc.profile,
		owners: subscription.kyc.owners,
	});
	useRegisterSubscriptionStepForm(form);

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
