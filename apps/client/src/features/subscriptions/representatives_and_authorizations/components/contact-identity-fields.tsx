import { useTranslation } from "react-i18next";
import z from "zod";

import type { Contact } from "@workspace/api/data";

import {
	isInternationalPhoneNumber,
	PhoneNumberField,
} from "#/features/subscriptions/representatives_and_authorizations/components/phone-number-field";
import { ContactCivilityField } from "#/features/subscriptions/representatives_and_authorizations/components/contact-civility-field";
import type { ContactValues } from "#/features/subscriptions/representatives_and_authorizations/hooks/use-form";
import { withFieldGroup } from "#/libs/form";

export type ContactChanges = Partial<
	Pick<
		Contact,
		"civility" | "firstName" | "lastName" | "email" | "phoneNumber" | "function" | "amundiPortalId"
	>
>;

type ContactIdentityFieldsProps = {
	idPrefix: string;
	onUpdate: (changes: ContactChanges) => void;
	phoneRequired?: boolean;
};

type ContactIdentityValues = Pick<
	ContactValues,
	"civility" | "firstName" | "lastName" | "email" | "phoneNumber"
>;

const defaultValues: ContactIdentityValues = {
	civility: null,
	firstName: "",
	lastName: "",
	email: "",
	phoneNumber: "",
};

const defaultProps: ContactIdentityFieldsProps = {
	idPrefix: "",
	onUpdate: () => {},
};

export const ContactIdentityFields = withFieldGroup({
	defaultValues,
	props: defaultProps,
	render: function ContactIdentityFields(props) {
		const { group, idPrefix, onUpdate, phoneRequired } = props;
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
					(value) => value.length === 0 || isInternationalPhoneNumber(value),
					t("validation.phoneNumber"),
				),
		};

		return (
			<>
				<ContactCivilityField
					form={group}
					fields={{ civility: "civility" }}
					id={`${idPrefix}-civility`}
					onUpdate={onUpdate}
				/>

				<group.AppField
					name="firstName"
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
				</group.AppField>
				<group.AppField
					name="lastName"
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
				</group.AppField>
				<group.AppField
					name="email"
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
				</group.AppField>
				<group.AppField
					name="phoneNumber"
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
					{(field) => {
						const invalid = field.state.meta.isTouched && !field.state.meta.isValid;
						const errorMessages = field.state.meta.errors
							.flat()
							.filter((error) => error !== undefined)
							.map((error) => (typeof error === "string" ? error : error.message));

						return (
							<div className="md:col-span-3">
								<PhoneNumberField
									id={`${idPrefix}-phone-number`}
									label={t("field.phoneNumber")}
									countryCallingCodeLabel={t("field.countryCallingCode")}
									value={field.state.value}
									onValueChange={field.handleChange}
									onBlur={field.handleBlur}
									onCountryChange={(phoneNumber) => onUpdate({ phoneNumber })}
									required={phoneRequired}
									invalid={invalid}
									errorMessages={errorMessages}
								/>
							</div>
						);
					}}
				</group.AppField>
			</>
		);
	},
});
