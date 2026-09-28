import vine from "@vinejs/vine";
import { DateTime } from "luxon";

import { MinimumSeniorityMonths } from "#constants/subscription_agreement";
import {
	SubscriptionMatchingCalculationMethod,
	SubscriptionMatchingDistributionPeriod,
} from "#constants/subscription_matching";

const isCalendarDate = vine.createRule((value, _, field) => {
	if (
		typeof value !== "string" ||
		!/^\d{4}-\d{2}-\d{2}$/.test(value) ||
		!DateTime.fromISO(value, { zone: "utc" }).isValid
	) {
		field.report("La date est invalide.", "date", field);
	}
});

export const UpdateSubscriptionPlanSchema = vine
	.object({
		minimumSeniorityMonths: vine.enum(MinimumSeniorityMonths).nullable().optional(),
		matchingCalculationMethod: vine.enum(SubscriptionMatchingCalculationMethod).optional(),
		matchingDistributionPeriod: vine.enum(SubscriptionMatchingDistributionPeriod).optional(),
		existingDeviceTransfer: vine.boolean().optional(),
		estimatedTransferAmount: vine
			.number()
			.positive()
			.decimal([0, 2])
			.max(Number.MAX_SAFE_INTEGER / 100)
			.nullable()
			.optional(),
		voluntaryPaymentsLimitedToPeriod: vine.boolean().optional(),
		voluntaryPaymentPeriodStartDate: vine
			.string()
			.trim()
			.use(isCalendarDate())
			.nullable()
			.optional(),
		voluntaryPaymentPeriodEndDate: vine.string().trim().use(isCalendarDate()).nullable().optional(),
	})
	.partial();
