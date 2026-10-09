import { useTranslation } from "react-i18next";
import z from "zod";

import { MinimumSeniorityMonths } from "@workspace/api/constants/subscription_agreement";
import {
	SubscriptionParticipationDuration,
	SubscriptionParticipationFormula,
} from "@workspace/api/constants/subscription_participation";
import { DatePicker } from "@workspace/ui-react/components/date-picker";
import { Field } from "@workspace/ui-react/components/field";
import { Select } from "@workspace/ui-react/components/select";

import type { useContractCharacteristicsForm } from "#/features/subscriptions/contract_characteristics/hooks/use-form";
import { calendarDate } from "#/features/subscriptions/steps/completion/completion";
import { formatCalendarDate, parseCalendarDate } from "#/utils/helpers/date";

type Props = { form: ReturnType<typeof useContractCharacteristicsForm>["form"] };

export function VoluntaryParticipationSection({ form }: Props) {
	const { t } = useTranslation("features.subscriptions.contract_characteristics");
	const required = t("participation.validation.required");
	const durationOptions = [1, 2, 3, 0].map((value) => ({
		value,
		label: value === 0 ? t("participation.indefinite") : t("participation.years", { count: value }),
	}));
	const seniorityOptions = MinimumSeniorityMonths.map((value) => ({
		value,
		label: value === 0 ? t("participation.noSeniority") : t("seniority.months", { count: value }),
	}));
	const formulaOptions = Object.values(SubscriptionParticipationFormula).map((value) => ({
		value,
		label: t(`participation.formula.${value}`),
	}));
	const selectFields = [
		{
			name: "voluntaryParticipationDuration",
			label: t("participation.duration"),
			options: durationOptions,
			schema: z.enum(SubscriptionParticipationDuration, { error: required }),
		},
		{
			name: "voluntaryParticipationMinimumSeniorityMonths",
			label: t("participation.seniority"),
			options: seniorityOptions,
			schema: z.union([z.literal(0), z.literal(1), z.literal(2), z.literal(3)], {
				error: required,
			}),
		},
		{
			name: "voluntaryParticipationFormula",
			label: t("participation.calculationFormula"),
			options: formulaOptions,
			schema: z.enum(SubscriptionParticipationFormula, { error: required }),
		},
	] as const;
	const percentageSchema = z
		.number({ error: required })
		.min(0, t("participation.validation.percentageRange"))
		.max(100, t("participation.validation.percentageRange"))
		.refine(
			(value) => Math.abs(value * 100 - Math.round(value * 100)) <= 1e-9,
			t("participation.validation.percentagePrecision"),
		);
	const percentageFields = [
		{ name: "voluntaryParticipationSalaryPercentage", label: t("participation.salaryPercentage") },
		{
			name: "voluntaryParticipationPresencePercentage",
			label: t("participation.presencePercentage"),
		},
		{ name: "voluntaryParticipationEqualPercentage", label: t("participation.equalPercentage") },
	] as const;
	const dateFields = [
		{
			name: "voluntaryParticipationStartDate",
			other: "voluntaryParticipationEndDate",
			label: t("participation.startDate"),
		},
		{
			name: "voluntaryParticipationEndDate",
			other: "voluntaryParticipationStartDate",
			label: t("participation.endDate"),
		},
	] as const;

	return (
		<section aria-labelledby="voluntary-participation-heading" className="grid gap-6">
			<div className="border-neutral-4 border-b pb-4">
				<p className="font-bold text-primary-9 text-xs uppercase tracking-widest">
					{t("participation.eyebrow")}
				</p>
				<h2
					id="voluntary-participation-heading"
					className="mt-2 font-bold text-secondary-12 text-xl"
				>
					{t("participation.title")}
				</h2>
			</div>
			<div className="grid gap-5 md:grid-cols-2">
				{selectFields.slice(0, 1).map(renderSelect)}
				<div className="grid gap-5 md:col-span-2 md:grid-cols-2">
					{dateFields.map(({ name, other, label }) => (
						<form.AppField
							key={name}
							name={name}
							validators={{
								onBlur: ({ value, fieldApi }) => {
									if (!value) return required;
									if (!calendarDate.safeParse(value).success)
										return t("participation.validation.date");
									const {
										voluntaryParticipationStartDate: start,
										voluntaryParticipationEndDate: end,
									} = fieldApi.form.state.values;
									if (start && end && end <= start) return t("participation.validation.dateOrder");
								},
								onBlurListenTo: [other],
							}}
						>
							{(field) => {
								const error =
									field.state.meta.errorMap.onBlur ?? field.state.meta.errorMap.onSubmit;
								const invalid =
									(field.state.meta.isTouched ||
										field.state.meta.errorMap.onSubmit !== undefined) &&
									error !== undefined;
								return (
									<Field name={field.name} invalid={invalid} className="flex flex-col gap-2">
										<Field.Label required>{label}</Field.Label>
										<DatePicker
											clearable
											clearLabel={t("action.clearDate")}
											inputClassName="w-full"
											mode="single"
											onSelect={(date) => {
												field.handleChange(formatCalendarDate(date) ?? null);
												field.handleBlur();
											}}
											placeholder={label}
											selected={parseCalendarDate(field.state.value ?? undefined)}
										/>
										{invalid && <Field.Error>{error}</Field.Error>}
									</Field>
								);
							}}
						</form.AppField>
					))}
				</div>
				{selectFields.slice(1, 2).map(renderSelect)}
				<div className="grid gap-5 md:col-span-2 lg:grid-cols-3 lg:items-end">
					{percentageFields.map(({ name, label }) => (
						<form.AppField
							key={name}
							name={name}
							validators={{ onBlur: percentageSchema, onSubmit: percentageSchema }}
						>
							{(field) => (
								<field.NumberField
									required
									label={label}
									inputProps={{
										locale: "fr-FR",
										min: 0,
										max: 100,
										step: 0.01,
										allowOutOfRange: true,
										format: { style: "decimal", maximumFractionDigits: 2 },
									}}
								/>
							)}
						</form.AppField>
					))}
				</div>
				{selectFields.slice(2).map(renderSelect)}
			</div>
		</section>
	);

	function renderSelect({ name, label, options, schema }: (typeof selectFields)[number]) {
		const validate = ({ value }: { value: number | null }) => {
			const result = schema.safeParse(value);
			return result.success ? undefined : result.error.issues;
		};
		return (
			<form.AppField key={name} name={name} validators={{ onBlur: validate, onSubmit: validate }}>
				{(field) => {
					const error = field.state.meta.errorMap.onBlur ?? field.state.meta.errorMap.onSubmit;
					const invalid =
						(field.state.meta.isTouched || field.state.meta.errorMap.onSubmit !== undefined) &&
						error !== undefined;
					return (
						<Field
							name={field.name}
							invalid={invalid}
							className={
								name === "voluntaryParticipationFormula"
									? "flex flex-col gap-2 md:col-span-2"
									: "flex flex-col gap-2"
							}
						>
							<Field.Label htmlFor={field.name} required>
								{label}
							</Field.Label>
							<Select
								items={options}
								value={field.state.value}
								onValueChange={field.handleChange}
								onOpenChange={(open) => {
									if (!open) field.handleBlur();
								}}
							>
								<Select.Input
									id={field.name}
									className="h-auto min-h-10 w-full py-2 sm:h-auto sm:min-h-9"
								>
									<Select.Value
										className="whitespace-normal text-left"
										placeholder={t("participation.select")}
									/>
								</Select.Input>
								<Select.Dropdown>
									{options.map((option) => (
										<Select.Option
											key={option.value}
											value={option.value}
											label={option.label}
											className="h-auto min-h-9 py-2"
										>
											<span className="whitespace-normal">{option.label}</span>
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
		);
	}
}
