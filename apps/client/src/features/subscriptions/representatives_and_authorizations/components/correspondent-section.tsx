import { useTranslation } from "react-i18next";

import { PersonFields } from "#/features/subscriptions/representatives_and_authorizations/components/person-fields";
import {
	CONTACT_KIND,
	type RepresentativesAndAuthorizationsValues,
	type useRepresentativesAndAuthorizationsForm,
} from "#/features/subscriptions/representatives_and_authorizations/hooks/use-form";

const translationNamespace =
	"features.subscriptions.representatives_and_authorizations.components.representatives-and-authorizations-form";

type CorrespondentSectionProps = {
	form: ReturnType<typeof useRepresentativesAndAuthorizationsForm>["form"];
	onUpdate: ReturnType<
		typeof useRepresentativesAndAuthorizationsForm
	>["updateRepresentativesAndAuthorizations"];
};

export function CorrespondentSection(props: CorrespondentSectionProps) {
	const { form, onUpdate } = props;
	const { t } = useTranslation(translationNamespace);

	return (
		<form.Subscribe selector={(state) => state.values}>
			{(values: RepresentativesAndAuthorizationsValues) => {
				const isLegalEntity = values.legalAgent.kind === CONTACT_KIND.LEGAL_ENTITY;
				const isDifferent = values.correspondent.isDifferent === true;

				if (!isLegalEntity && !isDifferent) return null;

				return (
					<section
						aria-labelledby="correspondent-heading"
						className="border-neutral-4 border-t pt-6"
					>
						<div>
							<h3 id="correspondent-heading" className="font-bold text-base text-secondary-12">
								{t("correspondent.title")}
							</h3>
							<p className="mt-1 text-neutral-11 text-sm">{t("correspondent.description")}</p>
						</div>

						<div className="mt-4 grid gap-4 rounded-md border border-primary-3 bg-primary-2 p-4">
							{isLegalEntity && (
								<p className="text-primary-11 text-sm">{t("correspondent.forcedDifferent")}</p>
							)}
							<PersonFields
								form={form}
								path="correspondent"
								idPrefix="correspondent"
								onSave={(correspondent) => onUpdate({ correspondent })}
								includeFunction
								includePortalId
								phoneRequired
							/>
						</div>
					</section>
				);
			}}
		</form.Subscribe>
	);
}
