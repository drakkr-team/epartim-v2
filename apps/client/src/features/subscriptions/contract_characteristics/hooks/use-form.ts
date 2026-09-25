import { SubscriptionAgreement } from "@workspace/api/constants/subscription_agreement";
import type { SubscriptionPlanAdhesionType } from "@workspace/api/constants/subscription_plan_adhesion";
import type { routes } from "@workspace/api/registry";

import { useUpdateSubscriptionPlansMutation } from "#/features/subscriptions/contract_characteristics/hooks/use-update-mutation";
import { useAppForm } from "#/libs/form";

type Subscription = (typeof routes)["client.subscriptions.view"]["types"]["response"];
type UpdateSubscriptionPlansRequest = Parameters<
	ReturnType<typeof useUpdateSubscriptionPlansMutation>["mutate"]
>[0];
type ContractCharacteristicsChanges =
	UpdateSubscriptionPlansRequest["body"]["contractCharacteristics"];

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
			existingAgreements: contractCharacteristics.existingAgreements as SubscriptionAgreement[],
			otherAgreementDetails: contractCharacteristics.otherAgreementDetails ?? "",
			minimumSeniorityMonths: contractCharacteristics.minimumSeniorityMonths,
		},
		listeners: {
			onBlur: ({ fieldApi, formApi }) => {
				if (!fieldApi.state.meta.isDirty) return;
				if (!fieldApi.state.meta.isValid && fieldApi.name !== "otherAgreementDetails") return;

				const rawValue = fieldApi.state.value;
				const markFieldAsSaved = () => {
					if (Object.is(fieldApi.state.value, rawValue)) {
						fieldApi.setMeta((meta) => ({ ...meta, isDirty: false }));
					}
				};

				if (fieldApi.name === "existingAgreements") {
					const existingAgreements = rawValue as SubscriptionAgreement[];
					if (!existingAgreements.includes(SubscriptionAgreement.OTHER)) {
						formApi.setFieldValue("otherAgreementDetails", "");
						formApi.setFieldMeta("otherAgreementDetails", (meta) => ({ ...meta, errorMap: {} }));
						updateContractCharacteristics(
							{ existingAgreements, otherAgreementDetails: null },
							markFieldAsSaved,
						);
						return;
					}
					updateContractCharacteristics({ existingAgreements }, markFieldAsSaved);
					return;
				}

				if (fieldApi.name === "otherAgreementDetails") {
					updateContractCharacteristics(
						{ otherAgreementDetails: (rawValue as string).trim() || null },
						markFieldAsSaved,
					);
					return;
				}

				if (fieldApi.name === "minimumSeniorityMonths") {
					updateContractCharacteristics(
						{ minimumSeniorityMonths: rawValue as 0 | 1 | 2 | 3 | null },
						markFieldAsSaved,
					);
					return;
				}

				if (fieldApi.name === "estimatedTransferAmount") {
					const amount = fieldApi.state.value as number | null;
					updateContractCharacteristics({ estimatedTransferAmount: amount }, () => {
						if (Object.is(fieldApi.state.value, amount)) {
							fieldApi.setMeta((meta) => ({ ...meta, isDirty: false }));
						}
					});
					return;
				}

				if (fieldApi.name === "adhesionTypes") {
					const adhesionTypes = fieldApi.state.value as SubscriptionPlanAdhesionType[];
					updateContractCharacteristics({ adhesionTypes }, () => {
						if (Object.is(fieldApi.state.value, adhesionTypes)) {
							fieldApi.setMeta((meta) => ({ ...meta, isDirty: false }));
						}
					});
				}
			},
		},
	});

	return { form, updateContractCharacteristics };
}
