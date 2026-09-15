import { useTranslation } from "react-i18next";
import z from "zod";

import { ContactFunctionField } from "#/features/subscriptions/representatives_and_authorizations/components/contact-function-field";
import {
	type ContactChanges,
	ContactIdentityFields,
} from "#/features/subscriptions/representatives_and_authorizations/components/contact-identity-fields";
import type { ContactValues } from "#/features/subscriptions/representatives_and_authorizations/hooks/use-form";
import { withFieldGroup } from "#/libs/form";

const translationNamespace =
	"features.subscriptions.representatives_and_authorizations.components.representatives-and-authorizations-form";

type ContactFieldsProps = {
	idPrefix: string;
	onUpdate: (changes: ContactChanges) => void;
	includeFunction?: boolean;
	includePortalId?: boolean;
	phoneRequired?: boolean;
};

const defaultValues: ContactValues = {
	civility: null,
	firstName: "",
	lastName: "",
	email: "",
	phoneNumber: "",
	function: null,
	amundiPortalId: "",
};

const defaultProps: ContactFieldsProps = {
	idPrefix: "",
	onUpdate: () => {},
};

export const ContactFields = withFieldGroup({
	defaultValues,
	props: defaultProps,
	render: function ContactFields(props) {
		const { group, idPrefix, onUpdate, includeFunction, includePortalId, phoneRequired } = props;
		const { t } = useTranslation(translationNamespace);
		const amundiPortalIdSchema = z.string().trim().max(254, t("validation.max"));

		return (
			<div className="grid gap-4 md:grid-cols-6">
				<ContactIdentityFields
					form={group}
					fields={{
						civility: "civility",
						firstName: "firstName",
						lastName: "lastName",
						email: "email",
						phoneNumber: "phoneNumber",
					}}
					idPrefix={idPrefix}
					onUpdate={onUpdate}
					phoneRequired={phoneRequired}
				/>

				{includeFunction && (
					<ContactFunctionField
						form={group}
						fields={{ function: "function" }}
						id={`${idPrefix}-function`}
						onUpdate={onUpdate}
					/>
				)}

				{includePortalId && (
					<group.AppField
						name="amundiPortalId"
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
					</group.AppField>
				)}
			</div>
		);
	},
});
