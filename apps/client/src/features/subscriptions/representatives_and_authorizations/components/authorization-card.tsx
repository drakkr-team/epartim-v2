import { useTranslation } from "react-i18next";
import z from "zod";

import { Button } from "@workspace/ui-react/components/button";
import { Field } from "@workspace/ui-react/components/field";
import { Trash2Icon } from "@workspace/ui-react/icons";

import { ContactFields } from "#/features/subscriptions/representatives_and_authorizations/components/contact-fields";
import {
	CONTACT_AUTHORIZATIONS,
	type useRepresentativesAndAuthorizationsForm,
} from "#/features/subscriptions/representatives_and_authorizations/hooks/use-form";

const translationNamespace =
	"features.subscriptions.representatives_and_authorizations.components.representatives-and-authorizations-form";

type AuthorizationCardProps = {
	form: ReturnType<typeof useRepresentativesAndAuthorizationsForm>["form"];
	index: number;
	onUpdate: () => void;
	onRemove: () => void;
};

export function AuthorizationCard(props: AuthorizationCardProps) {
	const { form, index, onUpdate, onRemove } = props;
	const { t } = useTranslation(translationNamespace);
	const authorizationOptions = CONTACT_AUTHORIZATIONS.map((authorization) => ({
		value: authorization,
		label: String(t(`authorization.${authorization}` as never)),
	}));
	const authorizationsSchema = z
		.array(z.literal(CONTACT_AUTHORIZATIONS, t("validation.required")))
		.min(1, t("validation.required"));

	return (
		<section
			aria-labelledby={`authorization-${index}-heading`}
			className="grid gap-4 rounded-md border border-secondary-3 p-4"
		>
			<div className="flex items-center justify-between gap-4">
				<h4 id={`authorization-${index}-heading`} className="font-bold text-secondary-12 text-sm">
					{t("authorizations.item", { index: index + 1 })}
				</h4>
				<Button
					type="button"
					variant="ghost"
					size="icon-md"
					aria-label={t("authorizations.remove")}
					onClick={onRemove}
				>
					<Trash2Icon />
				</Button>
			</div>

			<ContactFields
				form={form}
				fields={`authorizations[${index}]`}
				idPrefix={`authorization-${index}`}
				onUpdate={onUpdate}
				includeFunction
				includePortalId
				phoneRequired
			/>

			<form.AppField
				name={`authorizations[${index}].authorizations`}
				validators={{ onBlur: authorizationsSchema }}
			>
				{(field) => {
					const invalid = field.state.meta.isTouched && !field.state.meta.isValid;

					return (
						<Field invalid={invalid} className="flex flex-col gap-3">
							<Field.Label required>{t("authorizations.rights")}</Field.Label>
							<div className="flex flex-wrap gap-3">
								{authorizationOptions.map((option) => {
									const checked = field.state.value.includes(option.value);

									return (
										<Button
											key={option.value}
											type="button"
											variant={checked ? "secondary" : "default"}
											className={`rounded-full px-4${checked ? "" : "text-secondary-11"}`}
											aria-pressed={checked}
											onClick={() => {
												field.handleChange(
													checked
														? field.state.value.filter(
																(authorization) => authorization !== option.value,
															)
														: [...field.state.value, option.value],
												);
												field.handleBlur();
											}}
										>
											{option.label}
										</Button>
									);
								})}
							</div>
							{invalid &&
								field.state.meta.errors
									.flat()
									.filter((error) => error !== undefined)
									.map((error) => <Field.Error key={error.message}>{error.message}</Field.Error>)}
						</Field>
					);
				}}
			</form.AppField>
		</section>
	);
}
