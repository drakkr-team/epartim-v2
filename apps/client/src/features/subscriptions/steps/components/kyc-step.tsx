import { useTranslation } from "react-i18next";

import { SubscriptionStepHeader } from "#/features/subscriptions/steps/components/subscription-step-header";

export function KycStep() {
	const { t } = useTranslation("routes.(private).(operations).subscriptions.$id.steps.$step");

	return (
		<main className="mx-auto w-full max-w-7xl pb-12">
			<SubscriptionStepHeader
				description={t("step-two.description")}
				eyebrow={t("step-two.eyebrow")}
				title={t("step-two.title")}
			/>
		</main>
	);
}
