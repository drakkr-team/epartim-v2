import { useTranslation } from "react-i18next";

import { SubscriptionMatchingRuleType } from "@workspace/api/constants/subscription_matching_rules";

import {
	MatchingLimitFields,
	MatchingNumberField,
} from "#/features/subscriptions/contract_characteristics/components/matching-fields";
import { MatchingPaymentField } from "#/features/subscriptions/contract_characteristics/components/matching-payment-field";
import type { MatchingChildProps } from "#/features/subscriptions/contract_characteristics/components/matching-types";

const namespace = "features.subscriptions.contract_characteristics";

export function MatchingUniformRuleSection(props: MatchingChildProps) {
	const { device, form, matching, serverErrors } = props;
	const { t } = useTranslation(namespace);
	return (
		<section className="grid gap-5 rounded-sm border border-neutral-5 p-4 sm:p-5">
			<h3 className="font-bold text-lg text-secondary-12">{t("matching.rule.uniform")}</h3>
			<MatchingPaymentField {...props} ruleType={SubscriptionMatchingRuleType.UNIFORM} />
			{matching.uniformRules.map((rule, index) => {
				const name = `matchingRules.${device}.uniformRules[${index}]` as const;
				return (
					<div key={rule.paymentType} className="grid gap-4 border-neutral-5 border-t pt-5">
						<h4 className="font-semibold text-secondary-12">
							{t(`matching.payment.${rule.paymentType}`)}
						</h4>
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
			})}
		</section>
	);
}
