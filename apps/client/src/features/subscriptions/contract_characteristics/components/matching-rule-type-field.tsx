import { useTranslation } from "react-i18next";

import {
	SubscriptionMatchingDevice,
	SubscriptionMatchingRuleType,
} from "@workspace/api/constants/subscription_matching_rules";
import { Checkbox } from "@workspace/ui-react/components/checkbox";
import { Field } from "@workspace/ui-react/components/field";

import type { MatchingChildProps } from "#/features/subscriptions/contract_characteristics/components/matching-types";

const namespace = "features.subscriptions.contract_characteristics";

export function MatchingRuleTypeField(props: MatchingChildProps) {
	const { device, matching, onChange, serverErrors } = props;
	const { t } = useTranslation(namespace);
	const options =
		device === SubscriptionMatchingDevice.PER
			? [
					SubscriptionMatchingRuleType.UNIFORM,
					SubscriptionMatchingRuleType.SENIORITY,
					SubscriptionMatchingRuleType.UNILATERAL,
				]
			: [SubscriptionMatchingRuleType.UNIFORM, SubscriptionMatchingRuleType.SENIORITY];

	return (
		<Field
			invalid={Boolean(serverErrors[`matchingRules.${device}.ruleTypes`])}
			className="grid gap-3"
		>
			<Field.Label>{t("matching.ruleType")}</Field.Label>
			<div className="grid gap-3 md:grid-cols-3">
				{options.map((ruleType) => {
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
								{t(`matching.rule.${ruleType}`)}
							</span>
						</label>
					);
				})}
			</div>
			{matching.ruleTypes.length === 0 && (
				<Field.Description>{t("matching.none")}</Field.Description>
			)}
			{serverErrors[`matchingRules.${device}.ruleTypes`] && (
				<Field.Error>{serverErrors[`matchingRules.${device}.ruleTypes`]}</Field.Error>
			)}
		</Field>
	);
}
