import { useTranslation } from "react-i18next";

import { ContactFields } from "#/features/subscriptions/representatives_and_authorizations/components/contact-fields";
import type { useRepresentativesAndAuthorizationsForm } from "#/features/subscriptions/representatives_and_authorizations/hooks/use-form";

const translationNamespace =
	"features.subscriptions.representatives_and_authorizations.components.representatives-and-authorizations-form";

type SignerSectionProps = {
	form: ReturnType<typeof useRepresentativesAndAuthorizationsForm>["form"];
	onUpdate: ReturnType<
		typeof useRepresentativesAndAuthorizationsForm
	>["updateRepresentativesAndAuthorizations"];
};

export function SignerSection(props: SignerSectionProps) {
	const { form, onUpdate } = props;
	const { t } = useTranslation(translationNamespace);

	return (
		<form.Subscribe selector={(state) => state.values.signer.isSignatoryOnKbis}>
			{(isSignatoryOnKbis) =>
				isSignatoryOnKbis === false && (
					<section aria-labelledby="signer-heading" className="border-neutral-4 border-t pt-6">
						<div>
							<h3 id="signer-heading" className="font-bold text-base text-secondary-12">
								{t("signer.title")}
							</h3>
							<p className="mt-1 text-neutral-11 text-sm">{t("signer.description")}</p>
						</div>

						<div className="mt-4 grid gap-4 rounded-md border border-primary-3 bg-primary-2 p-4">
							<ContactFields
								form={form}
								path="signer"
								idPrefix="signer"
								onUpdate={(signer) => onUpdate({ signer })}
								phoneRequired
							/>
						</div>
					</section>
				)
			}
		</form.Subscribe>
	);
}
