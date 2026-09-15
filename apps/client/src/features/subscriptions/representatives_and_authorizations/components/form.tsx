import { useTranslation } from "react-i18next";

import { Card } from "@workspace/ui-react/components/card";

import { AuthorizationsSection } from "#/features/subscriptions/representatives_and_authorizations/components/authorizations-section";
import { CorrespondentSection } from "#/features/subscriptions/representatives_and_authorizations/components/correspondent-section";
import { LegalAgentSection } from "#/features/subscriptions/representatives_and_authorizations/components/legal-agent-section";
import { SignerSection } from "#/features/subscriptions/representatives_and_authorizations/components/signer-section";
import {
	type RepresentativesAndAuthorizations,
	useRepresentativesAndAuthorizationsForm,
} from "#/features/subscriptions/representatives_and_authorizations/hooks/use-form";

type RepresentativesAndAuthorizationsFormProps = {
	subscriptionId: string;
	representativesAndAuthorizations: RepresentativesAndAuthorizations;
};

const translationNamespace =
	"features.subscriptions.representatives_and_authorizations.components.representatives-and-authorizations-form";

export function RepresentativesAndAuthorizationsForm(
	props: RepresentativesAndAuthorizationsFormProps,
) {
	const { subscriptionId, representativesAndAuthorizations } = props;
	const { t } = useTranslation(translationNamespace);
	const { form, updateRepresentativesAndAuthorizations } = useRepresentativesAndAuthorizationsForm({
		subscriptionId,
		representativesAndAuthorizations,
	});

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

				<LegalAgentSection form={form} onUpdate={updateRepresentativesAndAuthorizations} />
				<SignerSection form={form} onUpdate={updateRepresentativesAndAuthorizations} />
				<CorrespondentSection form={form} onUpdate={updateRepresentativesAndAuthorizations} />
				<AuthorizationsSection form={form} onUpdate={updateRepresentativesAndAuthorizations} />
			</section>
		</Card>
	);
}
