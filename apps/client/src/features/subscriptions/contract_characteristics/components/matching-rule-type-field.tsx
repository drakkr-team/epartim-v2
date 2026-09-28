import { useTranslation } from "react-i18next";

import { SubscriptionMatchingRuleType } from "@workspace/api/constants/subscription_matching";
import { Checkbox } from "@workspace/ui-react/components/checkbox";
import { Field } from "@workspace/ui-react/components/field";

import type { MatchingChildProps } from "#/features/subscriptions/contract_characteristics/components/matching-types";

const namespace = "features.subscriptions.contract_characteristics";
const ruleTypeOptions = [
	{ value: SubscriptionMatchingRuleType.UNIFORM, label: "uniform" },
	{ value: SubscriptionMatchingRuleType.SENIORITY, label: "seniority" },
	{ value: SubscriptionMatchingRuleType.UNILATERAL, label: "unilateral" },
] as const;

export function MatchingRuleTypeField(props: MatchingChildProps) {
	const { device, matching, onChange } = props;
	const { t } = useTranslation(namespace);
	const options = device === "per" ? ruleTypeOptions : ruleTypeOptions.slice(0, 2);

	return (
		<Field className="grid gap-3">
			<Field.Label>{t("matching.ruleType")}</Field.Label>
			<div className="grid gap-3 md:grid-cols-3">
				{options.map(({ value: ruleType, label }) => {
					const checked = matching.ruleTypes.includes(ruleType);
					const id = `${device}-matching-${ruleType}`;
					return (
						<label
							key={ruleType}
							htmlFor={id}
							className={`flex cursor-pointer gap-3 rounded-sm border p-4 ${checked ? "border-secondary-10 bg-secondary-2" : "border-neutral-6 bg-neutral-1"}`}
						>
							<Checkbox
								id={id}
								checked={checked}
								className="shrink-0 data-checked:border-secondary-9 data-checked:bg-secondary-9 data-checked:hover:not-data-disabled:border-secondary-10 data-checked:hover:not-data-disabled:bg-secondary-10"
								onCheckedChange={(value) => {
									const selected = Boolean(value);
									const ruleTypes = selected
										? [...matching.ruleTypes, ruleType]
										: matching.ruleTypes.filter((type) => type !== ruleType);
									onChange(
										{
											...matching,
											ruleTypes,
											uniformRules:
												ruleType === SubscriptionMatchingRuleType.UNIFORM && !selected
													? []
													: matching.uniformRules,
											seniorityRules:
												ruleType === SubscriptionMatchingRuleType.SENIORITY && !selected
													? []
													: matching.seniorityRules,
											unilateralRule:
												ruleType === SubscriptionMatchingRuleType.UNILATERAL
													? selected
														? { limitKind: null, limitAmount: null }
														: null
													: matching.unilateralRule,
											specificRule: ruleTypes.length > 0 && matching.specificRule,
											specificRuleDetails:
												ruleTypes.length > 0 ? matching.specificRuleDetails : null,
										},
										true,
									);
								}}
							/>
							<span className="font-semibold text-secondary-12 text-sm">
								{t(`matching.rule.${label}`)}
							</span>
						</label>
					);
				})}
			</div>
			{matching.ruleTypes.length === 0 && (
				<Field.Description>{t("matching.none")}</Field.Description>
			)}
		</Field>
	);
}
