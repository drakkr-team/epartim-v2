import { useTranslation } from "react-i18next";
import z from "zod";

import type { SubscriptionMatchingPeriod } from "@workspace/api/constants/subscription_matching_rules";
import { Button } from "@workspace/ui-react/components/button";

import {
	type MatchingForm,
	MatchingLimitFields,
	MatchingNumberField,
} from "#/features/subscriptions/contract_characteristics/components/matching-fields";

const namespace = "features.subscriptions.contract_characteristics";

type MatchingSeniorityPeriodProps = {
	form: MatchingForm;
	name: `matchingRules.${"pei" | "per"}.seniorityRules[${number}].periods[${number}]`;
	index: number;
	count: number;
	period: SubscriptionMatchingPeriod;
	previousEnd: number | null;
	nextFrom: number | null;
	serverErrors: Record<string, string>;
	onRemove: () => void;
};

export function MatchingSeniorityPeriod(props: MatchingSeniorityPeriodProps) {
	const { form, name, index, count, period, previousEnd, nextFrom, onRemove, serverErrors } = props;
	const { t } = useTranslation(namespace);
	const yearsSchema = z
		.number({ error: t("matching.validation.requiredNumber") })
		.int(t("matching.validation.wholeYears"))
		.nonnegative(t("matching.validation.wholeYears"));
	const fromYearsSchema = yearsSchema
		.refine(
			(value) => index === 0 || previousEnd === null || value === previousEnd,
			t("matching.validation.periodContinuity"),
		)
		.refine(
			(value) => period.toYears === null || value < period.toYears,
			t("matching.validation.periodRange"),
		);
	const toYearsSchema = yearsSchema
		.refine(
			(value) => period.fromYears === null || value > period.fromYears,
			t("matching.validation.periodRange"),
		)
		.refine(
			(value) => nextFrom === null || value === nextFrom,
			t("matching.validation.periodContinuity"),
		);
	return (
		<div className="grid gap-4 rounded-sm bg-neutral-2 p-4">
			<div className="flex items-center justify-between gap-3">
				<h5 className="font-semibold text-secondary-12 text-sm">
					{t("matching.period", { count: index + 1 })}
				</h5>
				{count > 1 && index === count - 1 && (
					<Button type="button" variant="ghost" size="md" onClick={onRemove}>
						{t("matching.removePeriod")}
					</Button>
				)}
			</div>
			<div className="grid gap-4 sm:grid-cols-2">
				<MatchingNumberField
					form={form}
					name={`${name}.fromYears`}
					label={index === 4 ? t("matching.greaterThan") : t("matching.fromYears")}
					unit="years"
					schema={fromYearsSchema}
					serverError={serverErrors[`${name}.fromYears`]}
				/>
				{index < 4 && (
					<MatchingNumberField
						form={form}
						name={`${name}.toYears`}
						label={t("matching.toYears")}
						unit="years"
						schema={toYearsSchema}
						serverError={serverErrors[`${name}.toYears`]}
					/>
				)}
			</div>
			<MatchingNumberField
				form={form}
				name={`${name}.rate`}
				label={t("matching.rate")}
				unit="percent"
				serverError={serverErrors[`${name}.rate`]}
			/>
			<MatchingLimitFields form={form} name={name} serverErrors={serverErrors} />
		</div>
	);
}
