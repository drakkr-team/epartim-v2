import { useTranslation } from "react-i18next";

import type { routes } from "@workspace/api/registry";

import { KycProfileForm } from "#/features/subscriptions/kyc/components/kyc-profile-form";
import { SubscriptionStepFooter } from "#/features/subscriptions/steps/components/subscription-step-footer";
import { SubscriptionStepHeader } from "#/features/subscriptions/steps/components/subscription-step-header";
import { ValidateStepButton } from "#/features/subscriptions/steps/components/validate-step-button";
import { SubscriptionStepValidationProvider } from "#/features/subscriptions/steps/step-validation-context";

type Subscription = (typeof routes)["client.subscriptions.view"]["types"]["response"];
type KycStepProps = { subscription: Subscription; subscriptionId: string };

export function KycStep(props: KycStepProps) {
	const { subscription, subscriptionId } = props;
	const { t } = useTranslation("routes.(private).(operations).subscriptions.$id.steps.$step");

	return (
		<SubscriptionStepValidationProvider>
			<main className="mx-auto grid w-full max-w-7xl gap-8 pb-12">
				<SubscriptionStepHeader
					description={t("step-two.description")}
					eyebrow={t("step-two.eyebrow")}
					isValidated={subscription.completedSteps?.includes(2) ?? false}
					title={t("step-two.title")}
				/>
				<KycProfileForm subscription={subscription} subscriptionId={subscriptionId} />
				<SubscriptionStepFooter
					currentStep={2}
					stepLabel={t("step-two.short-title")}
					subscriptionId={subscriptionId}
				>
					<ValidateStepButton
						areDocumentsComplete
						isValidated={subscription.completedSteps?.includes(2) ?? false}
						onValidationAttempt={() => undefined}
						step={2}
						subscriptionId={subscriptionId}
					/>
				</SubscriptionStepFooter>
			</main>
		</SubscriptionStepValidationProvider>
	);
}
