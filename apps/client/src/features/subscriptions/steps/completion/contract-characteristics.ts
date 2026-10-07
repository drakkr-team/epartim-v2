import z from "zod";

import { SubscriptionAgreement } from "@workspace/api/constants/subscription_agreement";
import {
	SubscriptionMatchingCalculationMethod,
	SubscriptionMatchingDistributionPeriod,
	SubscriptionMatchingLimitKind,
	SubscriptionMatchingPaymentType,
	SubscriptionMatchingRuleType,
} from "@workspace/api/constants/subscription_matching";
import { SubscriptionPlanAdhesionType } from "@workspace/api/constants/subscription_plan_adhesion";

import {
	calendarDate,
	documentCompletion,
	positiveAmount,
	type RequiredDocument,
	type SubscriptionSnapshot,
	summarizeCompletion,
	valid,
} from "#/features/subscriptions/steps/completion/completion";

type Plan = SubscriptionSnapshot["contractCharacteristics"];
type Matching = Plan["matchingRules"]["pei"];
export type ContractCharacteristicsInput = {
	contractCharacteristics: Omit<Plan, "id" | "subscriptionId">;
	contractDocuments: RequiredDocument[];
};
const rate = z.number().positive().max(300);
const years = z.number().int().nonnegative();

function limitFields(rule: Matching["unilateralRule"], max?: number) {
	return [
		valid(z.enum(SubscriptionMatchingLimitKind), rule?.limitKind),
		valid(max === undefined ? positiveAmount : positiveAmount.max(max), rule?.limitAmount),
	];
}

function matchingFields(matching: Matching, device: "pei" | "per", unilateralMaximum: number) {
	const requirements: boolean[] = [];
	const paymentAllowed = (payment: number) =>
		valid(z.enum(SubscriptionMatchingPaymentType), payment) &&
		(device === "per" || payment !== SubscriptionMatchingPaymentType.PAID_LEAVE);
	if (matching.ruleTypes.includes(SubscriptionMatchingRuleType.UNIFORM)) {
		requirements.push(
			matching.uniformRules.length > 0 &&
				matching.uniformRules.every((rule) => paymentAllowed(rule.paymentType)),
		);
		for (const rule of matching.uniformRules)
			requirements.push(valid(rate, rule.rate), ...limitFields(rule));
	}
	if (matching.ruleTypes.includes(SubscriptionMatchingRuleType.SENIORITY)) {
		requirements.push(
			matching.seniorityRules.length > 0 &&
				matching.seniorityRules.every((rule) => paymentAllowed(rule.paymentType)),
		);
		for (const rule of matching.seniorityRules) {
			const periods =
				rule.periods.length > 0
					? rule.periods
					: [{ fromYears: null, toYears: null, rate: null, limitKind: null, limitAmount: null }];
			for (const [index, period] of periods.entries()) {
				const previousEnd = periods[index - 1]?.toYears ?? null;
				const nextFrom = periods[index + 1]?.fromYears ?? null;
				requirements.push(
					valid(years, period.fromYears) &&
						(previousEnd === null || period.fromYears === previousEnd) &&
						(period.toYears === null ||
							(period.fromYears !== null && period.fromYears < period.toYears)),
					...(index < 4
						? [
								valid(years, period.toYears) &&
									(period.fromYears === null ||
										(period.toYears !== null && period.toYears > period.fromYears)) &&
									(nextFrom === null || period.toYears === nextFrom),
							]
						: []),
					valid(rate, period.rate),
					...limitFields(period),
				);
			}
		}
	}
	if (device === "per" && matching.ruleTypes.includes(SubscriptionMatchingRuleType.UNILATERAL))
		requirements.push(...limitFields(matching.unilateralRule, unilateralMaximum));
	if (matching.ruleTypes.length > 0) {
		requirements.push(valid(z.boolean(), matching.specificRule));
		if (matching.specificRule)
			requirements.push(valid(z.string().trim().min(1), matching.specificRuleDetails));
	}
	return requirements;
}

export function contractCharacteristicsCompletion({
	contractCharacteristics: plan,
	contractDocuments,
}: ContractCharacteristicsInput) {
	const requirements = [
		valid(z.boolean(), plan.existingDeviceTransfer),
		valid(z.array(z.enum(SubscriptionPlanAdhesionType)).min(1), plan.adhesionTypes),
		valid(z.number().int().min(0).max(3), plan.minimumSeniorityMonths),
		valid(z.boolean(), plan.voluntaryPaymentsLimitedToPeriod),
		valid(z.enum(SubscriptionMatchingCalculationMethod), plan.matchingCalculationMethod),
		valid(z.enum(SubscriptionMatchingDistributionPeriod), plan.matchingDistributionPeriod),
		...documentCompletion(contractDocuments),
	];
	// Estimated transfer amount and agreement/rule selections are optional in the form.
	if (plan.existingAgreements.some((agreement) => agreement === SubscriptionAgreement.OTHER))
		requirements.push(valid(z.string().trim().min(1), plan.otherAgreementDetails));
	if (plan.voluntaryPaymentsLimitedToPeriod) {
		requirements.push(
			valid(calendarDate, plan.voluntaryPaymentPeriodStartDate),
			valid(calendarDate, plan.voluntaryPaymentPeriodEndDate) &&
				(!plan.voluntaryPaymentPeriodStartDate ||
					(plan.voluntaryPaymentPeriodEndDate !== null &&
						plan.voluntaryPaymentPeriodEndDate >= plan.voluntaryPaymentPeriodStartDate)),
		);
	}
	const unilateralMaximum = plan.existingAgreements.some(
		(agreement) =>
			agreement === SubscriptionAgreement.PARTICIPATION ||
			agreement === SubscriptionAgreement.INCENTIVES,
	)
		? 6000
		: 3000;
	if (plan.adhesionTypes.some((type) => type === SubscriptionPlanAdhesionType.PEI_EPARTIM))
		requirements.push(...matchingFields(plan.matchingRules.pei, "pei", unilateralMaximum));
	if (plan.adhesionTypes.some((type) => type === SubscriptionPlanAdhesionType.PER_COLI_EPARTIM))
		requirements.push(...matchingFields(plan.matchingRules.per, "per", unilateralMaximum));
	return summarizeCompletion(requirements);
}
