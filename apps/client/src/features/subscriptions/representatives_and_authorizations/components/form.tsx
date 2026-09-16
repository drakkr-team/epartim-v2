import { useCallback } from "react";
import { useTranslation } from "react-i18next";
import z from "zod";

import { Card } from "@workspace/ui-react/components/card";

import { AuthorizationsSection } from "#/features/subscriptions/representatives_and_authorizations/components/authorizations-section";
import { CorrespondentSection } from "#/features/subscriptions/representatives_and_authorizations/components/correspondent-section";
import { LegalAgentSection } from "#/features/subscriptions/representatives_and_authorizations/components/legal-agent-section";
import { isInternationalPhoneNumber } from "#/features/subscriptions/representatives_and_authorizations/components/phone-number-field";
import { SignerSection } from "#/features/subscriptions/representatives_and_authorizations/components/signer-section";
import {
	CONTACT_KIND,
	type ContactValues,
	type RepresentativesAndAuthorizations,
	type RepresentativesAndAuthorizationsValues,
	useRepresentativesAndAuthorizationsForm,
} from "#/features/subscriptions/representatives_and_authorizations/hooks/use-form";
import { useRegisterSubscriptionStepForm } from "#/features/subscriptions/steps/step-validation-context";

type RepresentativesAndAuthorizationsFormProps = {
	subscriptionId: string;
	representativesAndAuthorizations: RepresentativesAndAuthorizations;
};

const translationNamespace =
	"features.subscriptions.representatives_and_authorizations.components.representatives-and-authorizations-form";

function isRequiredText(value: string) {
	const trimmedValue = value.trim();
	return trimmedValue.length > 0 && trimmedValue.length <= 254;
}

function isValidEmail(value: string) {
	const trimmedValue = value.trim();
	return (
		trimmedValue.length > 0 &&
		trimmedValue.length <= 254 &&
		z.email().safeParse(trimmedValue).success
	);
}

function isCompleteContact(
	contact: ContactValues,
	params: { functionRequired: boolean; phoneRequired: boolean; portalIdIncluded?: boolean },
) {
	const phoneNumber = contact.phoneNumber.trim();
	const hasValidPhoneNumber = phoneNumber.length === 0 || isInternationalPhoneNumber(phoneNumber);
	const hasValidPortalId = !params.portalIdIncluded || contact.amundiPortalId.trim().length <= 254;

	return (
		contact.civility !== null &&
		isRequiredText(contact.firstName) &&
		isRequiredText(contact.lastName) &&
		isValidEmail(contact.email) &&
		(!params.phoneRequired || phoneNumber.length > 0) &&
		hasValidPhoneNumber &&
		(!params.functionRequired || contact.function !== null) &&
		hasValidPortalId
	);
}

function isRepresentativesAndAuthorizationsComplete(
	values: RepresentativesAndAuthorizationsValues,
) {
	const { legalAgent, signer, correspondent, authorizations } = values;
	const hasPhysicalLegalAgent = legalAgent.kind === CONTACT_KIND.PHYSICAL_PERSON;
	const hasLegalEntityAgent = legalAgent.kind === CONTACT_KIND.LEGAL_ENTITY;

	if (!hasPhysicalLegalAgent && !hasLegalEntityAgent) return false;

	if (
		hasPhysicalLegalAgent &&
		!isCompleteContact(legalAgent, { functionRequired: true, phoneRequired: true })
	) {
		return false;
	}

	if (
		hasLegalEntityAgent &&
		(!isRequiredText(legalAgent.legalName) ||
			!isValidEmail(legalAgent.email) ||
			legalAgent.function === null)
	) {
		return false;
	}

	if (signer.isSignatoryOnKbis === null) return false;
	if (
		signer.isSignatoryOnKbis === false &&
		!isCompleteContact(signer, { functionRequired: false, phoneRequired: true })
	) {
		return false;
	}

	if (!hasLegalEntityAgent && correspondent.isDifferent === null) return false;
	if (
		(hasLegalEntityAgent || correspondent.isDifferent) &&
		!isCompleteContact(correspondent, {
			functionRequired: true,
			phoneRequired: true,
			portalIdIncluded: true,
		})
	) {
		return false;
	}

	return authorizations.every(
		(authorization) =>
			authorization.authorizations.length > 0 &&
			isCompleteContact(authorization, {
				functionRequired: true,
				phoneRequired: true,
				portalIdIncluded: true,
			}),
	);
}

export function RepresentativesAndAuthorizationsForm(
	props: RepresentativesAndAuthorizationsFormProps,
) {
	const { subscriptionId, representativesAndAuthorizations } = props;
	const { t } = useTranslation(translationNamespace);
	const { form, updateLegalAgent, updateSigner, updateCorrespondent, updateAuthorizations } =
		useRepresentativesAndAuthorizationsForm({
			subscriptionId,
			representativesAndAuthorizations,
		});
	const isComplete = useCallback(
		() => isRepresentativesAndAuthorizationsComplete(form.state.values),
		[form],
	);
	useRegisterSubscriptionStepForm(form, isComplete);

	return (
		<Card render={<form noValidate />} className="p-6 sm:p-8">
			<section aria-labelledby="representatives-and-authorizations-heading" className="grid gap-6">
				<div className="border-neutral-4 border-b pb-4">
					<p className="font-bold text-primary-9 text-xs uppercase tracking-widest">
						{t("eyebrow")}
					</p>
					<h2
						id="representatives-and-authorizations-heading"
						className="mt-2 font-bold text-secondary-12 text-xl"
					>
						{t("title")}
					</h2>
					<p className="mt-1 text-neutral-11 text-sm">{t("description")}</p>
				</div>

				<LegalAgentSection
					form={form}
					onUpdateLegalAgent={updateLegalAgent}
					onUpdateSigner={updateSigner}
					onUpdateCorrespondent={updateCorrespondent}
				/>
				<SignerSection form={form} onUpdateSigner={updateSigner} />
				<CorrespondentSection form={form} onUpdateCorrespondent={updateCorrespondent} />
				<AuthorizationsSection form={form} onUpdateAuthorizations={updateAuthorizations} />
			</section>
		</Card>
	);
}
