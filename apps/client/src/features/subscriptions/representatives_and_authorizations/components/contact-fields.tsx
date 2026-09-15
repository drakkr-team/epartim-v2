import { useTranslation } from "react-i18next";
import z from "zod";

import { ContactFunctionField } from "#/features/subscriptions/representatives_and_authorizations/components/contact-function-field";
import {
	type ContactChanges,
	ContactIdentityFields,
	type ContactPath,
} from "#/features/subscriptions/representatives_and_authorizations/components/contact-identity-fields";
import type { useRepresentativesAndAuthorizationsForm } from "#/features/subscriptions/representatives_and_authorizations/hooks/use-form";

const translationNamespace =
	"features.subscriptions.representatives_and_authorizations.components.representatives-and-authorizations-form";

type ContactFieldsProps = {
	form: ReturnType<typeof useRepresentativesAndAuthorizationsForm>["form"];
	path: ContactPath;
	idPrefix: string;
	onUpdate: (changes: ContactChanges) => void;
	includeFunction?: boolean;
	includePortalId?: boolean;
	phoneRequired?: boolean;
};

export function ContactFields(props: ContactFieldsProps) {
	const { form, path, idPrefix, onUpdate, includeFunction, includePortalId, phoneRequired } = props;
	const { t } = useTranslation(translationNamespace);
	const amundiPortalIdSchema = z.string().trim().max(254, t("validation.max"));

	return (
		<div className="grid gap-4 md:grid-cols-6">
			<ContactIdentityFields
				form={form}
				path={path}
				idPrefix={idPrefix}
				onUpdate={onUpdate}
				phoneRequired={phoneRequired}
			/>

			{includeFunction && (
				<ContactFunctionField
					form={form}
					path={path}
					id={`${idPrefix}-function`}
					onUpdate={onUpdate}
				/>
			)}

			{includePortalId && (
				<form.AppField
					name={`${path}.amundiPortalId` as `${ContactPath}.amundiPortalId`}
					validators={{ onBlur: amundiPortalIdSchema }}
					listeners={{
						onBlur: ({ value: amundiPortalId, fieldApi }) => {
							if (amundiPortalId.trim().length === 0) {
								onUpdate({ amundiPortalId: null });
								return;
							}
							if (fieldApi.state.meta.isValid) {
								onUpdate({ amundiPortalId: amundiPortalId.trim() });
							}
						},
					}}
				>
					{(field) => (
						<div className="md:col-span-3">
							<field.TextField label={t("field.amundiPortalId")} />
						</div>
					)}
				</form.AppField>
			)}
		</div>
	);
}
