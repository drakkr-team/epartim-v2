import { belongsTo } from "@adonisjs/lucid/orm";
import type { BelongsTo } from "@adonisjs/lucid/types/relations";

import { CompanyKycProfileSchema } from "#database/schema";
import Company from "#models/company";

export const CompanyKycGeography = {
	FRANCE_AND_EU: "france_and_eu",
	OTHER: "other",
} as const;

export type CompanyKycGeography = (typeof CompanyKycGeography)[keyof typeof CompanyKycGeography];

export default class CompanyKycProfile extends CompanyKycProfileSchema {
	declare countryOfActivity: CompanyKycGeography;

	declare countryProvider: CompanyKycGeography;

	declare mainMarkets: CompanyKycGeography;

	@belongsTo(() => Company)
	declare company: BelongsTo<typeof Company>;
}
