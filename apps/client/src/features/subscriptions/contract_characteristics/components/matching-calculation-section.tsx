import { useTranslation } from "react-i18next";

import { SubscriptionMatchingCalculationMethod } from "@workspace/api/constants/subscription_matching";
import { Field } from "@workspace/ui-react/components/field";
import { PhoneIcon } from "@workspace/ui-react/icons";

import { InformationCard } from "#/features/subscriptions/components/information-card";
import type { useContractCharacteristicsForm } from "#/features/subscriptions/contract_characteristics/hooks/use-form";

const namespace = "features.subscriptions.contract_characteristics";
const calculationMethods = [
	{ value: SubscriptionMatchingCalculationMethod.AMUNDI, label: "amundi" },
	{ value: SubscriptionMatchingCalculationMethod.COMPANY, label: "company" },
] as const;

type MatchingCalculationSectionProps = {
	form: ReturnType<typeof useContractCharacteristicsForm>["form"];
};

export function MatchingCalculationSection({ form }: MatchingCalculationSectionProps) {
	const { t } = useTranslation(namespace);

	return (
		<section aria-labelledby="matching-calculation-heading" className="grid gap-6">
			<div className="border-neutral-4 border-b pb-4">
				<p className="font-bold text-primary-9 text-xs uppercase tracking-widest">
					{t("matchingCalculation.eyebrow")}
				</p>
				<h2 id="matching-calculation-heading" className="mt-2 font-bold text-secondary-12 text-xl">
					{t("matchingCalculation.title")}
				</h2>
				<p className="mt-1 text-neutral-11 text-sm">{t("matchingCalculation.description")}</p>
				<p className="mt-2 text-neutral-11 text-sm">{t("matchingCalculation.seniorityWarning")}</p>
			</div>

			<form.AppField name="matchingCalculationMethod">
				{(field) => (
					<Field name={field.name} className="grid gap-3">
						<div
							role="radiogroup"
							aria-labelledby="matching-calculation-heading"
							className="grid gap-3 md:grid-cols-2"
						>
							{calculationMethods.map((option) => {
								const checked = field.state.value === option.value;
								const id = `matching-calculation-${option.value}`;

								return (
									<label
										key={option.value}
										htmlFor={id}
										className={[
											"flex min-h-24 cursor-pointer items-start gap-3 rounded-sm border p-4 transition",
											checked
												? "border-secondary-10 bg-secondary-2"
												: "border-neutral-6 bg-neutral-1 hover:border-neutral-8",
										].join(" ")}
									>
										<input
											id={id}
											type="radio"
											name={field.name}
											value={option.value}
											checked={checked}
											className="mt-0.5 size-4 shrink-0 cursor-pointer accent-secondary-10"
											onBlur={field.handleBlur}
											onChange={() => {
												field.handleChange(option.value);
												field.handleBlur();
											}}
										/>
										<span className="font-semibold text-secondary-12 text-sm">
											{t(`matchingCalculation.option.${option.label}`)}
										</span>
									</label>
								);
							})}
						</div>
					</Field>
				)}
			</form.AppField>

			<InformationCard
				description={t("matchingCalculation.support.description")}
				title={t("matchingCalculation.support.title")}
			>
				<div className="mt-3 flex flex-wrap gap-2">
					<a
						href="tel:0645720399"
						className="inline-flex items-center gap-2 rounded-full border border-primary-7 px-2 py-1 font-medium text-secondary-12 text-xs"
					>
						<PhoneIcon aria-hidden="true" className="size-3 text-primary-9" />
						{t("matchingCalculation.support.phoneOne")}
					</a>
					<a
						href="tel:0785945610"
						className="inline-flex items-center gap-2 rounded-full border border-primary-7 px-2 py-1 font-medium text-secondary-12 text-xs"
					>
						<PhoneIcon aria-hidden="true" className="size-3 text-primary-9" />
						{t("matchingCalculation.support.phoneTwo")}
					</a>
				</div>
			</InformationCard>
		</section>
	);
}
