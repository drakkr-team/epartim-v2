import { useTranslation } from "react-i18next";

import { SubscriptionMatchingDistributionPeriod } from "@workspace/api/constants/subscription_matching";
import { Field } from "@workspace/ui-react/components/field";

import type { useContractCharacteristicsForm } from "#/features/subscriptions/contract_characteristics/hooks/use-form";

const namespace = "features.subscriptions.contract_characteristics";
const distributionPeriods = [
	{ value: SubscriptionMatchingDistributionPeriod.YEARS, label: "years" },
	{ value: SubscriptionMatchingDistributionPeriod.TRIMESTER, label: "trimester" },
	{ value: SubscriptionMatchingDistributionPeriod.SEMESTER, label: "semester" },
] as const;

type MatchingDistributionSectionProps = {
	form: ReturnType<typeof useContractCharacteristicsForm>["form"];
};

export function MatchingDistributionSection({ form }: MatchingDistributionSectionProps) {
	const { t } = useTranslation(namespace);

	return (
		<section aria-labelledby="matching-distribution-heading" className="grid gap-6">
			<div className="border-neutral-4 border-b pb-4">
				<p className="font-bold text-primary-9 text-xs uppercase tracking-widest">
					{t("matchingDistribution.eyebrow")}
				</p>
				<h2 id="matching-distribution-heading" className="mt-2 font-bold text-secondary-12 text-xl">
					{t("matchingDistribution.title")}
				</h2>
				<p className="mt-1 text-neutral-11 text-sm">{t("matchingDistribution.description")}</p>
			</div>

			<form.AppField name="matchingDistributionPeriod">
				{(field) => (
					<Field name={field.name} className="grid gap-3">
						<div
							role="radiogroup"
							aria-labelledby="matching-distribution-heading"
							className="grid gap-3 md:grid-cols-3"
						>
							{distributionPeriods.map((option) => {
								const checked = field.state.value === option.value;
								const id = `matching-distribution-${option.value}`;

								return (
									<label
										key={option.value}
										htmlFor={id}
										className={[
											"flex min-h-20 cursor-pointer items-start gap-3 rounded-sm border p-4 transition",
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
											{t(`matchingDistribution.option.${option.label}`)}
										</span>
									</label>
								);
							})}
						</div>
					</Field>
				)}
			</form.AppField>
		</section>
	);
}
