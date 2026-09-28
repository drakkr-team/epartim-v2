import { SubscriptionAgreement } from "@workspace/api/constants/subscription_agreement";
import type {
	SubscriptionMatchingCalculationMethod,
	SubscriptionMatchingDistributionPeriod,
} from "@workspace/api/constants/subscription_matching";
import {
	emptySubscriptionDeviceMatching,
	type SubscriptionDeviceMatching,
	SubscriptionMatchingDevice,
} from "@workspace/api/constants/subscription_matching_rules";
import { SubscriptionPlanAdhesionType } from "@workspace/api/constants/subscription_plan_adhesion";
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
				if (!fieldApi.state.meta.isDirty) return;
				if (
					!fieldApi.state.meta.isValid &&
					fieldApi.name !== "otherAgreementDetails" &&
					fieldApi.name !== "voluntaryPaymentPeriodStartDate" &&
					fieldApi.name !== "voluntaryPaymentPeriodEndDate"
				) {
					return;
				}

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
				const matchingDevice = fieldApi.name.startsWith("matchingRules.pei")
					? SubscriptionMatchingDevice.PEI
					: fieldApi.name.startsWith("matchingRules.per")
						? SubscriptionMatchingDevice.PER
						: null;
				if (matchingDevice) {
					const matching = formApi.state.values.matchingRules[matchingDevice];
					updateMatchingRules(matchingDevice, matching, markFieldAsSaved);
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

				if (fieldApi.name === "matchingCalculationMethod") {
					updateContractCharacteristics(
						{ matchingCalculationMethod: rawValue as SubscriptionMatchingCalculationMethod },
						markFieldAsSaved,
					);
					return;
				}

				if (fieldApi.name === "matchingDistributionPeriod") {
					updateContractCharacteristics(
						{ matchingDistributionPeriod: rawValue as SubscriptionMatchingDistributionPeriod },
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

				if (
					fieldApi.name === "voluntaryPaymentPeriodStartDate" ||
					fieldApi.name === "voluntaryPaymentPeriodEndDate"
				) {
					const fieldName = fieldApi.name;
					const date = rawValue as string | null;
					const startDate =
						fieldName === "voluntaryPaymentPeriodStartDate"
							? date
							: formApi.state.values.voluntaryPaymentPeriodStartDate;
					const endDate =
						fieldName === "voluntaryPaymentPeriodEndDate"
							? date
							: formApi.state.values.voluntaryPaymentPeriodEndDate;
					if (startDate && endDate && endDate < startDate) return;

					updateContractCharacteristics({ [fieldName]: date }, () => {
						if (Object.is(fieldApi.state.value, date)) {
							fieldApi.setMeta((meta) => ({ ...meta, isDirty: false }));
						}
					});
					return;
				}

				if (fieldApi.name === "adhesionTypes") {
					const adhesionTypes = fieldApi.state.value as SubscriptionPlanAdhesionType[];
					if (!adhesionTypes.includes(SubscriptionPlanAdhesionType.PEI_EPARTIM)) {
						formApi.setFieldValue("matchingRules.pei", emptySubscriptionDeviceMatching());
						formApi.setFieldMeta("matchingRules.pei", (meta) => ({ ...meta, errorMap: {} }));
					}
					if (!adhesionTypes.includes(SubscriptionPlanAdhesionType.PER_COLI_EPARTIM)) {
						formApi.setFieldValue("matchingRules.per", emptySubscriptionDeviceMatching());
						formApi.setFieldMeta("matchingRules.per", (meta) => ({ ...meta, errorMap: {} }));
					}
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
