import type { routes } from "@workspace/api/registry";
import { Card } from "@workspace/ui-react/components/card";

import { EntryFeesSection } from "#/features/subscriptions/contract_fees/components/entry-fees-section";
import { PricingTermsSection } from "#/features/subscriptions/contract_fees/components/pricing-terms-section";
import { useContractFeesForm } from "#/features/subscriptions/contract_fees/hooks/use-form";
import { useRegisterSubscriptionStepForm } from "#/features/subscriptions/steps/step-validation-context";

type Subscription = (typeof routes)["client.subscriptions.view"]["types"]["response"];

type ContractFeesFormProps = {
	subscription: Subscription;
	subscriptionId: string;
};

export function ContractFeesForm({ subscription, subscriptionId }: ContractFeesFormProps) {
	const { form } = useContractFeesForm({ subscriptionId, contractFees: subscription.contractFees });
	useRegisterSubscriptionStepForm(form);

	return (
		<form noValidate className="grid gap-8">
			<Card className="p-6 sm:p-8">
				<PricingTermsSection form={form} contractFees={subscription.contractFees} />
			</Card>
			<Card className="p-6 sm:p-8">
				<EntryFeesSection form={form} />
			</Card>
		</form>
	);
}
