import { useState } from "react";
import { useTranslation } from "react-i18next";

import type { routes } from "@workspace/api/registry";

import { AddressAndBankDetailsForm } from "#/features/subscriptions/address_and_bank_details/components/form";
import { SubscriptionSummary } from "#/features/subscriptions/components/subscription-summary";
import { DocumentsChecklist } from "#/features/subscriptions/documents/components/documents-checklist";
import { DocumentsSection } from "#/features/subscriptions/documents/components/documents-section";
import { InpiPrefillDialog } from "#/features/subscriptions/inpi/components/prefill-dialog";
import type { InpiPreview } from "#/features/subscriptions/inpi/types";
import { LegalIdentificationForm } from "#/features/subscriptions/legal_identification/components/form";
import { RepresentativesAndAuthorizationsForm } from "#/features/subscriptions/representatives_and_authorizations/components/form";
import { SubscriptionStepFooter } from "#/features/subscriptions/steps/components/subscription-step-footer";
import { SubscriptionStepHeader } from "#/features/subscriptions/steps/components/subscription-step-header";
import { ValidateStepButton } from "#/features/subscriptions/steps/components/validate-step-button";
import { SubscriptionStepValidationProvider } from "#/features/subscriptions/steps/step-validation-context";

type Subscription = (typeof routes)["client.subscriptions.view"]["types"]["response"];

type CompanyReferencesStepProps = {
	subscription: Subscription;
	subscriptionId: string;
};

export function CompanyReferencesStep(props: CompanyReferencesStepProps) {
	const { subscription, subscriptionId } = props;
	const { t } = useTranslation("routes.(private).(operations).subscriptions.$id.steps.$step");
	const [isValidationAttempted, setIsValidationAttempted] = useState(false);
	const [formVersion, setFormVersion] = useState(0);
	const [preview, setPreview] = useState<InpiPreview | null>(null);
	const areDocumentsComplete = subscription.documents.every(
		(document) => document.status === "attached",
	);
	const isValidated = subscription.completedSteps?.includes(1) ?? false;
	function handleInpiApplied() {
		setFormVersion((version) => version + 1);
		setIsValidationAttempted(false);
		setPreview(null);
	}

	return (
		<SubscriptionStepValidationProvider>
			<main className="mx-auto grid w-full max-w-7xl gap-8 pb-12 lg:grid-cols-[minmax(0,1fr)_20rem]">
				<div className="grid min-w-0 gap-8">
					<SubscriptionStepHeader eyebrow={t("step-one.eyebrow")} title={t("step-one.title")} />
					<div className="lg:hidden">
						<SubscriptionSummary subscription={subscription} />
					</div>

					<LegalIdentificationForm
						key={`identity:${formVersion}`}
						subscriptionId={subscriptionId}
						legalIdentification={subscription.legalIdentification}
						inpiEnabled={subscription.status === 0 || subscription.status === 5}
						onInpiPreview={setPreview}
						onCompanyChange={() => setIsValidationAttempted(false)}
					/>

					<AddressAndBankDetailsForm
						key={`address:${formVersion}`}
						subscriptionId={subscriptionId}
						address={subscription.addressAndBankDetails.address}
						paymentDetail={subscription.addressAndBankDetails.paymentDetail}
					/>

					<RepresentativesAndAuthorizationsForm
						key={`representatives:${formVersion}`}
						subscriptionId={subscriptionId}
						representativesAndAuthorizations={subscription.representativesAndAuthorizations}
					/>

					<DocumentsSection
						documents={subscription.documents}
						showRequiredErrors={isValidationAttempted}
						subscriptionId={subscriptionId}
					/>

					<SubscriptionStepFooter
						currentStep={1}
						nextStep={2}
						stepLabel={t("step-one.short-title")}
						subscriptionId={subscriptionId}
					>
						<ValidateStepButton
							areDocumentsComplete={areDocumentsComplete}
							isValidated={isValidated}
							onValidationAttempt={() => setIsValidationAttempted(true)}
							step={1}
							subscriptionId={subscriptionId}
						/>
					</SubscriptionStepFooter>
				</div>

				<aside className="hidden lg:block">
					<div className="sticky top-8 grid gap-4">
						<SubscriptionSummary subscription={subscription} />
						{subscription.documents.length > 0 && (
							<DocumentsChecklist documents={subscription.documents} />
						)}
					</div>
				</aside>
			</main>
			{preview && (
				<InpiPrefillDialog
					key={preview.id}
					subscriptionId={subscriptionId}
					preview={preview}
					currentSiren={subscription.legalIdentification?.siren ?? null}
					currentName={subscription.legalIdentification?.name ?? null}
					hasArticles={subscription.documents.some(
						(document) => document.type === 4 && document.status === "attached",
					)}
					onApplied={handleInpiApplied}
					onClose={() => setPreview(null)}
				/>
			)}
		</SubscriptionStepValidationProvider>
	);
}
