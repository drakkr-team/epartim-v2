import { useTranslation } from "react-i18next";
import z from "zod";

import { DatePicker } from "@workspace/ui-react/components/date-picker";
import { Field } from "@workspace/ui-react/components/field";

import type { useFormalismGroupForm } from "#/features/subscriptions/formalism/hooks/use-group-form";
import { formatCalendarDate, parseCalendarDate } from "#/utils/helpers/date";

type Props = { form: ReturnType<typeof useFormalismGroupForm>["form"]; group: number };
export function CseMeetingFields({ form, group }: Props) {
	const { t } = useTranslation("features.subscriptions.formalism");
	const required = z
		.string()
		.trim()
		.min(1, t("validation.required"))
		.max(254, t("validation.length"));
	return (
		<div className="grid gap-5 sm:grid-cols-2">
			<form.AppField
				name="meetingDate"
				validators={{
					onBlur: z.string().refine((value) => {
						if (!/^\d{4}-\d{2}-\d{2}$/.test(value)) return false;
						const date = parseCalendarDate(value);
						return !!date && !Number.isNaN(date.getTime()) && formatCalendarDate(date) === value;
					}, t("validation.date")),
				}}
			>
				{(field) => {
					const invalid =
						field.state.meta.isTouched && field.state.meta.errorMap.onBlur !== undefined;
					return (
						<Field
							name={field.name}
							invalid={invalid}
							aria-invalid={invalid}
							className="grid gap-2"
						>
							<Field.Label required>{t("field.meetingDate")}</Field.Label>
							<DatePicker
								mode="single"
								clearable
								inputClassName="w-full"
								clearLabel={t("action.clearDate")}
								placeholder={t("field.meetingDate")}
								selected={parseCalendarDate(field.state.value || undefined)}
								onSelect={(date) => {
									field.handleChange(formatCalendarDate(date) ?? "");
									field.handleBlur();
								}}
							/>
							{invalid &&
								field.state.meta.errorMap.onBlur?.map((error) => (
									<Field.Error key={error.message}>{error.message}</Field.Error>
								))}
						</Field>
					);
				}}
			</form.AppField>
			<form.AppField
				name="closingTime"
				validators={{
					onBlur: z.string().regex(/^(?:[01]\d|2[0-3]):[0-5]\d$/, t("validation.time")),
				}}
			>
				{(field) => (
					<field.TextField
						id={`cse-${group}-time`}
						required
						label={t("field.closingTime")}
						inputProps={{ type: "time", step: 60 }}
					/>
				)}
			</form.AppField>
			<div className="sm:col-span-2">
				<form.AppField
					name="meetingCity"
					validators={{ onBlur: required.max(120, t("validation.cityLength")) }}
				>
					{(field) => (
						<field.TextField id={`cse-${group}-city`} required label={t("field.meetingCity")} />
					)}
				</form.AppField>
			</div>
		</div>
	);
}
