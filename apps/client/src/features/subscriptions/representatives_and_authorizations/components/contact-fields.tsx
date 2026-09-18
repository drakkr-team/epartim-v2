import { useTranslation } from "react-i18next";
import z from "zod";

import type { Contact } from "@workspace/api/data";
import { Field } from "@workspace/ui-react/components/field";
import { Select } from "@workspace/ui-react/components/select";

import { ContactFunctionField } from "#/features/subscriptions/representatives_and_authorizations/components/contact-function-field";
import {
	isInternationalPhoneNumber,
	PhoneNumberField,
} from "#/features/subscriptions/representatives_and_authorizations/components/phone-number-field";
import {
	CONTACT_CIVILITIES,
	type ContactValues,
} from "#/features/subscriptions/representatives_and_authorizations/hooks/use-form";
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

export type ContactChanges = Partial<
	Pick<
		Contact,
		"civility" | "firstName" | "lastName" | "email" | "phoneNumber" | "function" | "amundiPortalId"
	>
>;

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
		const civilityOptions = CONTACT_CIVILITIES.map((civility) => ({
			value: civility,
			label: String(t(`civility.${civility}` as never)),
		}));
		const civilitySchema = z
			.literal(CONTACT_CIVILITIES, t("validation.required"))
			.nullable()
			.refine((value) => value !== null, t("validation.required"));
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
		const amundiPortalIdSchema = z.string().trim().max(254, t("validation.max"));

		return (
			<div className="grid gap-4 md:grid-cols-6">
				<group.AppField
					name="civility"
					validators={{ onMount: civilitySchema, onBlur: civilitySchema }}
					listeners={{
						onBlur: ({ value: civility, fieldApi }) => {
							if (fieldApi.state.meta.isValid) onUpdate({ civility });
						},
					}}
				>
					{(field) => {
						const invalid = field.state.meta.isTouched && !field.state.meta.isValid;

						return (
							<div className="md:col-span-2">
								<Field
									name={`${idPrefix}-civility`}
									invalid={invalid}
									className="flex flex-col gap-2"
								>
									<Field.Label htmlFor={`${idPrefix}-civility`} required>
										{t("field.civility")}
									</Field.Label>
									<Select
										items={civilityOptions}
										value={field.state.value}
										onValueChange={(civility) => {
											if (civility !== null) {
												field.handleChange(civility);
												field.handleBlur();
											}
										}}
									>
										<Select.Input
											id={`${idPrefix}-civility`}
											aria-invalid={invalid}
											className="w-full"
										>
											<Select.Value placeholder={t("field.civility")} />
										</Select.Input>
										<Select.Dropdown>
											{civilityOptions.map((option) => (
												<Select.Option key={option.value} value={option.value} label={option.label}>
													{option.label}
												</Select.Option>
											))}
										</Select.Dropdown>
									</Select>
									{invalid &&
										field.state.meta.errors
											.flat()
											.filter((error) => error !== undefined)
											.map((error) => (
												<Field.Error key={error.message}>{error.message}</Field.Error>
											))}
								</Field>
							</div>
						);
					}}
				</group.AppField>

				<group.AppField
					name="firstName"
					validators={{ onMount: identitySchema.firstName, onBlur: identitySchema.firstName }}
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
					validators={{ onMount: identitySchema.lastName, onBlur: identitySchema.lastName }}
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
					validators={{ onMount: identitySchema.email, onBlur: identitySchema.email }}
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
					validators={{ onMount: identitySchema.phoneNumber, onBlur: identitySchema.phoneNumber }}
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
						validators={{ onMount: amundiPortalIdSchema, onBlur: amundiPortalIdSchema }}
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
