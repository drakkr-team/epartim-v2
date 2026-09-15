import { useTranslation } from "react-i18next";
import z from "zod";

import type { Contact } from "@workspace/api/data";

import { ContactCivilityField } from "#/features/subscriptions/representatives_and_authorizations/components/contact-civility-field";
import type { useRepresentativesAndAuthorizationsForm } from "#/features/subscriptions/representatives_and_authorizations/hooks/use-form";

export type ContactPath = "legalAgent" | "signer" | "correspondent" | `authorizations[${number}]`;

export type ContactChanges = Partial<
	Pick<
		Contact,
		"civility" | "firstName" | "lastName" | "email" | "phoneNumber" | "function" | "amundiPortalId"
	>
>;

type ContactIdentityFieldsProps = {
	form: ReturnType<typeof useRepresentativesAndAuthorizationsForm>["form"];
	path: ContactPath;
	idPrefix: string;
	onUpdate: (changes: ContactChanges) => void;
	phoneRequired?: boolean;
};

export function ContactIdentityFields(props: ContactIdentityFieldsProps) {
	const { form, path, idPrefix, onUpdate, phoneRequired } = props;
	const { t } = useTranslation(
		"features.subscriptions.representatives_and_authorizations.components.representatives-and-authorizations-form",
	);
	const identitySchema = {
		firstName: z.string().trim().min(1, t("validation.required")).max(254, t("validation.max")),
		lastName: z.string().trim().min(1, t("validation.required")).max(254, t("validation.max")),
		email: z
			.string()
			.trim()
			.min(1, t("validation.required"))
			.max(254, t("validation.max"))
			.pipe(z.email(t("validation.email"))),
		phoneNumber: z
			.string()
			.trim()
			.refine((value) => !phoneRequired || value.length > 0, t("validation.required"))
			.refine(
				(value) => value.length === 0 || /^\+[1-9]\d{6,14}$/.test(value),
				t("validation.phoneNumber"),
			),
	};

	return (
		<>
			<ContactCivilityField
				form={form}
				path={path}
				id={`${idPrefix}-civility`}
				onUpdate={onUpdate}
			/>

			<form.AppField
				name={`${path}.firstName` as `${ContactPath}.firstName`}
				validators={{ onBlur: identitySchema.firstName }}
				listeners={{
					onBlur: ({ value: firstName, fieldApi }) => {
						if (firstName.trim().length === 0) {
							onUpdate({ firstName: null });
							return;
						}
						if (fieldApi.state.meta.isValid) onUpdate({ firstName: firstName.trim() });
					},
				}}
			>
				{(field) => (
					<div className="md:col-span-2">
						<field.TextField label={t("field.firstName")} required />
					</div>
				)}
			</form.AppField>
			<form.AppField
				name={`${path}.lastName` as `${ContactPath}.lastName`}
				validators={{ onBlur: identitySchema.lastName }}
				listeners={{
					onBlur: ({ value: lastName, fieldApi }) => {
						if (lastName.trim().length === 0) {
							onUpdate({ lastName: null });
							return;
						}
						if (fieldApi.state.meta.isValid) onUpdate({ lastName: lastName.trim() });
					},
				}}
			>
				{(field) => (
					<div className="md:col-span-2">
						<field.TextField label={t("field.lastName")} required />
					</div>
				)}
			</form.AppField>
			<form.AppField
				name={`${path}.email` as `${ContactPath}.email`}
				validators={{ onBlur: identitySchema.email }}
				listeners={{
					onBlur: ({ value: email, fieldApi }) => {
						if (email.trim().length === 0) {
							onUpdate({ email: null });
							return;
						}
						if (fieldApi.state.meta.isValid) onUpdate({ email: email.trim() });
					},
				}}
			>
				{(field) => (
					<div className="md:col-span-3">
						<field.TextField label={t("field.email")} required inputProps={{ type: "email" }} />
					</div>
				)}
			</form.AppField>
			<form.AppField
				name={`${path}.phoneNumber` as `${ContactPath}.phoneNumber`}
				validators={{ onBlur: identitySchema.phoneNumber }}
				listeners={{
					onBlur: ({ value: phoneNumber, fieldApi }) => {
						if (phoneNumber.trim().length === 0) {
							onUpdate({ phoneNumber: null });
							return;
						}
						if (fieldApi.state.meta.isValid) onUpdate({ phoneNumber: phoneNumber.trim() });
					},
				}}
			>
				{(field) => (
					<div className="md:col-span-3">
						<field.TextField
							label={t("field.phoneNumber")}
							required={phoneRequired}
							inputProps={{ type: "tel", placeholder: "+33612345678" }}
						/>
					</div>
				)}
			</form.AppField>
		</>
	);
}
