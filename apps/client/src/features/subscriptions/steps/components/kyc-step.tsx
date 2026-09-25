import { useState } from "react";
import { useTranslation } from "react-i18next";

import type { routes } from "@workspace/api/registry";

import { SubscriptionSummary } from "#/features/subscriptions/components/subscription-summary";
import { DocumentsChecklist } from "#/features/subscriptions/documents/components/documents-checklist";
import { DocumentsSection } from "#/features/subscriptions/documents/components/documents-section";
import { BeneficialOwnersForm } from "#/features/subscriptions/kyc/components/beneficial-owners-form";
import { KycProfileForm } from "#/features/subscriptions/kyc/components/form.tsx";
import { SubscriptionStepFooter } from "#/features/subscriptions/steps/components/subscription-step-footer";
import { SubscriptionStepHeader } from "#/features/subscriptions/steps/components/subscription-step-header";
import { ValidateStepButton } from "#/features/subscriptions/steps/components/validate-step-button";
import { SubscriptionStepValidationProvider } from "#/features/subscriptions/steps/step-validation-context";

type Subscription = (typeof routes)["client.subscriptions.view"]["types"]["response"];
type KycStepProps = { subscription: Subscription; subscriptionId: string };

export function KycStep(props: KycStepProps) {
	const { subscription, subscriptionId } = props;
	const { t } = useTranslation("routes.(private).(operations).subscriptions.$id.steps.$step");
	const { t: tKyc } = useTranslation("features.subscriptions.kyc");
	const [isValidationAttempted, setIsValidationAttempted] = useState(false);
	const areDocumentsComplete = subscription.kycDocuments.every(
		(document) => document.status === "attached",
	);
	const isValidated = subscription.completedSteps?.includes(2) ?? false;

	return (
		<SubscriptionStepValidationProvider>
			<main className="mx-auto grid w-full max-w-7xl gap-8 pb-12 lg:grid-cols-[minmax(0,1fr)_20rem]">
				<div className="grid min-w-0 gap-8">
					<SubscriptionStepHeader
						description={t("step-two.description")}
						eyebrow={t("step-two.eyebrow")}
						isValidated={isValidated}
						title={t("step-two.title")}
					/>
					<div className="lg:hidden">
						<SubscriptionSummary subscription={subscription} />
					</div>
					<KycProfileForm subscription={subscription} subscriptionId={subscriptionId} />
					<BeneficialOwnersForm subscription={subscription} subscriptionId={subscriptionId} />
					<DocumentsSection
						description={tKyc("documents.description")}
						documents={subscription.kycDocuments}
						eyebrow={tKyc("documents.eyebrow")}
						showRequiredErrors={isValidationAttempted}
						subscriptionId={subscriptionId}
						title={tKyc("documents.title")}
					/>
					<SubscriptionStepFooter
						currentStep={2}
						nextStep={isValidated ? 3 : undefined}
						stepLabel={t("step-two.short-title")}
						subscriptionId={subscriptionId}
					>
						<ValidateStepButton
							areDocumentsComplete={areDocumentsComplete}
							isValidated={isValidated}
							onValidationAttempt={() => setIsValidationAttempted(true)}
							step={2}
							subscriptionId={subscriptionId}
						/>
					</SubscriptionStepFooter>
				</div>

				<aside className="hidden lg:block">
					<div className="sticky top-8 grid gap-4">
						<SubscriptionSummary subscription={subscription} />
						{subscription.kycDocuments.length > 0 && (
							<DocumentsChecklist documents={subscription.kycDocuments} />
						)}
					</div>
				</aside>
			</main>
		</SubscriptionStepValidationProvider>
	);
}
