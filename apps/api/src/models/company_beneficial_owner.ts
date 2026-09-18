import { belongsTo, hasMany } from "@adonisjs/lucid/orm";
import type { BelongsTo, HasMany } from "@adonisjs/lucid/types/relations";

import { CompanyBeneficialOwnerSchema } from "#database/schema";
import Address from "#models/address";
import Company from "#models/company";
import CompanyBeneficialOwnerRole from "#models/company_beneficial_owner_role";

export const CompanyBeneficialOwnerKind = {
	PHYSICAL_PERSON: 1,
	LEGAL_ENTITY: 2,
} as const;

export type CompanyBeneficialOwnerKind =
	(typeof CompanyBeneficialOwnerKind)[keyof typeof CompanyBeneficialOwnerKind];

export default class CompanyBeneficialOwner extends CompanyBeneficialOwnerSchema {
	declare kind: CompanyBeneficialOwnerKind;

	@belongsTo(() => Company)
	declare company: BelongsTo<typeof Company>;

	@belongsTo(() => Address)
	declare address: BelongsTo<typeof Address>;

	@hasMany(() => CompanyBeneficialOwnerRole)
	declare roles: HasMany<typeof CompanyBeneficialOwnerRole>;
}
