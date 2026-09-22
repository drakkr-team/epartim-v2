import type { routes } from "@workspace/api/registry";
import { Card } from "@workspace/ui-react/components/card";

import { KycProfileSection } from "#/features/subscriptions/kyc/components/kyc-profile-section";
import { useKycProfileForm } from "#/features/subscriptions/kyc/hooks/use-form.ts";
import { useRegisterSubscriptionStepForm } from "#/features/subscriptions/steps/step-validation-context";

type Subscription = (typeof routes)["client.subscriptions.view"]["types"]["response"];

type KycProfileFormProps = {
	subscription: Subscription;
	subscriptionId: string;
};

export function KycProfileForm(props: KycProfileFormProps) {
	const { subscription, subscriptionId } = props;
	const { form, updateKycProfile } = useKycProfileForm({
		subscriptionId,
		profile: subscription.kyc.profile,
	});
	useRegisterSubscriptionStepForm(form);

	return (
		<Card render={<form noValidate />} className="p-6 sm:p-8">
			<KycProfileSection form={form} updateKycProfile={updateKycProfile} />
		</Card>
	);
}
