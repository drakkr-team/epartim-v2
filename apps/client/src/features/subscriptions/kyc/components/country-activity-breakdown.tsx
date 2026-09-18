import { useTranslation } from "react-i18next";

import { Button } from "@workspace/ui-react/components/button";
import { Field } from "@workspace/ui-react/components/field";
import { NumberInput } from "@workspace/ui-react/components/number-input";
import { PlusIcon, Trash2Icon } from "@workspace/ui-react/icons";

import {
	CountryCombobox,
	countryOptions,
} from "#/features/subscriptions/kyc/components/country-select";

const namespace = "features.subscriptions.kyc";

export type CountryActivity = { country: string | null; percentage: number | null };
type CompletedCountryActivity = { country: string; percentage: number };

type CountryActivityBreakdownProps = {
	invalid?: boolean;
	onValueChange: (value: CountryActivity[]) => void;
	value: CountryActivity[];
};

function formatPercentage(value: number) {
	return new Intl.NumberFormat("fr-FR", { maximumFractionDigits: 2 }).format(value);
}

export function isCountryActivityBreakdownValid(
	value: CountryActivity[],
): value is CompletedCountryActivity[] {
	return (
		value.length > 0 &&
		value.every(
			(entry): entry is CompletedCountryActivity =>
				typeof entry.country === "string" &&
				typeof entry.percentage === "number" &&
				entry.percentage > 0 &&
				entry.percentage <= 100,
		) &&
		Math.abs(value.reduce((total, entry) => total + (entry.percentage ?? 0), 0) - 100) < 0.001
	);
}

export function CountryActivityBreakdown(props: CountryActivityBreakdownProps) {
	const { invalid = false, onValueChange, value } = props;
	const { t } = useTranslation(namespace);
	const activities = value.length === 0 ? [{ country: null, percentage: null }] : value;
	const total = value.reduce((sum, entry) => sum + (entry.percentage ?? 0), 0);
	const isValid = isCountryActivityBreakdownValid(value);

	function updateActivity(index: number, changes: Partial<CountryActivity>) {
		const next = activities.map((activity, activityIndex) =>
			activityIndex === index ? { ...activity, ...changes } : activity,
		);
		onValueChange(next);
	}

	function addCountry(index: number) {
		if (activities[index].country === null) return;

		onValueChange([
			...activities.slice(0, index + 1),
			{ country: null, percentage: null },
			...activities.slice(index + 1),
		]);
	}

	function removeCountry(index: number) {
		onValueChange(activities.filter((_, activityIndex) => activityIndex !== index));
	}

	return (
		<Field invalid={invalid} className="grid gap-2">
			<Field.Label required>{t("field.countryOfActivityBreakdown")}</Field.Label>
			<div className="divide-y divide-neutral-5">
				{activities.map((activity, index) => {
					const availableCountries = countryOptions.filter(
						(country) =>
							country.value === activity.country ||
							!activities.some(
								(otherActivity, otherIndex) =>
									otherIndex !== index && otherActivity.country === country.value,
							),
					);

					return (
						<div
							key={activity.country ?? `new-country-${index}`}
							className="grid grid-cols-[2.5rem_minmax(0,1fr)_9rem_2.5rem] items-center gap-3 py-2"
						>
							<Button
								aria-label={t("field.countryOfActivityAdd")}
								disabled={activity.country === null}
								size="icon-md"
								variant="ghost"
								onClick={() => addCountry(index)}
							>
								<PlusIcon />
							</Button>
							<CountryCombobox
								ariaLabel={t("field.countryOfActivityCountry")}
								options={availableCountries}
								placeholder={t("field.countryOfActivityCountry")}
								value={activity.country}
								onValueChange={(country) => {
									const percentage =
										country !== null && activities.length === 1 && activity.percentage === null
											? 100
											: activity.percentage;
									updateActivity(index, { country, percentage });
								}}
							/>
							<div className="flex items-center gap-2">
								<NumberInput
									aria-label={t("field.countryOfActivityPercentageForCountry", {
										country: activity.country ?? t("field.countryOfActivityCountry"),
									})}
									locale="fr-FR"
									max={100}
									min={0}
									step={0.01}
									value={activity.percentage}
									onValueCommitted={(percentage) => updateActivity(index, { percentage })}
								/>
								<span className="font-medium text-neutral-11 text-sm">%</span>
							</div>
							<Button
								aria-label={t("field.countryOfActivityRemove", {
									country: activity.country ?? t("field.countryOfActivityCountry"),
								})}
								size="icon-md"
								variant="ghost"
								onClick={() => removeCountry(index)}
							>
								<Trash2Icon />
							</Button>
						</div>
					);
				})}
			</div>
			{value.length > 0 && (
				<p
					aria-live="polite"
					className={
						isValid ? "font-medium text-secondary-11 text-sm" : "font-medium text-error-11 text-sm"
					}
				>
					{t("field.countryOfActivityTotal", { total: formatPercentage(total) })}
					{!isValid && ` · ${t("validation.countryOfActivityTotal")}`}
				</p>
			)}
			{invalid && <Field.Error>{t("validation.countryOfActivityBreakdown")}</Field.Error>}
		</Field>
	);
}
