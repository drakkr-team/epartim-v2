import { useTranslation } from "react-i18next";
import z from "zod";

import { DatePicker } from "@workspace/ui-react/components/date-picker";
import { Field } from "@workspace/ui-react/components/field";

import { BooleanField } from "#/features/subscriptions/components/boolean-field";
import type { useContractCharacteristicsForm } from "#/features/subscriptions/contract_characteristics/hooks/use-form";
import { formatCalendarDate, parseCalendarDate } from "#/utils/helpers/date";

const namespace = "features.subscriptions.contract_characteristics";

type VoluntaryPaymentPeriodSectionProps = {
	form: ReturnType<typeof useContractCharacteristicsForm>["form"];
	updateContractCharacteristics: ReturnType<
		typeof useContractCharacteristicsForm
	>["updateContractCharacteristics"];
};

export function VoluntaryPaymentPeriodSection(props: VoluntaryPaymentPeriodSectionProps) {
	const { form, updateContractCharacteristics } = props;
	const { t } = useTranslation(namespace);
	const startDateSchema = z
		.string({ error: t("validation.voluntaryPaymentPeriodStartDate") })
		.min(1, {
			error: t("validation.voluntaryPaymentPeriodStartDate"),
		});

	function updatePeriodLimit(value: boolean) {
		form.setFieldValue("voluntaryPaymentsLimitedToPeriod", value);
		if (value) {
			updateContractCharacteristics({ voluntaryPaymentsLimitedToPeriod: true });
			return;
		}

		form.setFieldValue("voluntaryPaymentPeriodStartDate", null);
		form.setFieldValue("voluntaryPaymentPeriodEndDate", null);
		form.setFieldMeta("voluntaryPaymentPeriodStartDate", (meta) => ({
			...meta,
			errorMap: {},
		}));
		form.setFieldMeta("voluntaryPaymentPeriodEndDate", (meta) => ({ ...meta, errorMap: {} }));
		updateContractCharacteristics({
			voluntaryPaymentsLimitedToPeriod: false,
			voluntaryPaymentPeriodStartDate: null,
			voluntaryPaymentPeriodEndDate: null,
		});
	}

	return (
		<form.Subscribe selector={(state) => state.values.voluntaryPaymentsLimitedToPeriod}>
			{(voluntaryPaymentsLimitedToPeriod) => (
				<section aria-labelledby="voluntary-payment-period-heading" className="grid gap-6">
					<div className="border-neutral-4 border-b pb-4">
						<p className="font-bold text-primary-9 text-xs uppercase tracking-widest">
							{t("voluntaryPaymentPeriod.eyebrow")}
						</p>
						<h2
							id="voluntary-payment-period-heading"
							className="mt-2 font-bold text-secondary-12 text-xl"
						>
							{t("voluntaryPaymentPeriod.title")}
						</h2>
						<p className="mt-1 text-neutral-11 text-sm">
							{t("voluntaryPaymentPeriod.description")}
						</p>
					</div>

					<BooleanField
						label={t("field.voluntaryPaymentsLimitedToPeriod")}
						noLabel={t("action.no")}
						onValueChange={updatePeriodLimit}
						value={voluntaryPaymentsLimitedToPeriod}
						yesLabel={t("action.yes")}
					/>

					<p className="-mt-4 text-neutral-11 text-sm">{t("voluntaryPaymentPeriod.help")}</p>

					{voluntaryPaymentsLimitedToPeriod && (
						<div className="grid gap-5 md:grid-cols-2">
							<form.AppField
								name="voluntaryPaymentPeriodStartDate"
								validators={{ onBlur: startDateSchema }}
							>
								{(field) => {
									const invalid =
										field.state.meta.isTouched && field.state.meta.errorMap.onBlur !== undefined;

									return (
										<Field name={field.name} invalid={invalid} className="flex flex-col gap-2">
											<Field.Label required>
												{t("field.voluntaryPaymentPeriodStartDate")}
											</Field.Label>
											<DatePicker
												clearable
												clearLabel={t("action.clearDate")}
												inputClassName="w-full"
												mode="single"
												onSelect={(date) => {
													field.handleChange(formatCalendarDate(date) ?? null);
													field.handleBlur();
												}}
												placeholder={t("field.voluntaryPaymentPeriodStartDate")}
												selected={parseCalendarDate(field.state.value ?? undefined)}
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
								name="voluntaryPaymentPeriodEndDate"
								validators={{
									onBlur: ({ fieldApi, value }) => {
										if (!value) return t("validation.voluntaryPaymentPeriodEndDate");

										const { voluntaryPaymentPeriodStartDate: startDate } =
											fieldApi.form.state.values;
										if (startDate && value < startDate) {
											return t("validation.voluntaryPaymentPeriodDateOrder");
										}
									},
									onBlurListenTo: ["voluntaryPaymentPeriodStartDate"],
								}}
							>
								{(field) => {
									const invalid =
										field.state.meta.isTouched && field.state.meta.errorMap.onBlur !== undefined;

									return (
										<Field name={field.name} invalid={invalid} className="flex flex-col gap-2">
											<Field.Label required>{t("field.voluntaryPaymentPeriodEndDate")}</Field.Label>
											<DatePicker
												clearable
												clearLabel={t("action.clearDate")}
												inputClassName="w-full"
												mode="single"
												onSelect={(date) => {
													field.handleChange(formatCalendarDate(date) ?? null);
													field.handleBlur();
												}}
												placeholder={t("field.voluntaryPaymentPeriodEndDate")}
												selected={parseCalendarDate(field.state.value ?? undefined)}
											/>
											{invalid && <Field.Error>{field.state.meta.errorMap.onBlur}</Field.Error>}
										</Field>
									);
								}}
							</form.AppField>
						</div>
					)}
				</section>
			)}
		</form.Subscribe>
	);
}
