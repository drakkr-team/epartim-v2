import { useTranslation } from "react-i18next";

import {
	type SubscriptionDeviceMatching,
	SubscriptionMatchingDevice,
	SubscriptionMatchingRuleType,
} from "@workspace/api/constants/subscription_matching_rules";

import { MatchingRuleTypeField } from "#/features/subscriptions/contract_characteristics/components/matching-rule-type-field";
import { MatchingSeniorityRuleSection } from "#/features/subscriptions/contract_characteristics/components/matching-seniority-rule-section";
import { MatchingSpecificRuleSection } from "#/features/subscriptions/contract_characteristics/components/matching-specific-rule-section";
import { MatchingUniformRuleSection } from "#/features/subscriptions/contract_characteristics/components/matching-uniform-rule-section";
import { MatchingUnilateralRuleSection } from "#/features/subscriptions/contract_characteristics/components/matching-unilateral-rule-section";
import type { useContractCharacteristicsForm } from "#/features/subscriptions/contract_characteristics/hooks/use-form";

const namespace = "features.subscriptions.contract_characteristics";

type MatchingSectionProps = {
	device: SubscriptionMatchingDevice;
	form: ReturnType<typeof useContractCharacteristicsForm>["form"];
};

export function MatchingSection({ device, form }: MatchingSectionProps) {
	const { t } = useTranslation(namespace);
	return (
		<form.AppField name={`matchingRules.${device}`}>
			{(field) => {
				const matching = field.state.value;
				const onChange = (next: SubscriptionDeviceMatching, save = false) => {
					field.handleChange(next);
					if (save) field.handleBlur();
				};
				const childProps = {
					device,
					form,
					matching,
					onChange,
				};
				return (
					<section aria-labelledby={`${device}-matching-heading`} className="grid gap-6">
						<div className="border-neutral-4 border-b pb-4">
							<p className="font-bold text-primary-9 text-xs uppercase tracking-widest">
								{t(`matching.${device}.eyebrow`)}
							</p>
							<h2
								id={`${device}-matching-heading`}
								className="mt-2 font-bold text-secondary-12 text-xl"
							>
								{t(`matching.${device}.title`)}
							</h2>
							<p className="mt-1 text-neutral-11 text-sm">{t(`matching.${device}.description`)}</p>
						</div>
						<div className="grid gap-6">
							<MatchingRuleTypeField {...childProps} />
							{matching.ruleTypes.includes(SubscriptionMatchingRuleType.UNIFORM) && (
								<MatchingUniformRuleSection {...childProps} />
							)}
							{matching.ruleTypes.includes(SubscriptionMatchingRuleType.SENIORITY) && (
								<MatchingSeniorityRuleSection {...childProps} />
							)}
							{device === SubscriptionMatchingDevice.PER &&
								matching.ruleTypes.includes(SubscriptionMatchingRuleType.UNILATERAL) && (
									<MatchingUnilateralRuleSection {...childProps} />
								)}
							{matching.ruleTypes.length > 0 && <MatchingSpecificRuleSection {...childProps} />}
						</div>
					</section>
				);
			}}
		</form.AppField>
	);
}
