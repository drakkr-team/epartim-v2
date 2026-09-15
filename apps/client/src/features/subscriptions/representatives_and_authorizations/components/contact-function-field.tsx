import { useTranslation } from "react-i18next";
import z from "zod";

import { Field } from "@workspace/ui-react/components/field";
import { Select } from "@workspace/ui-react/components/select";

import type {
	PersonChanges,
	PersonPath,
} from "#/features/subscriptions/representatives_and_authorizations/components/contact-identity-fields";
import {
	CONTACT_FUNCTIONS,
	type useRepresentativesAndAuthorizationsForm,
} from "#/features/subscriptions/representatives_and_authorizations/hooks/use-form";

const translationNamespace =
	"features.subscriptions.representatives_and_authorizations.components.representatives-and-authorizations-form";

type PersonFunctionFieldProps = {
	form: ReturnType<typeof useRepresentativesAndAuthorizationsForm>["form"];
	path: PersonPath;
	id: string;
	onUpdate: (changes: PersonChanges) => void;
	className?: string;
};

export function PersonFunctionField(props: PersonFunctionFieldProps) {
	const { form, path, id, onUpdate, className = "md:col-span-3" } = props;
	const { t } = useTranslation(translationNamespace);
	const options = CONTACT_FUNCTIONS.map((functionValue) => ({
		value: functionValue,
		label: String(t(`function.${functionValue}` as never)),
	}));
	const functionSchema = z
		.literal(CONTACT_FUNCTIONS, t("validation.required"))
		.nullable()
		.refine((value) => value !== null, t("validation.required"));

	return (
		<div className={className}>
			<form.AppField
				name={`${path}.function` as `${PersonPath}.function`}
				validators={{ onBlur: functionSchema }}
				listeners={{
					onBlur: ({ value: functionValue, fieldApi }) => {
						if (fieldApi.state.meta.isValid) onUpdate({ function: functionValue });
					},
				}}
			>
				{(field) => {
					const invalid = field.state.meta.isTouched && !field.state.meta.isValid;

					return (
						<Field name={id} invalid={invalid} className="flex flex-col gap-2">
							<Field.Label htmlFor={id} required>
								{t("field.function")}
							</Field.Label>
							<Select
								items={options}
								value={field.state.value}
								onValueChange={(functionValue) => {
									if (functionValue !== null) field.handleChange(functionValue);
								}}
								onOpenChange={(open) => {
									if (!open) field.handleBlur();
								}}
							>
								<Select.Input id={id} aria-invalid={invalid} className="w-full">
									<Select.Value placeholder={t("field.function")} />
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
