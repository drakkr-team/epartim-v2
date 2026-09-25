import { useTranslation } from "react-i18next";
import z from "zod";

import { MinimumSeniorityMonths } from "@workspace/api/constants/subscription_agreement";
import { Field } from "@workspace/ui-react/components/field";

import type { useContractCharacteristicsForm } from "#/features/subscriptions/contract_characteristics/hooks/use-form";

type MinimumSenioritySectionProps = {
	form: ReturnType<typeof useContractCharacteristicsForm>["form"];
};

export function MinimumSenioritySection({ form }: MinimumSenioritySectionProps) {
	const { t } = useTranslation("features.subscriptions.contract_characteristics");
	const minimumSenioritySchema = z
		.number({ error: t("validation.minimumSeniorityMonths") })
		.int()
		.min(0)
		.max(3);

	return (
		<section aria-labelledby="minimum-seniority-heading" className="grid gap-6">
			<div className="border-neutral-4 border-b pb-4">
				<p className="font-bold text-primary-9 text-xs uppercase tracking-widest">
					{t("seniority.eyebrow")}
				</p>
				<h2 id="minimum-seniority-heading" className="mt-2 font-bold text-secondary-12 text-xl">
					{t("seniority.title")}
				</h2>
				<p className="mt-1 text-neutral-11 text-sm">{t("seniority.description")}</p>
			</div>
			<form.AppField name="minimumSeniorityMonths" validators={{ onBlur: minimumSenioritySchema }}>
				{(field) => {
					const invalid =
						field.state.meta.isTouched && field.state.meta.errorMap.onBlur !== undefined;
					return (
						<Field
							name={field.name}
							invalid={invalid}
							aria-invalid={invalid}
							className="grid gap-3"
						>
							<div
								role="radiogroup"
								aria-labelledby="minimum-seniority-heading"
								aria-required="true"
								className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4"
							>
								{MinimumSeniorityMonths.map((months) => {
									const checked = field.state.value === months;
									return (
										<label
											key={months}
											className={[
												"flex min-h-16 cursor-pointer items-start gap-3 rounded-sm border p-4 transition",
												checked
													? "border-secondary-10 bg-secondary-2"
													: "border-neutral-6 bg-neutral-1 hover:border-neutral-8",
											].join(" ")}
										>
											<input
												type="radio"
												name={field.name}
												value={months}
												checked={checked}
												required
												aria-invalid={invalid}
												className="mt-0.5 size-4 shrink-0 cursor-pointer accent-secondary-10"
												onBlur={field.handleBlur}
												onChange={() => {
													field.handleChange(months);
													field.handleBlur();
												}}
											/>
											<span className="font-semibold text-secondary-12 text-xs">
												{months === 0
													? t("seniority.none")
													: t("seniority.months", { count: months })}
											</span>
										</label>
									);
								})}
							</div>
							{invalid &&
								field.state.meta.errorMap.onBlur?.map((error) => (
									<Field.Error key={error.message}>{error.message}</Field.Error>
								))}
						</Field>
					);
				}}
			</form.AppField>
		</section>
	);
}
