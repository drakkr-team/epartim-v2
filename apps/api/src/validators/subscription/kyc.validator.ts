import vine from "@vinejs/vine";

import { CompanyBeneficialOwnerKind } from "#models/company_beneficial_owner";
import { CompanyBeneficialOwnerRoleCode } from "#models/company_beneficial_owner_role";
import { CompanyKycGeography } from "#models/company_kyc_profile";

const OwnerKinds = Object.values(CompanyBeneficialOwnerKind);
const OwnerRoles = Object.values(CompanyBeneficialOwnerRoleCode);
const Geographies = Object.values(CompanyKycGeography);

const validCountryActivityBreakdown = vine.createRule((value, _, field) => {
	if (!Array.isArray(value)) return;

	const countries = value.flatMap((entry) => {
		if (typeof entry !== "object" || entry === null || !("country" in entry)) return [];

		return typeof entry.country === "string" ? [entry.country] : [];
	});
	if (new Set(countries).size !== countries.length) {
		field.report("Chaque pays ne peut être sélectionné qu'une fois.", "distinct", field);
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

const AddressSchema = vine.object({
	lineOne: optionalText(254),
	zip: vine
		.string()
		.trim()
		.regex(/^\d{5}$/)
		.nullable()
		.optional(),
	city: optionalText(254),
});

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

export const UpdateKycOwnerSchema = vine.object({
	owner: vine.object({
		kind: vine.enum(OwnerKinds).optional(),
		firstName: optionalText(100),
		lastName: optionalText(100),
		legalName: optionalText(),
		function: optionalText(),
		shareholdingPercentage: vine.number().min(0).max(100).nullable().optional(),
		siren: vine
			.string()
			.trim()
			.regex(/^\d{9}$/)
			.nullable()
			.optional(),
		birthDate: vine
			.string()
			.trim()
			.regex(/^\d{4}-\d{2}-\d{2}$/)
			.nullable()
			.optional(),
		birthCity: optionalText(100),
		nationality: vine
			.string()
			.trim()
			.toUpperCase()
			.regex(/^[A-Z]{2}$/)
			.nullable()
			.optional(),
		roles: vine.array(vine.enum(OwnerRoles)).distinct().nullable().optional(),
		address: AddressSchema.partial().optional(),
	}),
});
