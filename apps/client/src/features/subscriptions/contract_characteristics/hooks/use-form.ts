import type { routes } from "@workspace/api/registry";

import { useUpdateSubscriptionPlansMutation } from "#/features/subscriptions/contract_characteristics/hooks/use-update-mutation";
import { useAppForm } from "#/libs/form";

type Subscription = (typeof routes)["client.subscriptions.view"]["types"]["response"];
type UpdateSubscriptionPlansRequest = Parameters<
	ReturnType<typeof useUpdateSubscriptionPlansMutation>["mutate"]
>[0];
type ContractCharacteristicsChanges =
	UpdateSubscriptionPlansRequest["body"]["contractCharacteristics"];

export type SubscriptionPlanAdhesionType = 1 | 2 | 3;

type UseContractCharacteristicsFormParams = {
	subscriptionId: string;
	contractCharacteristics: Subscription["contractCharacteristics"];
};

export function useContractCharacteristicsForm(params: UseContractCharacteristicsFormParams) {
	const { subscriptionId, contractCharacteristics } = params;
	const { mutate: update } = useUpdateSubscriptionPlansMutation(subscriptionId);

	function updateContractCharacteristics(
		changes: ContractCharacteristicsChanges,
		onSuccess?: () => void,
	) {
		update(
			{
				params: { subscriptionId },
				body: { contractCharacteristics: changes },
			},
			{ onSuccess },
		);
	}

	const form = useAppForm({
		defaultValues: {
			existingDeviceTransfer: contractCharacteristics.existingDeviceTransfer,
			estimatedTransferAmount: contractCharacteristics.estimatedTransferAmount,
			adhesionTypes: contractCharacteristics.adhesionTypes as SubscriptionPlanAdhesionType[],
		},
		listeners: {
			onBlur: ({ fieldApi }) => {
				if (
					fieldApi.name !== "estimatedTransferAmount" ||
					!fieldApi.state.meta.isDirty ||
					!fieldApi.state.meta.isValid
				) {
					return;
				}

				const amount = fieldApi.state.value as number | null;
				updateContractCharacteristics({ estimatedTransferAmount: amount }, () => {
					if (Object.is(fieldApi.state.value, amount)) {
						fieldApi.setMeta((meta) => ({ ...meta, isDirty: false }));
					}
				});
			},
		},
	});

	return { form, updateContractCharacteristics };
}
