import { useTranslation } from "react-i18next";
import z from "zod";

import { Field } from "@workspace/ui-react/components/field";
import { Select } from "@workspace/ui-react/components/select";

import { BooleanField } from "#/features/subscriptions/components/boolean-field";
import {
	CountryActivityBreakdown,
	isCountryActivityBreakdownValid,
} from "#/features/subscriptions/kyc/components/country-activity-breakdown";
import { CountryMultiSelect } from "#/features/subscriptions/kyc/components/country-select";
import type { useKycProfileForm } from "#/features/subscriptions/kyc/hooks/use-kyc-profile-form";

const namespace = "features.subscriptions.kyc";
const geographyOptions = [
	{ value: "france_and_eu", label: "France et UE" },
	{ value: "other", label: "Autre(s)" },
] as const;

type KycProfileSectionProps = {
	form: ReturnType<typeof useKycProfileForm>["form"];
	updateKycProfile: ReturnType<typeof useKycProfileForm>["updateKycProfile"];
};

export function KycProfileSection(props: KycProfileSectionProps) {
	const { form, updateKycProfile } = props;
	const { t } = useTranslation(namespace);
	const requiredTextSchema = z
		.string()
		.trim()
		.min(1, t("validation.required"))
		.max(254, t("validation.max"));
	const percentageSchema = z
		.number({ error: t("validation.percentage") })
		.min(0, t("validation.percentage"))
		.max(100, t("validation.percentage"));
	const countryActivityBreakdownSchema = z
		.array(
			z.object({
				country: z
					.string()
					.regex(/^[A-Z]{2}$/)
					.nullable(),
				percentage: percentageSchema.nullable(),
			}),
		)
		.min(1, t("validation.countryOfActivityBreakdown"))
		.refine(isCountryActivityBreakdownValid, t("validation.countryOfActivityTotal"));

	function updateBoolean(
		field: "regulatedActivity" | "listedCompany" | "bicId" | "bearerBondsStructure",
		value: boolean,
	) {
		form.setFieldValue(`kycProfile.${field}`, value);

		if (value) {
			updateKycProfile({ [field]: value });
			return;
		}

		switch (field) {
			case "regulatedActivity":
				form.setFieldValue("kycProfile.regulatedActivityReference", "");
				updateKycProfile({ regulatedActivity: false, regulatedActivityReference: null });
				return;
			case "listedCompany":
				form.setFieldValue("kycProfile.listedCompanyReference", "");
				updateKycProfile({ listedCompany: false, listedCompanyReference: null });
				return;
			case "bearerBondsStructure":
				form.setFieldValue("kycProfile.bearerBondsStructurePercentage", null);
				updateKycProfile({ bearerBondsStructure: false, bearerBondsStructurePercentage: null });
				return;
			case "bicId":
				updateKycProfile({ bicId: false });
		}
	}

	return (
		<form.Subscribe selector={(state) => state.values.kycProfile}>
			{(profile) => (
				<section aria-labelledby="kyc-client-heading" className="grid gap-6">
					<div className="border-neutral-4 border-b pb-4">
						<p className="font-bold text-primary-9 text-xs uppercase tracking-widest">
							{t("client.eyebrow")}
						</p>
						<h2 id="kyc-client-heading" className="mt-2 font-bold text-secondary-12 text-xl">
							{t("client.title")}
						</h2>
					</div>
					<div className="grid gap-6 md:grid-cols-2">
						<div className="grid gap-4">
							<BooleanField
								label={t("field.regulatedActivity")}
								value={profile.regulatedActivity}
								yesLabel="Oui"
								noLabel="Non"
								onValueChange={(value) => updateBoolean("regulatedActivity", value)}
							/>
							{profile.regulatedActivity && (
								<form.AppField
									name="kycProfile.regulatedActivityReference"
									validators={{
										onBlur: requiredTextSchema,
									}}
								>
									{(field) => (
										<field.TextField label={t("field.regulatedActivityReference")} required />
									)}
								</form.AppField>
							)}
							<BooleanField
								label={t("field.listedCompany")}
								value={profile.listedCompany}
								yesLabel="Oui"
								noLabel="Non"
								onValueChange={(value) => updateBoolean("listedCompany", value)}
							/>
							{profile.listedCompany && (
								<form.AppField
									name="kycProfile.listedCompanyReference"
									validators={{
										onBlur: requiredTextSchema,
									}}
								>
									{(field) => (
										<field.TextField label={t("field.listedCompanyReference")} required />
									)}
								</form.AppField>
							)}
						</div>
						<div className="grid gap-4">
							<BooleanField
								label={t("field.bicId")}
								value={profile.bicId}
								yesLabel="Oui"
								noLabel="Non"
								onValueChange={(value) => updateBoolean("bicId", value)}
							/>
							<BooleanField
								label={t("field.bearerBondsStructure")}
								value={profile.bearerBondsStructure}
								yesLabel="Oui"
								noLabel="Non"
								onValueChange={(value) => updateBoolean("bearerBondsStructure", value)}
							/>
							{profile.bearerBondsStructure && (
								<form.AppField
									name="kycProfile.bearerBondsStructurePercentage"
									validators={{
										onBlur: percentageSchema,
									}}
								>
									{(field) => (
										<field.NumberField
											label={t("field.bearerBondsStructurePercentage")}
											required
											inputProps={{ locale: "fr-FR", min: 0, max: 100, step: 0.01 }}
										/>
									)}
								</form.AppField>
							)}
						</div>
					</div>
					{(["countryOfActivity", "mainMarkets", "countryProvider"] as const).map((field) => {
						const isCountryOfActivity = field === "countryOfActivity";
						const countryListField =
							field === "mainMarkets" ? "mainMarketsCountries" : "countryProviderCountries";

						return (
							<div key={field} className="grid gap-3">
								<form.AppField name={`kycProfile.${field}`}>
									{(selectField) => (
										<Field className="flex flex-col gap-2">
											<Field.Label>{t(`field.${field}`)}</Field.Label>
											<Select
												items={geographyOptions}
												value={selectField.state.value}
												onValueChange={(value) => {
													if (!value) return;
													selectField.handleChange(value);
													selectField.handleBlur();
												}}
											>
												<Select.Input className="w-full">
													<Select.Value />
												</Select.Input>
												<Select.Dropdown>
													{geographyOptions.map((option) => (
														<Select.Option
															key={option.value}
															value={option.value}
															label={option.label}
														>
															{option.label}
														</Select.Option>
													))}
												</Select.Dropdown>
											</Select>
										</Field>
									)}
								</form.AppField>
								{profile[field] === "other" && isCountryOfActivity && (
									<form.AppField
										name="kycProfile.countryOfActivityBreakdown"
										validators={{
											onBlur: countryActivityBreakdownSchema,
										}}
									>
										{(breakdownField) => {
											const invalid =
												breakdownField.state.meta.isTouched &&
												breakdownField.state.meta.errorMap.onBlur !== undefined;

											return (
												<CountryActivityBreakdown
													invalid={invalid}
													value={breakdownField.state.value}
													onValueChange={(value) => {
														breakdownField.handleChange(value);
														breakdownField.handleBlur();
													}}
												/>
											);
										}}
									</form.AppField>
								)}
								{profile[field] === "other" && !isCountryOfActivity && (
									<form.AppField name={`kycProfile.${countryListField}`}>
										{(countryField) => (
											<CountryMultiSelect
												id={countryField.name}
												label={t("field.countrySelection")}
												value={countryField.state.value}
												onValueChange={(value) => {
													countryField.handleChange(value);
													countryField.handleBlur();
												}}
											/>
										)}
									</form.AppField>
								)}
							</div>
						);
					})}
				</section>
			)}
		</form.Subscribe>
	);
}
