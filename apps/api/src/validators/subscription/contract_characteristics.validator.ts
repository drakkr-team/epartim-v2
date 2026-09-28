import vine from "@vinejs/vine";
import { DateTime } from "luxon";

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

const isCalendarDate = vine.createRule((value, _, field) => {
	if (
		typeof value !== "string" ||
		!/^\d{4}-\d{2}-\d{2}$/.test(value) ||
		!DateTime.fromISO(value, { zone: "utc" }).isValid
	) {
		field.report("La date est invalide.", "date", field);
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
	voluntaryPaymentsLimitedToPeriod: vine.boolean().optional(),
	voluntaryPaymentPeriodStartDate: vine.string().trim().use(isCalendarDate()).nullable().optional(),
	voluntaryPaymentPeriodEndDate: vine.string().trim().use(isCalendarDate()).nullable().optional(),
	adhesionTypes: vine
		.array(vine.number().use(isValidAdhesionType()))
		.maxLength(adhesionTypes.size)
		.distinct()
		.optional(),
});

export const UpdateSubscriptionContractCharacteristicsSchema = vine.object({
	contractCharacteristics: ContractCharacteristicsSchema.partial(),
});
