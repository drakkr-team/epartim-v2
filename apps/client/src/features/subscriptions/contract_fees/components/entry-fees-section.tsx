import { useTranslation } from "react-i18next";
import z from "zod";

import {
	SUBSCRIPTION_MAX_ENTRY_FEE_RATE,
	SubscriptionEntryFeePayer,
} from "@workspace/api/constants/subscription_contract_fee";
import { Field } from "@workspace/ui-react/components/field";

import type { useContractFeesForm } from "#/features/subscriptions/contract_fees/hooks/use-form";

type EntryFeesSectionProps = { form: ReturnType<typeof useContractFeesForm>["form"] };

export function EntryFeesSection({ form }: EntryFeesSectionProps) {
	const { t } = useTranslation("features.subscriptions.contract_fees");
	const payerSchema = z.enum(SubscriptionEntryFeePayer, { error: t("validation.entryFeePayer") });
	const rateSchema = z
		.number({ error: t("validation.entryFeeRateRequired") })
		.min(0, t("validation.entryFeeRateRange"))
		.max(SUBSCRIPTION_MAX_ENTRY_FEE_RATE, t("validation.entryFeeRateRange"))
		.multipleOf(0.01, t("validation.entryFeeRatePrecision"));

	return (
		<section aria-labelledby="entry-fees-heading" className="grid gap-6">
			<div className="border-neutral-4 border-b pb-4">
				<p className="font-bold text-primary-9 text-xs uppercase tracking-widest">
					{t("entry.eyebrow")}
				</p>
				<h2 id="entry-fees-heading" className="mt-2 font-bold text-secondary-12 text-xl">
					{t("entry.title")}
				</h2>
				<p className="mt-1 text-neutral-11 text-sm">{t("entry.description")}</p>
			</div>
			<form.AppField
				name="entryFeePayer"
				validators={{ onBlur: payerSchema, onSubmit: payerSchema }}
			>
				{(field) => {
					const errors = field.state.meta.errorMap.onBlur ?? field.state.meta.errorMap.onSubmit;
					const invalid =
						(field.state.meta.isTouched || field.state.meta.errorMap.onSubmit !== undefined) &&
						errors !== undefined;
					return (
						<Field
							name={field.name}
							invalid={invalid}
							aria-invalid={invalid}
							className="grid gap-3"
						>
							<div
								role="radiogroup"
								aria-labelledby="entry-fees-heading"
								aria-required="true"
								className="grid gap-3 sm:grid-cols-2"
							>
								{Object.values(SubscriptionEntryFeePayer).map((payer) => (
									<label
										key={payer}
										className={[
											"flex min-h-16 cursor-pointer items-start gap-3 rounded-sm border p-4 transition",
											field.state.value === payer
												? "border-secondary-10 bg-secondary-2"
												: "border-neutral-6 bg-neutral-1 hover:border-neutral-8",
										].join(" ")}
									>
										<input
											type="radio"
											name={field.name}
											value={payer}
											checked={field.state.value === payer}
											required
											aria-invalid={invalid}
											className="mt-0.5 size-4 shrink-0 cursor-pointer accent-secondary-10"
											onBlur={field.handleBlur}
											onChange={() => {
												field.handleChange(payer);
												field.handleBlur();
											}}
										/>
										<span className="font-semibold text-secondary-12 text-xs">
											{t(`entry.payers.${payer}`)}
										</span>
									</label>
								))}
							</div>
							{invalid &&
								errors?.map((error) => (
									<Field.Error key={error.message}>{error.message}</Field.Error>
								))}
						</Field>
					);
				}}
			</form.AppField>
			<div className="max-w-sm">
				<form.AppField
					name="entryFeeRate"
					validators={{ onBlur: rateSchema, onSubmit: rateSchema }}
				>
					{(field) => (
						<field.NumberField
							label={t("entry.rate")}
							description={t("entry.rateDescription")}
							required
							inputProps={{
								locale: "fr-FR",
								min: 0,
								max: SUBSCRIPTION_MAX_ENTRY_FEE_RATE,
								step: 0.01,
								allowOutOfRange: true,
								format: { style: "decimal", maximumFractionDigits: 20 },
							}}
						/>
					)}
				</form.AppField>
			</div>
		</section>
	);
}
