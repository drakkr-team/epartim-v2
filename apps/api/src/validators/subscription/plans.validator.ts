import vine from "@vinejs/vine";

import { SubscriptionPlanAdhesionType } from "#models/subscription_plan_adhesion";

const adhesionTypes = new Set(Object.values(SubscriptionPlanAdhesionType));

const hasAtMostTwoDecimalPlaces = vine.createRule((value, _, field) => {
	if (typeof value !== "number") return;

	const cents = value * 100;
	if (
		!Number.isSafeInteger(Math.round(cents)) ||
		Math.abs(cents - Math.round(cents)) > Number.EPSILON * 100
	) {
		field.report("Le montant doit comporter au plus deux décimales.", "decimalPrecision", field);
	}
});

const isValidAdhesionType = vine.createRule((value, _, field) => {
	if (typeof value !== "number" || !adhesionTypes.has(value as SubscriptionPlanAdhesionType)) {
		field.report("Le type d’adhésion est invalide.", "adhesionType", field);
	}
});

const ContractCharacteristicsSchema = vine.object({
	existingDeviceTransfer: vine.boolean().optional(),
	estimatedTransferAmount: vine
		.number()
		.min(0.01)
		.max(Number.MAX_SAFE_INTEGER / 100)
		.use(hasAtMostTwoDecimalPlaces())
		.nullable()
		.optional(),
	adhesionTypes: vine
		.array(vine.number().use(isValidAdhesionType()))
		.maxLength(adhesionTypes.size)
		.distinct()
		.optional(),
});

export const UpdateSubscriptionPlansSchema = vine.object({
	contractCharacteristics: ContractCharacteristicsSchema.partial(),
});
