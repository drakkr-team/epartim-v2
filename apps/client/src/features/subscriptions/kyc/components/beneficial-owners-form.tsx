import type { routes } from "@workspace/api/registry";
import { Card } from "@workspace/ui-react/components/card";

import { BeneficialOwnersSection } from "#/features/subscriptions/kyc/components/beneficial-owners-section";
import { useKycOwnersForm } from "#/features/subscriptions/kyc/hooks/use-kyc-owners-form";
import { useRegisterSubscriptionStepForm } from "#/features/subscriptions/steps/step-validation-context";

type Subscription = (typeof routes)["client.subscriptions.view"]["types"]["response"];

type BeneficialOwnersFormProps = {
	subscription: Subscription;
	subscriptionId: string;
};

export function BeneficialOwnersForm(props: BeneficialOwnersFormProps) {
	const { subscription, subscriptionId } = props;
	const { form, createKycOwner, deleteKycOwner } = useKycOwnersForm({
		subscriptionId,
		owners: subscription.kyc.owners,
	});
	useRegisterSubscriptionStepForm(form);

	return (
		<Card render={<form noValidate />} className="p-6 sm:p-8">
			<BeneficialOwnersSection
				createKycOwner={createKycOwner}
				deleteKycOwner={deleteKycOwner}
				form={form}
			/>
		</Card>
	);
}
