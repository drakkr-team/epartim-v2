import { useTranslation } from "react-i18next";
import z from "zod";

import { SubscriptionAgreement } from "@workspace/api/constants/subscription_agreement";
import { Checkbox } from "@workspace/ui-react/components/checkbox";
import { ChevronDownIcon } from "@workspace/ui-react/icons";

import type { useContractCharacteristicsForm } from "#/features/subscriptions/contract_characteristics/hooks/use-form";

const agreementOptions = [
	{ value: SubscriptionAgreement.PARTICIPATION, hasHelp: true },
	{ value: SubscriptionAgreement.INCENTIVES, hasHelp: true },
	{ value: SubscriptionAgreement.PPV, hasHelp: true },
	{ value: SubscriptionAgreement.PPVE, hasHelp: false },
	{ value: SubscriptionAgreement.OTHER, hasHelp: false },
] as const;

type ExistingAgreementsSectionProps = {
	form: ReturnType<typeof useContractCharacteristicsForm>["form"];
};

export function ExistingAgreementsSection({ form }: ExistingAgreementsSectionProps) {
	const { t } = useTranslation("features.subscriptions.contract_characteristics");
	const otherAgreementDetailsSchema = z
		.string()
		.trim()
		.min(1, t("validation.otherAgreementDetails"));

	return (
		<section aria-labelledby="existing-agreements-heading" className="grid gap-6">
			<div className="border-neutral-4 border-b pb-4">
				<p className="font-bold text-primary-9 text-xs uppercase tracking-widest">
					{t("agreements.eyebrow")}
				</p>
				<h2 id="existing-agreements-heading" className="mt-2 font-bold text-secondary-12 text-xl">
					{t("agreements.title")}
				</h2>
				<p className="mt-1 text-neutral-11 text-sm">{t("agreements.description")}</p>
			</div>
			<form.AppField name="existingAgreements">
				{(field) => (
					<div className="grid items-start gap-4 md:grid-cols-2">
						{agreementOptions.map(({ value, hasHelp }) => {
							const checked = field.state.value.includes(value);
							const id = `existing-agreement-${value}`;
							return (
								<div
									key={value}
									className={value === SubscriptionAgreement.OTHER ? "md:col-span-2" : undefined}
								>
									<label
										htmlFor={id}
										className={[
											"flex min-h-16 cursor-pointer items-start gap-3 rounded-sm border p-4 transition",
											checked
												? "border-secondary-10 bg-secondary-2"
												: "border-neutral-6 bg-neutral-1 hover:border-neutral-8",
										].join(" ")}
									>
										<Checkbox
											id={id}
											checked={checked}
											className="shrink-0 data-checked:border-secondary-9 data-checked:bg-secondary-9 data-checked:hover:not-data-disabled:border-secondary-10 data-checked:hover:not-data-disabled:bg-secondary-10"
											onCheckedChange={(isChecked) => {
												field.handleChange(
													isChecked
														? [...field.state.value, value]
														: field.state.value.filter((agreement) => agreement !== value),
												);
												field.handleBlur();
											}}
										/>
										<span className="font-semibold text-secondary-12 text-xs">
											{t(`agreement.${value}`)}
										</span>
									</label>
									{hasHelp && (
										<details className="group mt-2 px-1">
											<summary className="flex w-fit cursor-pointer list-none items-center gap-2 rounded-sm font-semibold text-primary-10 text-xs focus-visible:outline-2 focus-visible:outline-primary-8 [&::-webkit-details-marker]:hidden">
												{t("action.learnMore")}
												<ChevronDownIcon
													aria-hidden="true"
													className="size-4 transition-transform group-open:rotate-180"
												/>
											</summary>
											<p className="mt-2 text-neutral-11 text-sm">{t(`agreementHelp.${value}`)}</p>
										</details>
									)}
								</div>
							);
						})}
					</div>
				)}
			</form.AppField>
			<form.Subscribe
				selector={(state) => state.values.existingAgreements.includes(SubscriptionAgreement.OTHER)}
			>
				{(hasOtherAgreement) =>
					hasOtherAgreement && (
						<form.AppField
							name="otherAgreementDetails"
							validators={{ onBlur: otherAgreementDetailsSchema }}
						>
							{(field) => <field.TextAreaField label={t("field.otherAgreementDetails")} required />}
						</form.AppField>
					)
				}
			</form.Subscribe>
		</section>
	);
}
