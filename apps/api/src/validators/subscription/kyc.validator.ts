import vine from "@vinejs/vine";

import { CompanyBeneficialOwnerKind } from "#models/company_beneficial_owner";
import { CompanyBeneficialOwnerRoleCode } from "#models/company_beneficial_owner_role";
import { CompanyKycGeography } from "#models/company_kyc_profile";

const OwnerKinds = Object.values(CompanyBeneficialOwnerKind);
const OwnerRoles = Object.values(CompanyBeneficialOwnerRoleCode);
const Geographies = Object.values(CompanyKycGeography);

function optionalText(maxLength = 254) {
	return vine.string().trim().minLength(1).maxLength(maxLength).nullable().optional();
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
	countryOfActivityReference: optionalText(),
	countryProvider: vine.enum(Geographies).optional(),
	countryProviderReference: optionalText(),
	mainMarkets: vine.enum(Geographies).optional(),
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
