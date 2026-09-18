import vine from "@vinejs/vine";

import { CompanyKycGeography } from "#models/company_kyc_profile";

const Geographies = Object.values(CompanyKycGeography);

const validCountryActivityBreakdown = vine.createRule((value, _, field) => {
	if (!Array.isArray(value)) return;

	const countries = value.flatMap((entry) => {
		if (typeof entry !== "object" || entry === null || !("country" in entry)) return [];

		return typeof entry.country === "string" ? [entry.country] : [];
	});
	if (new Set(countries).size !== countries.length) {
		field.report("Chaque pays ne peut être sélectionné qu’une fois.", "distinct", field);
	}
	const total = value.reduce((sum, entry) => {
		if (typeof entry !== "object" || entry === null || !("percentage" in entry)) return sum;

		return typeof entry.percentage === "number" ? sum + entry.percentage : sum;
	}, 0);
	if (Math.abs(total - 100) >= 0.001) {
		field.report("La répartition doit totaliser 100 %.", "countryActivityTotal", field);
	}
});

function optionalText(maxLength = 254) {
	return vine.string().trim().minLength(1).maxLength(maxLength).nullable().optional();
}

function optionalCountryList() {
	return vine
		.array(
			vine
				.string()
				.trim()
				.toUpperCase()
				.regex(/^[A-Z]{2}$/),
		)
		.minLength(1)
		.maxLength(249)
		.distinct()
		.nullable()
		.optional();
}

const KycProfileSchema = vine.object({
	regulatedActivity: vine.boolean().optional(),
	regulatedActivityReference: optionalText(),
	listedCompany: vine.boolean().optional(),
	listedCompanyReference: optionalText(),
	bicId: vine.boolean().optional(),
	bearerBondsStructure: vine.boolean().optional(),
	bearerBondsStructurePercentage: vine.number().min(0).max(100).nullable().optional(),
	countryOfActivity: vine.enum(Geographies).optional(),
	countryOfActivityBreakdown: vine
		.array(
			vine.object({
				country: vine
					.string()
					.trim()
					.toUpperCase()
					.regex(/^[A-Z]{2}$/),
				percentage: vine.number().min(0.01).max(100),
			}),
		)
		.minLength(1)
		.maxLength(249)
		.use(validCountryActivityBreakdown())
		.nullable()
		.optional(),
	countryOfActivityReference: optionalText(),
	countryProvider: vine.enum(Geographies).optional(),
	countryProviderCountries: optionalCountryList(),
	countryProviderReference: optionalText(),
	mainMarkets: vine.enum(Geographies).optional(),
	mainMarketsCountries: optionalCountryList(),
	mainMarketsReference: optionalText(),
});

export const UpdateKycProfileSchema = vine.object({
	kycProfile: KycProfileSchema.partial(),
});
