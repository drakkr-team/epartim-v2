import { useTranslation } from "react-i18next";
import z from "zod";

import type { Contact } from "@workspace/api/data";
import { Field } from "@workspace/ui-react/components/field";
import { Select } from "@workspace/ui-react/components/select";

import {
	isInternationalPhoneNumber,
	PhoneNumberField,
} from "#/features/subscriptions/representatives_and_authorizations/components/phone-number-field";
import {
	CONTACT_CIVILITIES,
	type ContactCivility,
	type useRepresentativesAndAuthorizationsForm,
} from "#/features/subscriptions/representatives_and_authorizations/hooks/use-form";

const translationNamespace =
	"features.subscriptions.representatives_and_authorizations.components.representatives-and-authorizations-form";

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

type CivilitySelectProps = {
	id: string;
	label: string;
	value: ContactCivility | null;
	onValueChange: (value: ContactCivility) => void;
	onBlur: () => void;
	invalid: boolean;
};

function CivilitySelect(props: CivilitySelectProps) {
	const { id, label, value, onValueChange, onBlur, invalid } = props;
	const { t } = useTranslation(translationNamespace);
	const options = CONTACT_CIVILITIES.map((civility) => ({
		value: civility,
		label: String(t(`civility.${civility}` as never)),
	}));

	return (
		<Field name={id} invalid={invalid} className="flex flex-col gap-2">
			<Field.Label htmlFor={id} required>
				{label}
			</Field.Label>
			<Select
				items={options}
				value={value}
				onValueChange={(civility) => {
					if (civility !== null) {
						onValueChange(civility);
						onBlur();
					}
				}}
			>
				<Select.Input id={id} aria-invalid={invalid} className="w-full">
					<Select.Value placeholder={label} />
				</Select.Input>
				<Select.Dropdown>
					{options.map((option) => (
						<Select.Option key={option.value} value={option.value} label={option.label}>
							{option.label}
						</Select.Option>
					))}
				</Select.Dropdown>
			</Select>
		</Field>
	);
}

export function ContactIdentityFields(props: ContactIdentityFieldsProps) {
	const { form, path, idPrefix, onUpdate, phoneRequired } = props;
	const { t } = useTranslation(translationNamespace);
	const identitySchema = {
		civility: z
			.literal(CONTACT_CIVILITIES, t("validation.required"))
			.nullable()
			.refine((value) => value !== null, t("validation.required")),
		firstName: z.string().trim().min(1, t("validation.required")).max(254, t("validation.max")),
		lastName: z.string().trim().min(1, t("validation.required")).max(254, t("validation.max")),
		email: z
			.string()
			.trim()
			.min(1, t("validation.required"))
			.email(t("validation.email"))
			.max(254, t("validation.max")),
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
			<div className="md:col-span-2">
				<form.AppField
					name={`${path}.civility` as `${ContactPath}.civility`}
					validators={{ onBlur: identitySchema.civility }}
					listeners={{
						onBlur: ({ value: civility, fieldApi }) => {
							if (fieldApi.state.meta.isValid) onUpdate({ civility });
						},
					}}
				>
					{(field) => {
						const invalid = field.state.meta.isTouched && !field.state.meta.isValid;

						return (
							<>
								<CivilitySelect
									id={`${idPrefix}-civility`}
									label={t("field.civility")}
									value={field.state.value}
									onValueChange={field.handleChange}
									onBlur={field.handleBlur}
									invalid={invalid}
								/>
								{invalid &&
									field.state.meta.errors
										.flat()
										.filter((error) => error !== undefined)
										.map((error) => <Field.Error key={error.message}>{error.message}</Field.Error>)}
							</>
						);
					}}
				</form.AppField>
			</div>

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
			</form.AppField>
		</>
	);
}
