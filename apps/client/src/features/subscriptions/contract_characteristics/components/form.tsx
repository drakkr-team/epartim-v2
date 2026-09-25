import type { routes } from "@workspace/api/registry";
import { Card } from "@workspace/ui-react/components/card";

import { DispositivesSection } from "#/features/subscriptions/contract_characteristics/components/dispositives-section.tsx";
import { useContractCharacteristicsForm } from "#/features/subscriptions/contract_characteristics/hooks/use-form";
import { useRegisterSubscriptionStepForm } from "#/features/subscriptions/steps/step-validation-context";

type Subscription = (typeof routes)["client.subscriptions.view"]["types"]["response"];

type ContractCharacteristicsFormProps = {
	subscription: Subscription;
	subscriptionId: string;
};

export function ContractCharacteristicsForm(props: ContractCharacteristicsFormProps) {
	const { subscription, subscriptionId } = props;
	const { form, updateContractCharacteristics } = useContractCharacteristicsForm({
		subscriptionId,
		contractCharacteristics: subscription.contractCharacteristics,
	});
	useRegisterSubscriptionStepForm(form);

	return (
		<Card render={<form noValidate />} className="p-6 sm:p-8">
			<DispositivesSection
				form={form}
				updateContractCharacteristics={updateContractCharacteristics}
			/>
		</Card>
	);
}
