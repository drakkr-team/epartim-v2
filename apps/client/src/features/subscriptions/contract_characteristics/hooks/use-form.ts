import type { SubscriptionAgreement } from "@workspace/api/constants/subscription_agreement";
import type {
	SubscriptionMatchingCalculationMethod,
	SubscriptionMatchingDistributionPeriod,
} from "@workspace/api/constants/subscription_matching";
import {
	type SubscriptionDeviceMatching,
	SubscriptionMatchingDevice,
} from "@workspace/api/constants/subscription_matching_rules";
import type { SubscriptionPlanAdhesionType } from "@workspace/api/constants/subscription_plan_adhesion";
import type { routes } from "@workspace/api/registry";

import { useUpdateContractCharacteristicsMutations } from "#/features/subscriptions/contract_characteristics/hooks/use-update-mutation";
import { useAppForm } from "#/libs/form";

type Subscription = (typeof routes)["client.subscriptions.view"]["types"]["response"];
type UpdateSubscriptionPlanRequest = NonNullable<
	Parameters<
		ReturnType<typeof useUpdateContractCharacteristicsMutations>["updatePlan"]["mutate"]
	>[0]
>;
type UpdateSubscriptionAgreementsRequest = NonNullable<
	Parameters<
		ReturnType<typeof useUpdateContractCharacteristicsMutations>["updateAgreements"]["mutate"]
	>[0]
>;
type UpdateSubscriptionPlanAdhesionsRequest = NonNullable<
	Parameters<
		ReturnType<typeof useUpdateContractCharacteristicsMutations>["updateAdhesions"]["mutate"]
	>[0]
>;
type ContractCharacteristicsChanges =
	| NonNullable<UpdateSubscriptionPlanRequest["body"]>
	| NonNullable<UpdateSubscriptionAgreementsRequest["body"]>
	| NonNullable<UpdateSubscriptionPlanAdhesionsRequest["body"]>;

type UseContractCharacteristicsFormParams = {
	subscriptionId: string;
	contractCharacteristics: Subscription["contractCharacteristics"];
};

export function useContractCharacteristicsForm(params: UseContractCharacteristicsFormParams) {
	const { subscriptionId, contractCharacteristics } = params;
	const { updateAdhesions, updateAgreements, updateMatching, updatePlan } =
		useUpdateContractCharacteristicsMutations(subscriptionId);

	function updateMatchingRules(
		device: SubscriptionMatchingDevice,
		matching: SubscriptionDeviceMatching,
		onSuccess?: () => void,
	) {
		updateMatching.mutate(
			{ params: { subscriptionId }, body: { device, matching } },
			{ onSuccess },
		);
	}

	function updateContractCharacteristics(
		changes: ContractCharacteristicsChanges,
		onSuccess?: () => void,
	) {
		if ("adhesionTypes" in changes) {
			updateAdhesions.mutate(
				{
					params: { subscriptionId },
					body: changes as UpdateSubscriptionPlanAdhesionsRequest["body"],
				},
				{ onSuccess },
			);
			return;
		}
		if ("existingAgreements" in changes || "otherAgreementDetails" in changes) {
			updateAgreements.mutate(
				{
					params: { subscriptionId },
					body: changes as UpdateSubscriptionAgreementsRequest["body"],
				},
				{ onSuccess },
			);
			return;
		}
		updatePlan.mutate(
			{ params: { subscriptionId }, body: changes as UpdateSubscriptionPlanRequest["body"] },
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
			matchingCalculationMethod:
				contractCharacteristics.matchingCalculationMethod as SubscriptionMatchingCalculationMethod,
			matchingDistributionPeriod:
				contractCharacteristics.matchingDistributionPeriod as SubscriptionMatchingDistributionPeriod,
			matchingRules: contractCharacteristics.matchingRules,
			voluntaryPaymentsLimitedToPeriod: contractCharacteristics.voluntaryPaymentsLimitedToPeriod,
			voluntaryPaymentPeriodStartDate: contractCharacteristics.voluntaryPaymentPeriodStartDate,
			voluntaryPaymentPeriodEndDate: contractCharacteristics.voluntaryPaymentPeriodEndDate,
		},
		listeners: {
			onBlur: ({ fieldApi, formApi }) => {
				const { name } = fieldApi;
				if (!fieldApi.state.meta.isDirty) return;
				if (
					!fieldApi.state.meta.isValid &&
					name !== "otherAgreementDetails" &&
					name !== "voluntaryPaymentPeriodStartDate" &&
					name !== "voluntaryPaymentPeriodEndDate"
				) {
					return;
				}

				const rawValue = fieldApi.state.value;
				const markFieldAsSaved = () => {
					if (Object.is(fieldApi.state.value, rawValue)) {
						fieldApi.setMeta((meta) => ({ ...meta, isDirty: false }));
					}
				};

				const matchingDevice = name.startsWith("matchingRules.pei")
					? SubscriptionMatchingDevice.PEI
					: name.startsWith("matchingRules.per")
						? SubscriptionMatchingDevice.PER
						: null;
				if (matchingDevice) {
					const matching = formApi.state.values.matchingRules[matchingDevice];
					updateMatchingRules(matchingDevice, matching, markFieldAsSaved);
					return;
				}

				if (
					name === "voluntaryPaymentPeriodStartDate" ||
					name === "voluntaryPaymentPeriodEndDate"
				) {
					const date = rawValue as string | null;
					const startDate =
						name === "voluntaryPaymentPeriodStartDate"
							? date
							: formApi.state.values.voluntaryPaymentPeriodStartDate;
					const endDate =
						name === "voluntaryPaymentPeriodEndDate"
							? date
							: formApi.state.values.voluntaryPaymentPeriodEndDate;
					if (startDate && endDate && endDate < startDate) return;
				}

				const value = typeof rawValue === "string" ? rawValue.trim() || null : rawValue;
				updateContractCharacteristics(
					{ [name]: value } as ContractCharacteristicsChanges,
					markFieldAsSaved,
				);
			},
		},
	});

	return { form, updateContractCharacteristics };
}
