import { useTranslation } from "react-i18next";
import z from "zod";

import {
	type SubscriptionMatchingRuleType as RuleType,
	SubscriptionMatchingDevice,
	SubscriptionMatchingLimitKind,
	SubscriptionMatchingPaymentType,
	type SubscriptionMatchingPeriod,
	SubscriptionMatchingRuleType,
} from "@workspace/api/constants/subscription_matching_rules";
import { Checkbox } from "@workspace/ui-react/components/checkbox";
import { Field } from "@workspace/ui-react/components/field";

import type { MatchingChildProps } from "#/features/subscriptions/contract_characteristics/components/matching-types";

const namespace = "features.subscriptions.contract_characteristics";
const paymentTypes = [
	SubscriptionMatchingPaymentType.VOLUNTARY,
	SubscriptionMatchingPaymentType.INCENTIVES,
	SubscriptionMatchingPaymentType.PARTICIPATION,
	SubscriptionMatchingPaymentType.PPV,
] as const;

export function emptyMatchingPeriod(): SubscriptionMatchingPeriod {
	return { fromYears: null, toYears: null, rate: null, limitKind: null, limitAmount: null };
}

type MatchingPaymentFieldProps = MatchingChildProps & { ruleType: RuleType };

export function MatchingPaymentField(props: MatchingPaymentFieldProps) {
	const { device, form, matching, ruleType } = props;
	const { t } = useTranslation(namespace);
	const options =
		device === SubscriptionMatchingDevice.PER
			? [...paymentTypes, SubscriptionMatchingPaymentType.PAID_LEAVE]
			: [...paymentTypes];
	const other =
		ruleType === SubscriptionMatchingRuleType.UNIFORM
			? matching.seniorityRules
			: matching.uniformRules;

	const name =
		ruleType === SubscriptionMatchingRuleType.UNIFORM
			? (`matchingRules.${device}.uniformRules` as const)
			: (`matchingRules.${device}.seniorityRules` as const);
	const paymentTypeSchema = z.enum(SubscriptionMatchingPaymentType);
	const limitKindSchema = z.enum(SubscriptionMatchingLimitKind).nullable();
	const periodSchema = z.object({
		fromYears: z.number().nullable(),
		toYears: z.number().nullable(),
		rate: z.number().nullable(),
		limitKind: limitKindSchema,
		limitAmount: z.number().nullable(),
	});
	const uniformRuleSchema = z.object({
		paymentType: paymentTypeSchema,
		rate: z.number().nullable(),
		limitKind: limitKindSchema,
		limitAmount: z.number().nullable(),
	});
	const seniorityRuleSchema = z.object({
		paymentType: paymentTypeSchema,
		periods: z.array(periodSchema),
	});
	const paymentRulesSchema = z
		.union([z.array(uniformRuleSchema), z.array(seniorityRuleSchema)])
		.refine(
			(value) => value.length > 0,
			t(
				ruleType === SubscriptionMatchingRuleType.UNIFORM
					? "matching.validation.uniformPayment"
					: "matching.validation.seniorityPayment",
			),
		);
	return (
		<form.AppField
			name={name}
			validators={{ onBlur: paymentRulesSchema, onSubmit: paymentRulesSchema }}
		>
			{(field) => {
				const selected = field.state.value;
				const error = field.state.meta.errorMap.onBlur ?? field.state.meta.errorMap.onSubmit;
				const invalid =
					(field.state.meta.isTouched || field.state.meta.errorMap.onSubmit !== undefined) &&
					error !== undefined;
				return (
					<Field name={field.name} invalid={invalid} className="grid gap-3">
						<Field.Label required>{t("matching.payments")}</Field.Label>
						<div className="grid gap-3 sm:grid-cols-2">
							{options.map((paymentType) => {
								const checked = selected.some((rule) => rule.paymentType === paymentType);
								const disabled = !checked && other.some((rule) => rule.paymentType === paymentType);
								const id = `${device}-matching-${ruleType}-${paymentType}`;
								return (
									<label
										key={paymentType}
										htmlFor={id}
										className={`flex gap-3 rounded-sm border p-3 ${checked ? "border-secondary-10 bg-secondary-2" : "border-neutral-6 bg-neutral-1"} ${disabled ? "opacity-50" : "cursor-pointer"}`}
									>
										<Checkbox
											id={id}
											checked={checked}
											disabled={disabled}
											className="shrink-0 data-checked:border-secondary-9 data-checked:bg-secondary-9 data-checked:hover:not-data-disabled:border-secondary-10 data-checked:hover:not-data-disabled:bg-secondary-10"
											onCheckedChange={(value) => {
												if (ruleType === SubscriptionMatchingRuleType.UNIFORM) {
													field.handleChange(
														value
															? [
																	...matching.uniformRules,
																	{ paymentType, rate: null, limitKind: null, limitAmount: null },
																]
															: matching.uniformRules.filter(
																	(rule) => rule.paymentType !== paymentType,
																),
													);
												} else {
													field.handleChange(
														value
															? [
																	...matching.seniorityRules,
																	{ paymentType, periods: [emptyMatchingPeriod()] },
																]
															: matching.seniorityRules.filter(
																	(rule) => rule.paymentType !== paymentType,
																),
													);
												}
												field.handleBlur();
											}}
										/>
										<span className="text-secondary-12 text-sm">
											{t(`matching.payment.${paymentType}`)}
										</span>
									</label>
								);
							})}
						</div>
						{invalid &&
							error?.map((issue) => <Field.Error key={issue.message}>{issue.message}</Field.Error>)}
					</Field>
				);
			}}
		</form.AppField>
	);
}
