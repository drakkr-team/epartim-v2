import { useTranslation } from "react-i18next";
import z from "zod";

import {
	type SubscriptionMatchingDevice,
	SubscriptionMatchingLimitKind,
} from "@workspace/api/constants/subscription_matching_rules";
import { Field } from "@workspace/ui-react/components/field";
import { Select } from "@workspace/ui-react/components/select";

import type { useContractCharacteristicsForm } from "#/features/subscriptions/contract_characteristics/hooks/use-form";

const namespace = "features.subscriptions.contract_characteristics";
const limitKinds = [
	{ value: SubscriptionMatchingLimitKind.LEGAL, label: "legal" },
	{ value: SubscriptionMatchingLimitKind.AMOUNT, label: "amount" },
] as const;

export type MatchingForm = ReturnType<typeof useContractCharacteristicsForm>["form"];
export type MatchingNumberUnit = "years" | "percent" | "currency";
type MatchingNumberName =
	| `matchingRules.${SubscriptionMatchingDevice}.uniformRules[${number}].${"rate" | "limitAmount"}`
	| `matchingRules.${SubscriptionMatchingDevice}.seniorityRules[${number}].periods[${number}].${"fromYears" | "toYears" | "rate" | "limitAmount"}`
	| `matchingRules.${SubscriptionMatchingDevice}.unilateralRule.limitAmount`;
type MatchingLimitName =
	| `matchingRules.${SubscriptionMatchingDevice}.uniformRules[${number}]`
	| `matchingRules.${SubscriptionMatchingDevice}.seniorityRules[${number}].periods[${number}]`
	| `matchingRules.${SubscriptionMatchingDevice}.unilateralRule`;

type MatchingNumberFieldProps = {
	form: MatchingForm;
	name: MatchingNumberName;
	label: string;
	unit: MatchingNumberUnit;
	max?: number;
	schema?: z.ZodNumber;
};

export function MatchingNumberField({
	form,
	name,
	label,
	unit,
	max,
	schema: customSchema,
}: MatchingNumberFieldProps) {
	const { t } = useTranslation(namespace);
	const required = t("matching.validation.requiredNumber");
	const schema =
		customSchema ??
		(unit === "years"
			? z
					.number({ error: required })
					.int(t("matching.validation.wholeYears"))
					.nonnegative(t("matching.validation.wholeYears"))
			: unit === "percent"
				? z
						.number({ error: required })
						.positive(t("matching.validation.rateRange"))
						.max(300, t("matching.validation.rateRange"))
				: z
						.number({ error: required })
						.positive(t("matching.validation.positiveAmount"))
						.refine(
							(value) =>
								Number.isSafeInteger(Math.round(value * 100)) &&
								Math.abs(value * 100 - Math.round(value * 100)) <= Number.EPSILON * 100,
							t("matching.validation.amountPrecision"),
						)
						.refine(
							(value) => max === undefined || value <= max,
							t("matching.validation.unilateralMaximum"),
						));
	return (
		<form.AppField name={name} validators={{ onBlur: schema, onSubmit: schema }}>
			{(field) => (
				<field.NumberField
					label={label}
					required
					inputProps={{
						locale: "fr-FR",
						min: unit === "years" ? 0 : 0.01,
						max: unit === "percent" ? 300 : max,
						step: unit === "currency" ? 0.01 : 1,
						allowOutOfRange: true,
						format:
							unit === "currency"
								? { style: "currency", currency: "EUR", maximumFractionDigits: 2 }
								: { style: "decimal", maximumFractionDigits: unit === "years" ? 0 : 2 },
					}}
				/>
			)}
		</form.AppField>
	);
}

type MatchingLimitFieldsProps = {
	form: MatchingForm;
	name: MatchingLimitName;
	max?: number;
};

export function MatchingLimitFields({ form, name, max }: MatchingLimitFieldsProps) {
	const { t } = useTranslation(namespace);
	const limitKindSchema = z.enum(SubscriptionMatchingLimitKind, {
		error: t("matching.validation.requiredLimitKind"),
	});
	return (
		<div className="grid gap-4 sm:grid-cols-2">
			<form.AppField
				name={`${name}.limitKind`}
				validators={{ onBlur: limitKindSchema, onSubmit: limitKindSchema }}
			>
				{(field) => {
					const error = field.state.meta.errorMap.onBlur ?? field.state.meta.errorMap.onSubmit;
					const invalid =
						(field.state.meta.isTouched || field.state.meta.errorMap.onSubmit !== undefined) &&
						error !== undefined;
					return (
						<Field name={field.name} invalid={invalid} className="flex flex-col gap-2">
							<Field.Label htmlFor={field.name} required>
								{t("matching.limitKind")}
							</Field.Label>
							<Select
								items={limitKinds}
								value={field.state.value}
								onValueChange={(value) => field.handleChange(value)}
								onOpenChange={(open) => {
									if (!open) field.handleBlur();
								}}
							>
								<Select.Input id={field.name} className="w-full">
									<Select.Value placeholder={t("matching.selectLimit")} />
								</Select.Input>
								<Select.Dropdown>
									{limitKinds.map((option) => (
										<Select.Option
											key={option.value}
											value={option.value}
											label={t(`matching.limit.${option.label}`)}
										>
											{t(`matching.limit.${option.label}`)}
										</Select.Option>
									))}
								</Select.Dropdown>
							</Select>
							{invalid &&
								error?.map((issue) => (
									<Field.Error key={issue.message}>{issue.message}</Field.Error>
								))}
						</Field>
					);
				}}
			</form.AppField>
			<MatchingNumberField
				form={form}
				name={`${name}.limitAmount`}
				label={t("matching.limitAmount")}
				unit="currency"
				max={max}
			/>
		</div>
	);
}
