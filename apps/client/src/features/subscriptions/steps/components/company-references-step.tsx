import { Link } from "@tanstack/react-router";
import { useState } from "react";
import { useTranslation } from "react-i18next";

import type { routes } from "@workspace/api/registry";
import { Button } from "@workspace/ui-react/components/button";

import { AddressAndBankDetailsForm } from "#/features/subscriptions/address_and_bank_details/components/form";
import { DocumentsChecklist } from "#/features/subscriptions/documents/components/documents-checklist";
import { DocumentsSection } from "#/features/subscriptions/documents/components/documents-section";
import { LegalIdentificationForm } from "#/features/subscriptions/legal_identification/components/form";
import { RepresentativesAndAuthorizationsForm } from "#/features/subscriptions/representatives_and_authorizations/components/form";
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

	return (
		<SubscriptionStepValidationProvider>
			<main className="mx-auto grid w-full max-w-7xl gap-8 pb-12 lg:grid-cols-[minmax(0,1fr)_18rem]">
				<div className="grid min-w-0 gap-8">
					<SubscriptionStepHeader
						description={t("step-one.description")}
						eyebrow={t("step-one.eyebrow")}
						title={t("step-one.title")}
					/>

					<LegalIdentificationForm
						subscriptionId={subscriptionId}
						legalIdentification={subscription.legalIdentification}
					/>

					<AddressAndBankDetailsForm
						subscriptionId={subscriptionId}
						address={subscription.addressAndBankDetails.address}
						paymentDetail={subscription.addressAndBankDetails.paymentDetail}
					/>

					<RepresentativesAndAuthorizationsForm
						subscriptionId={subscriptionId}
						representativesAndAuthorizations={subscription.representativesAndAuthorizations}
					/>

					<DocumentsSection
						documents={subscription.documents}
						showRequiredErrors={isValidationAttempted}
						subscriptionId={subscriptionId}
					/>

					<footer className="flex flex-wrap items-center justify-between gap-4 border-neutral-4 border-t pt-6">
						<Button nativeButton={false} variant="ghost" render={<Link to="/subscriptions" />}>
							{t("action.quit")}
						</Button>
						<ValidateStepButton
							nextStep={2}
							onValidationAttempt={() => setIsValidationAttempted(true)}
							step={1}
							subscriptionId={subscriptionId}
						/>
					</footer>
				</div>

				<aside className="hidden lg:block">
					<div className="fixed right-8 bottom-6 z-10 w-72">
						<DocumentsChecklist documents={subscription.documents} />
					</div>
				</aside>
			</main>
		</SubscriptionStepValidationProvider>
	);
}
