import { useTranslation } from "react-i18next";

import { Button } from "@workspace/ui-react/components/button";
import { PlusIcon } from "@workspace/ui-react/icons";

import { AuthorizationCard } from "#/features/subscriptions/representatives_and_authorizations/components/authorization-card";
import type { useRepresentativesAndAuthorizationsForm } from "#/features/subscriptions/representatives_and_authorizations/hooks/use-form";

const translationNamespace =
	"features.subscriptions.representatives_and_authorizations.components.representatives-and-authorizations-form";

type AuthorizationsSectionProps = {
	form: ReturnType<typeof useRepresentativesAndAuthorizationsForm>["form"];
	onUpdateAuthorizations: ReturnType<
		typeof useRepresentativesAndAuthorizationsForm
	>["updateAuthorizations"];
};

export function AuthorizationsSection(props: AuthorizationsSectionProps) {
	const { form, onUpdateAuthorizations } = props;
	const { t } = useTranslation(translationNamespace);

	function addAuthorization() {
		const authorizations = [
			...form.state.values.authorizations,
			{
				civility: null,
				firstName: "",
				lastName: "",
				email: "",
				phoneNumber: "",
				function: null,
				amundiPortalId: "",
				key: crypto.randomUUID(),
				authorizations: [],
			},
		];

		form.setFieldValue("authorizations", authorizations);
		onUpdateAuthorizations(authorizations);
	}

	function removeAuthorization(index: number) {
		const authorizations = form.state.values.authorizations.filter(
			(_, authorizationIndex) => authorizationIndex !== index,
		);

		form.setFieldValue("authorizations", authorizations);
		onUpdateAuthorizations(authorizations);
	}

	return (
		<section aria-labelledby="authorizations-heading" className="border-neutral-4 border-t pt-6">
			<div className="flex flex-wrap items-start justify-between gap-4">
				<div>
					<h3 id="authorizations-heading" className="font-bold text-base text-secondary-12">
						{t("authorizations.title")}
					</h3>
					<p className="mt-1 text-neutral-11 text-sm">{t("authorizations.description")}</p>
				</div>
				<Button type="button" onClick={addAuthorization}>
					<PlusIcon />
					{t("authorizations.add")}
				</Button>
			</div>

			<form.Subscribe selector={(state) => state.values.authorizations}>
				{(authorizations) =>
					authorizations.length === 0 ? (
						<p className="mt-4 text-neutral-11 text-sm">{t("authorizations.empty")}</p>
					) : (
						<div className="mt-4 grid gap-4">
							{authorizations.map((authorization, index) => (
								<AuthorizationCard
									key={authorization.key}
									form={form}
									index={index}
									onRemove={() => removeAuthorization(index)}
								/>
							))}
						</div>
					)
				}
			</form.Subscribe>
		</section>
	);
}
