import vine from "@vinejs/vine";

import { MinimumSeniorityMonths, SubscriptionAgreement } from "#constants/subscription_agreement";
import {
	SubscriptionPlanAdhesionType,
	type SubscriptionPlanAdhesionType as SubscriptionPlanAdhesionTypeValue,
} from "#constants/subscription_plan_adhesion";

const adhesionTypes = new Set(Object.values(SubscriptionPlanAdhesionType));

const isValidAdhesionType = vine.createRule((value, _, field) => {
	if (typeof value !== "number" || !adhesionTypes.has(value as SubscriptionPlanAdhesionTypeValue)) {
		field.report("Le type d’adhésion est invalide.", "adhesionType", field);
	}
});

const ContractCharacteristicsSchema = vine.object({
	existingAgreements: vine.array(vine.enum(SubscriptionAgreement)).distinct().optional(),
	otherAgreementDetails: vine.string().trim().nullable().optional(),
	minimumSeniorityMonths: vine.enum(MinimumSeniorityMonths).nullable().optional(),
	existingDeviceTransfer: vine.boolean().optional(),
	estimatedTransferAmount: vine
		.number()
		.positive()
		.decimal([0, 2])
		.max(Number.MAX_SAFE_INTEGER / 100)
		.nullable()
		.optional(),
	adhesionTypes: vine
		.array(vine.number().use(isValidAdhesionType()))
		.maxLength(adhesionTypes.size)
		.distinct()
		.optional(),
});

export const UpdateSubscriptionContractCharacteristicsSchema = vine.object({
	contractCharacteristics: ContractCharacteristicsSchema.partial(),
});
