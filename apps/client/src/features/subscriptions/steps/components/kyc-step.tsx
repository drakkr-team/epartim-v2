import { useTranslation } from "react-i18next";

import { SubscriptionStepHeader } from "#/features/subscriptions/steps/components/subscription-step-header";

type KycStepProps = {
	isValidated: boolean;
};

export function KycStep(props: KycStepProps) {
	const { isValidated } = props;
	const { t } = useTranslation("routes.(private).(operations).subscriptions.$id.steps.$step");

	return (
		<main className="mx-auto w-full max-w-7xl pb-12">
			<SubscriptionStepHeader
				description={t("step-two.description")}
				eyebrow={t("step-two.eyebrow")}
				isValidated={isValidated}
				title={t("step-two.title")}
			/>
		</main>
	);
}
