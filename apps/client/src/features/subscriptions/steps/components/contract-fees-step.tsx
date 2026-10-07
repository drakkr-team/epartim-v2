import { useTranslation } from "react-i18next";

import type { routes } from "@workspace/api/registry";

import { SubscriptionSummary } from "#/features/subscriptions/components/subscription-summary";
import { ContractFeesForm } from "#/features/subscriptions/contract_fees/components/form";
import { SubscriptionStepFooter } from "#/features/subscriptions/steps/components/subscription-step-footer";
import { SubscriptionStepHeader } from "#/features/subscriptions/steps/components/subscription-step-header";
import { ValidateStepButton } from "#/features/subscriptions/steps/components/validate-step-button";
import { SubscriptionStepValidationProvider } from "#/features/subscriptions/steps/step-validation-context";

type Subscription = (typeof routes)["client.subscriptions.view"]["types"]["response"];
type ContractFeesStepProps = { subscription: Subscription; subscriptionId: string };

export function ContractFeesStep({ subscription, subscriptionId }: ContractFeesStepProps) {
	const { t } = useTranslation("routes.(private).(operations).subscriptions.$id.steps.$step");
	const isValidated = subscription.completedSteps?.includes(4) ?? false;

	return (
		<SubscriptionStepValidationProvider>
			<main className="mx-auto grid w-full max-w-7xl gap-8 pb-12 lg:grid-cols-[minmax(0,1fr)_20rem]">
				<div className="grid min-w-0 gap-8">
					<SubscriptionStepHeader
						description={t("step-four.description")}
						eyebrow={t("step-four.eyebrow")}
						title={t("step-four.title")}
					/>
					<div className="lg:hidden">
						<SubscriptionSummary subscription={subscription} />
					</div>
					<ContractFeesForm subscription={subscription} subscriptionId={subscriptionId} />
					<SubscriptionStepFooter
						currentStep={4}
						nextStep={5}
						stepLabel={t("step-four.short-title")}
						subscriptionId={subscriptionId}
					>
						<ValidateStepButton
							areDocumentsComplete
							isValidated={isValidated}
							step={4}
							subscriptionId={subscriptionId}
						/>
					</SubscriptionStepFooter>
				</div>
				<aside className="hidden lg:block">
					<div className="sticky top-8 grid gap-4">
						<SubscriptionSummary subscription={subscription} />
					</div>
				</aside>
			</main>
		</SubscriptionStepValidationProvider>
	);
}
