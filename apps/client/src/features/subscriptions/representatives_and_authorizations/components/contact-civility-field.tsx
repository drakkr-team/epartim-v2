import { useTranslation } from "react-i18next";
import z from "zod";

import { Field } from "@workspace/ui-react/components/field";
import { Select } from "@workspace/ui-react/components/select";

import type {
	ContactChanges,
	ContactPath,
} from "#/features/subscriptions/representatives_and_authorizations/components/contact-identity-fields";
import {
	CONTACT_CIVILITIES,
	type useRepresentativesAndAuthorizationsForm,
} from "#/features/subscriptions/representatives_and_authorizations/hooks/use-form";

const translationNamespace =
	"features.subscriptions.representatives_and_authorizations.components.representatives-and-authorizations-form";

type ContactCivilityFieldProps = {
	form: ReturnType<typeof useRepresentativesAndAuthorizationsForm>["form"];
	path: ContactPath;
	id: string;
	onUpdate: (changes: ContactChanges) => void;
	className?: string;
};

export function ContactCivilityField(props: ContactCivilityFieldProps) {
	const { form, path, id, onUpdate, className = "md:col-span-2" } = props;
	const { t } = useTranslation(translationNamespace);
	const options = CONTACT_CIVILITIES.map((civility) => ({
		value: civility,
		label: String(t(`civility.${civility}` as never)),
	}));
	const civilitySchema = z
		.literal(CONTACT_CIVILITIES, t("validation.required"))
		.nullable()
		.refine((value) => value !== null, t("validation.required"));

	return (
		<div className={className}>
			<form.AppField
				name={`${path}.civility` as `${ContactPath}.civility`}
				validators={{ onBlur: civilitySchema }}
				listeners={{
					onBlur: ({ value: civility, fieldApi }) => {
						if (fieldApi.state.meta.isValid) onUpdate({ civility });
					},
				}}
			>
				{(field) => {
					const invalid = field.state.meta.isTouched && !field.state.meta.isValid;

					return (
						<Field name={id} invalid={invalid} className="flex flex-col gap-2">
							<Field.Label htmlFor={id} required>
								{t("field.civility")}
							</Field.Label>
							<Select
								items={options}
								value={field.state.value}
								onValueChange={(civility) => {
									if (civility !== null) {
										field.handleChange(civility);
										field.handleBlur();
									}
								}}
							>
								<Select.Input id={id} aria-invalid={invalid} className="w-full">
									<Select.Value placeholder={t("field.civility")} />
								</Select.Input>
								<Select.Dropdown>
									{options.map((option) => (
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
									.map((error) => <Field.Error key={error.message}>{error.message}</Field.Error>)}
						</Field>
					);
				}}
			</form.AppField>
		</div>
	);
}
