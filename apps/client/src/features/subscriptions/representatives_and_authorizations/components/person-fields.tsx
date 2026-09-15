import { useTranslation } from "react-i18next";
import z from "zod";

import type { Contact } from "@workspace/api/data";
import { Field } from "@workspace/ui-react/components/field";
import { Select } from "@workspace/ui-react/components/select";

import {
	CONTACT_CIVILITIES,
	CONTACT_FUNCTIONS,
	type ContactCivility,
	type ContactFunction,
	type useRepresentativesAndAuthorizationsForm,
} from "#/features/subscriptions/representatives_and_authorizations/hooks/use-form";

const translationNamespace =
	"features.subscriptions.representatives_and_authorizations.components.representatives-and-authorizations-form";

export type PersonPath = "legalAgent" | "signer" | "correspondent" | `authorizations[${number}]`;

type PersonFieldNames = {
	civility: `${PersonPath}.civility`;
	firstName: `${PersonPath}.firstName`;
	lastName: `${PersonPath}.lastName`;
	email: `${PersonPath}.email`;
	phoneNumber: `${PersonPath}.phoneNumber`;
	function: `${PersonPath}.function`;
	amundiPortalId: `${PersonPath}.amundiPortalId`;
};

type PersonFieldsProps = {
	form: ReturnType<typeof useRepresentativesAndAuthorizationsForm>["form"];
	path: PersonPath;
	idPrefix: string;
	onSave: (changes: PersonChanges) => void;
	includeFunction?: boolean;
	includePortalId?: boolean;
	phoneRequired?: boolean;
};

export type PersonChanges = Partial<
	Pick<
		Contact,
		"civility" | "firstName" | "lastName" | "email" | "phoneNumber" | "function" | "amundiPortalId"
	>
>;

type SelectFieldProps<T extends number> = {
	id: string;
	label: string;
	value: T | null;
	onValueChange: (value: T) => void;
	onBlur: () => void;
	invalid: boolean;
	errors: unknown[];
	required?: boolean;
};

function personFieldNames(path: PersonPath): PersonFieldNames {
	return {
		civility: `${path}.civility` as PersonFieldNames["civility"],
		firstName: `${path}.firstName` as PersonFieldNames["firstName"],
		lastName: `${path}.lastName` as PersonFieldNames["lastName"],
		email: `${path}.email` as PersonFieldNames["email"],
		phoneNumber: `${path}.phoneNumber` as PersonFieldNames["phoneNumber"],
		function: `${path}.function` as PersonFieldNames["function"],
		amundiPortalId: `${path}.amundiPortalId` as PersonFieldNames["amundiPortalId"],
	};
}

export function FieldErrors(props: { errors: unknown[] }) {
	return props.errors
		.flat()
		.map((error) => {
			if (typeof error === "string") return error;
			if (error && typeof error === "object" && "message" in error) {
				return typeof error.message === "string" ? error.message : null;
			}
			return null;
		})
		.filter((message): message is string => message !== null)
		.map((message) => <Field.Error key={message}>{message}</Field.Error>);
}

export function ContactFunctionSelect(props: SelectFieldProps<ContactFunction>) {
	const { id, label, value, onValueChange, onBlur, invalid, errors, required } = props;
	const { t } = useTranslation(translationNamespace);
	const options = CONTACT_FUNCTIONS.map((functionValue) => ({
		value: functionValue,
		label: String(t(`function.${functionValue}` as never)),
	}));

	return (
		<Field name={id} invalid={invalid} className="flex flex-col gap-2">
			<Field.Label htmlFor={id} required={required}>
				{label}
			</Field.Label>
			<Select
				items={options}
				value={value}
				onValueChange={(functionValue) => {
					if (functionValue !== null) onValueChange(functionValue);
				}}
				onOpenChange={(open) => {
					if (!open) onBlur();
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
			{invalid && <FieldErrors errors={errors} />}
		</Field>
	);
}

function CivilitySelect(props: SelectFieldProps<ContactCivility>) {
	const { id, label, value, onValueChange, onBlur, invalid, errors, required } = props;
	const { t } = useTranslation(translationNamespace);
	const options = CONTACT_CIVILITIES.map((civility) => ({
		value: civility,
		label: String(t(`civility.${civility}` as never)),
	}));

	return (
		<Field name={id} invalid={invalid} className="flex flex-col gap-2">
			<Field.Label htmlFor={id} required={required}>
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
			{invalid && <FieldErrors errors={errors} />}
		</Field>
	);
}

export function PersonFields(props: PersonFieldsProps) {
	const { form, path, idPrefix, onSave, includeFunction, includePortalId, phoneRequired } = props;
	const { t } = useTranslation(translationNamespace);
	const fields = personFieldNames(path);
	const personSchema = {
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
				(value) => value.length === 0 || /^\+[1-9]\d{6,14}$/.test(value),
				t("validation.phoneNumber"),
			),
		function: z
			.literal(CONTACT_FUNCTIONS, t("validation.required"))
			.nullable()
			.refine((value) => !includeFunction || value !== null, t("validation.required")),
		amundiPortalId: z.string().trim().max(254, t("validation.max")),
	};

	return (
		<div className="grid gap-4 md:grid-cols-6">
			<div className="md:col-span-2">
				<form.AppField
					name={fields.civility}
					validators={{ onBlur: personSchema.civility }}
					listeners={{
						onBlur: ({ value: civility, fieldApi }) => {
							if (fieldApi.state.meta.isValid) onSave({ civility });
						},
					}}
				>
					{(field) => {
						const invalid = field.state.meta.isTouched && !field.state.meta.isValid;

						return (
							<CivilitySelect
								id={`${idPrefix}-civility`}
								label={t("field.civility")}
								value={field.state.value}
								required
								onValueChange={field.handleChange}
								onBlur={field.handleBlur}
								invalid={invalid}
								errors={field.state.meta.errors}
							/>
						);
					}}
				</form.AppField>
			</div>

			<form.AppField
				name={fields.firstName}
				validators={{ onBlur: personSchema.firstName }}
				listeners={{
					onBlur: ({ value: firstName, fieldApi }) => {
						if (firstName.trim().length === 0) {
							onSave({ firstName: null });
							return;
						}
						if (fieldApi.state.meta.isValid) onSave({ firstName: firstName.trim() });
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
				name={fields.lastName}
				validators={{ onBlur: personSchema.lastName }}
				listeners={{
					onBlur: ({ value: lastName, fieldApi }) => {
						if (lastName.trim().length === 0) {
							onSave({ lastName: null });
							return;
						}
						if (fieldApi.state.meta.isValid) onSave({ lastName: lastName.trim() });
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
				name={fields.email}
				validators={{ onBlur: personSchema.email }}
				listeners={{
					onBlur: ({ value: email, fieldApi }) => {
						if (email.trim().length === 0) {
							onSave({ email: null });
							return;
						}
						if (fieldApi.state.meta.isValid) onSave({ email: email.trim() });
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
				name={fields.phoneNumber}
				validators={{ onBlur: personSchema.phoneNumber }}
				listeners={{
					onBlur: ({ value: phoneNumber, fieldApi }) => {
						if (phoneNumber.trim().length === 0) {
							onSave({ phoneNumber: null });
							return;
						}
						if (fieldApi.state.meta.isValid) onSave({ phoneNumber: phoneNumber.trim() });
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

			{includeFunction && (
				<div className="md:col-span-3">
					<form.AppField
						name={fields.function}
						validators={{ onBlur: personSchema.function }}
						listeners={{
							onBlur: ({ value: functionValue, fieldApi }) => {
								if (fieldApi.state.meta.isValid) onSave({ function: functionValue });
							},
						}}
					>
						{(field) => {
							const invalid = field.state.meta.isTouched && !field.state.meta.isValid;

							return (
								<ContactFunctionSelect
									id={`${idPrefix}-function`}
									label={t("field.function")}
									value={field.state.value}
									required
									onValueChange={field.handleChange}
									onBlur={field.handleBlur}
									invalid={invalid}
									errors={field.state.meta.errors}
								/>
							);
						}}
					</form.AppField>
				</div>
			)}

			{includePortalId && (
				<form.AppField
					name={fields.amundiPortalId}
					validators={{ onBlur: personSchema.amundiPortalId }}
					listeners={{
						onBlur: ({ value: amundiPortalId, fieldApi }) => {
							if (amundiPortalId.trim().length === 0) {
								onSave({ amundiPortalId: null });
								return;
							}
							if (fieldApi.state.meta.isValid) {
								onSave({ amundiPortalId: amundiPortalId.trim() });
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
