import { useTranslation } from "react-i18next";
import z from "zod";

import { Field } from "@workspace/ui-react/components/field";
import { Textarea } from "@workspace/ui-react/components/textarea";

import { BooleanField } from "#/features/subscriptions/components/boolean-field";
import type { MatchingChildProps } from "#/features/subscriptions/contract_characteristics/components/matching-types";

const namespace = "features.subscriptions.contract_characteristics";

export function MatchingSpecificRuleSection(props: MatchingChildProps) {
	const { device, form, matching, onChange, serverErrors } = props;
	const { t } = useTranslation(namespace);
	const specificDetailsSchema = z
		.string({ error: t("matching.validation.specificDetails") })
		.trim()
		.min(1, t("matching.validation.specificDetails"));
	return (
		<section className="grid gap-4 border-neutral-5 border-t pt-5">
			<BooleanField
				label={t("matching.specificQuestion")}
				yesLabel={t("action.yes")}
				noLabel={t("action.no")}
				value={matching.specificRule}
				onValueChange={(specificRule) =>
					onChange(
						{
							...matching,
							specificRule,
							specificRuleDetails: specificRule ? matching.specificRuleDetails : null,
						},
						true,
					)
				}
			/>
			{matching.specificRule && (
				<form.AppField
					name={`matchingRules.${device}.specificRuleDetails`}
					validators={{ onBlur: specificDetailsSchema, onSubmit: specificDetailsSchema }}
				>
					{(field) => {
						const error = field.state.meta.errorMap.onBlur ?? field.state.meta.errorMap.onSubmit;
						const serverError = serverErrors[field.name];
						const invalid =
							Boolean(serverError) ||
							((field.state.meta.isTouched || field.state.meta.errorMap.onSubmit !== undefined) &&
								error !== undefined);
						return (
							<Field name={field.name} invalid={invalid} className="grid gap-2">
								<Field.Label htmlFor={field.name} required>
									{t("matching.specificDetails")}
								</Field.Label>
								<Textarea
									id={field.name}
									value={field.state.value ?? ""}
									aria-invalid={invalid}
									data-invalid={invalid || null}
									onChange={(event) => field.handleChange(event.target.value)}
									onBlur={field.handleBlur}
								/>
								{serverError && <Field.Error>{serverError}</Field.Error>}
								{invalid &&
									!serverError &&
									error?.map((issue) => (
										<Field.Error key={issue.message}>{issue.message}</Field.Error>
									))}
							</Field>
						);
					}}
				</form.AppField>
			)}
			<p className="text-neutral-11 text-xs">{t("matching.specificInformation")}</p>
		</section>
	);
}
