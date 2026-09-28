import { useTranslation } from "react-i18next";

import {
	type SubscriptionMatchingPaymentType,
	type SubscriptionMatchingPeriod,
	SubscriptionMatchingRuleType,
} from "@workspace/api/constants/subscription_matching_rules";
import { Button } from "@workspace/ui-react/components/button";

import {
	emptyMatchingPeriod,
	MatchingPaymentField,
} from "#/features/subscriptions/contract_characteristics/components/matching-payment-field";
import { MatchingSeniorityPeriod } from "#/features/subscriptions/contract_characteristics/components/matching-seniority-period";
import type { MatchingChildProps } from "#/features/subscriptions/contract_characteristics/components/matching-types";

const namespace = "features.subscriptions.contract_characteristics";

export function MatchingSeniorityRuleSection(props: MatchingChildProps) {
	const { device, form, matching, onChange, serverErrors } = props;
	const { t } = useTranslation(namespace);
	const updatePeriods = (
		paymentType: SubscriptionMatchingPaymentType,
		periods: SubscriptionMatchingPeriod[],
		save = false,
	) =>
		onChange(
			{
				...matching,
				seniorityRules: matching.seniorityRules.map((rule) =>
					rule.paymentType === paymentType ? { ...rule, periods } : rule,
				),
			},
			save,
		);

	return (
		<section className="grid gap-5 rounded-sm border border-neutral-5 p-4 sm:p-5">
			<h3 className="font-bold text-lg text-secondary-12">{t("matching.rule.seniority")}</h3>
			<MatchingPaymentField {...props} ruleType={SubscriptionMatchingRuleType.SENIORITY} />
			{matching.seniorityRules.map((rule, ruleIndex) => (
				<div key={rule.paymentType} className="grid gap-4 border-neutral-5 border-t pt-5">
					<h4 className="font-semibold text-secondary-12">
						{t(`matching.payment.${rule.paymentType}`)}
					</h4>
					{rule.periods.map((period, index) => (
						<MatchingSeniorityPeriod
							// biome-ignore lint/suspicious/noArrayIndexKey: Periods can only be added or removed at the end.
							key={index}
							form={form}
							name={`matchingRules.${device}.seniorityRules[${ruleIndex}].periods[${index}]`}
							index={index}
							count={rule.periods.length}
							period={period}
							previousEnd={rule.periods[index - 1]?.toYears ?? null}
							nextFrom={rule.periods[index + 1]?.fromYears ?? null}
							serverErrors={serverErrors}
							onRemove={() => updatePeriods(rule.paymentType, rule.periods.slice(0, -1), true)}
						/>
					))}
					{rule.periods.length < 5 && (
						<Button
							type="button"
							variant="secondary"
							className="justify-self-start"
							onClick={() =>
								updatePeriods(rule.paymentType, [...rule.periods, emptyMatchingPeriod()], true)
							}
						>
							{t("matching.addPeriod")}
						</Button>
					)}
				</div>
			))}
		</section>
	);
}
