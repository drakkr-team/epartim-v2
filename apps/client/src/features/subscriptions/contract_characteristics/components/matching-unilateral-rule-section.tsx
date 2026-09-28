import { useTranslation } from "react-i18next";

import { SubscriptionAgreement } from "@workspace/api/constants/subscription_agreement";

import { MatchingLimitFields } from "#/features/subscriptions/contract_characteristics/components/matching-fields";
import type { MatchingChildProps } from "#/features/subscriptions/contract_characteristics/components/matching-types";

const namespace = "features.subscriptions.contract_characteristics";

export function MatchingUnilateralRuleSection(props: MatchingChildProps) {
	const { device, form } = props;
	const { t } = useTranslation(namespace);
	return (
		<section className="grid gap-4 rounded-sm border border-neutral-5 p-4 sm:p-5">
			<h3 className="font-bold text-lg text-secondary-12">{t("matching.rule.unilateral")}</h3>
			<form.Subscribe selector={(state) => state.values.existingAgreements}>
				{(agreements) => (
					<MatchingLimitFields
						form={form}
						name={`matchingRules.${device}.unilateralRule`}
						max={
							agreements.includes(SubscriptionAgreement.PARTICIPATION) ||
							agreements.includes(SubscriptionAgreement.INCENTIVES)
								? 6000
								: 3000
						}
					/>
				)}
			</form.Subscribe>
		</section>
	);
}
