import { belongsTo, column } from "@adonisjs/lucid/orm";
import type { BelongsTo } from "@adonisjs/lucid/types/relations";

import { CompanyKycProfileSchema } from "#database/schema";
import Company from "#models/company";

export const CompanyKycGeography = {
	FRANCE_AND_EU: "france_and_eu",
	OTHER: "other",
} as const;

export type CompanyKycGeography = (typeof CompanyKycGeography)[keyof typeof CompanyKycGeography];

export type CountryActivity = { country: string; percentage: number };

function jsonColumn<T>() {
	return {
		prepare: (value: T | null) => (value === null ? null : JSON.stringify(value)),
		consume: (value: T | null) => value,
	};
}

export default class CompanyKycProfile extends CompanyKycProfileSchema {
	declare countryOfActivity: CompanyKycGeography;

	@column(jsonColumn<CountryActivity[]>())
	declare countryOfActivityBreakdown: CountryActivity[] | null;

	declare countryProvider: CompanyKycGeography;

	@column(jsonColumn<string[]>())
	declare countryProviderCountries: string[] | null;

	declare mainMarkets: CompanyKycGeography;

	@column(jsonColumn<string[]>())
	declare mainMarketsCountries: string[] | null;

	@belongsTo(() => Company)
	declare company: BelongsTo<typeof Company>;
}
