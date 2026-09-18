import { useTranslation } from "react-i18next";
import z from "zod";

import { Field } from "@workspace/ui-react/components/field";
import { Select } from "@workspace/ui-react/components/select";

import {
	CONTACT_FUNCTIONS,
	type ContactValues,
} from "#/features/subscriptions/representatives_and_authorizations/hooks/use-form";
import { withFieldGroup } from "#/libs/form";

const translationNamespace =
	"features.subscriptions.representatives_and_authorizations.components.representatives-and-authorizations-form";

type ContactFunctionFieldProps = {
	id: string;
	className?: string;
};

const defaultValues: Pick<ContactValues, "function"> = {
	function: null,
};

const defaultProps: ContactFunctionFieldProps = {
	id: "",
	className: "md:col-span-3",
};

export const ContactFunctionField = withFieldGroup({
	defaultValues,
	props: defaultProps,
	render: function ContactFunctionField(props) {
		const { group, id, className = "md:col-span-3" } = props;
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
				<group.AppField name="function" validators={{ onBlur: functionSchema }}>
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
				</group.AppField>
			</div>
		);
	},
});
