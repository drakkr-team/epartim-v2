import z from "zod";

import { SubscriptionMatchingDevice } from "@workspace/api/constants/subscription_matching_rules";

const draftRateSchema = z.number().positive().max(300).nullable();
const draftYearsSchema = z.number().int().nonnegative().nullable();
const draftAmountSchema = z
	.number()
	.positive()
	.refine(
		(value) =>
			Number.isSafeInteger(Math.round(value * 100)) &&
			Math.abs(value * 100 - Math.round(value * 100)) <= Number.EPSILON * 100,
	)
	.nullable();
const draftPeriodSchema = z.object({
	fromYears: draftYearsSchema,
	toYears: draftYearsSchema,
	rate: draftRateSchema,
	limitAmount: draftAmountSchema,
});

export function matchingDraftSchema(
	device: SubscriptionMatchingDevice,
	hasBonusAgreement: boolean,
) {
	const maximum = hasBonusAgreement ? 6000 : 3000;
	return z
		.object({
			uniformRules: z.array(z.object({ rate: draftRateSchema, limitAmount: draftAmountSchema })),
			seniorityRules: z.array(z.object({ periods: z.array(draftPeriodSchema) })),
			unilateralRule: z
				.object({
					limitAmount: draftAmountSchema.refine(
						(value) =>
							device !== SubscriptionMatchingDevice.PER || value === null || value <= maximum,
					),
				})
				.nullable(),
		})
		.superRefine((matching, context) => {
			for (const [ruleIndex, rule] of matching.seniorityRules.entries()) {
				for (const [periodIndex, period] of rule.periods.entries()) {
					const path = ["seniorityRules", ruleIndex, "periods", periodIndex] as const;
					if (periodIndex === 4 && period.toYears !== null) {
						context.addIssue({
							code: "custom",
							path: [...path, "toYears"],
						});
					}
					if (
						period.fromYears !== null &&
						period.toYears !== null &&
						period.fromYears >= period.toYears
					) {
						context.addIssue({
							code: "custom",
							path: [...path, "toYears"],
						});
					}
					const previousEnd = rule.periods[periodIndex - 1]?.toYears;
					if (
						periodIndex > 0 &&
						previousEnd !== null &&
						previousEnd !== undefined &&
						period.fromYears !== null &&
						period.fromYears !== previousEnd
					) {
						context.addIssue({
							code: "custom",
							path: [...path, "fromYears"],
						});
					}
				}
			}
		});
}
