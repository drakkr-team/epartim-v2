import { useState } from "react";
import { useTranslation } from "react-i18next";

import type { routes } from "@workspace/api/registry";

import { SubscriptionSummary } from "#/features/subscriptions/components/subscription-summary";
import { ContractCharacteristicsForm } from "#/features/subscriptions/contract_characteristics/components/form";
import { DocumentsChecklist } from "#/features/subscriptions/documents/components/documents-checklist";
import { DocumentsSection } from "#/features/subscriptions/documents/components/documents-section";
import { SubscriptionStepFooter } from "#/features/subscriptions/steps/components/subscription-step-footer";
import { SubscriptionStepHeader } from "#/features/subscriptions/steps/components/subscription-step-header";
import { ValidateStepButton } from "#/features/subscriptions/steps/components/validate-step-button";
import { SubscriptionStepValidationProvider } from "#/features/subscriptions/steps/step-validation-context";

type Subscription = (typeof routes)["client.subscriptions.view"]["types"]["response"];

type ContractCharacteristicsStepProps = {
	subscription: Subscription;
	subscriptionId: string;
};

export function ContractCharacteristicsStep(props: ContractCharacteristicsStepProps) {
	const { subscription, subscriptionId } = props;
	const { t } = useTranslation("routes.(private).(operations).subscriptions.$id.steps.$step");
	const isValidated = subscription.completedSteps?.includes(3) ?? false;
	const { t: tContract } = useTranslation("features.subscriptions.contract_characteristics");
	const [isValidationAttempted, setIsValidationAttempted] = useState(false);
	const areDocumentsComplete = subscription.contractDocuments.every(
		(document) => document.status === "attached",
	);

	return (
		<SubscriptionStepValidationProvider>
			<main className="mx-auto grid w-full max-w-7xl gap-8 pb-12 lg:grid-cols-[minmax(0,1fr)_20rem]">
				<div className="grid min-w-0 gap-8">
					<SubscriptionStepHeader
						description={t("step-three.description")}
						eyebrow={t("step-three.eyebrow")}
						isValidated={isValidated}
						title={t("step-three.title")}
					/>
					<div className="lg:hidden">
						<SubscriptionSummary subscription={subscription} />
					</div>
					<ContractCharacteristicsForm
						subscription={subscription}
						subscriptionId={subscriptionId}
					/>
					{subscription.contractDocuments.length > 0 && (
						<DocumentsSection
							description={tContract("documents.description")}
							documents={subscription.contractDocuments}
							eyebrow={tContract("documents.eyebrow")}
							showRequiredErrors={isValidationAttempted}
							subscriptionId={subscriptionId}
							title={tContract("documents.title")}
						/>
					)}
					<SubscriptionStepFooter
						currentStep={3}
						nextStep={isValidated ? 4 : undefined}
						stepLabel={t("step-three.short-title")}
						subscriptionId={subscriptionId}
					>
						<ValidateStepButton
							areDocumentsComplete={areDocumentsComplete}
							isValidated={isValidated}
							onValidationAttempt={() => setIsValidationAttempted(true)}
							step={3}
							subscriptionId={subscriptionId}
						/>
					</SubscriptionStepFooter>
				</div>

				<aside className="hidden lg:block">
					<div className="sticky top-8 grid gap-4">
						<SubscriptionSummary subscription={subscription} />
						{subscription.contractDocuments.length > 0 && (
							<DocumentsChecklist documents={subscription.contractDocuments} />
						)}
					</div>
				</aside>
			</main>
		</SubscriptionStepValidationProvider>
	);
}
