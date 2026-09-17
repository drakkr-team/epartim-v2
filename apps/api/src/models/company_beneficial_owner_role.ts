import { belongsTo } from "@adonisjs/lucid/orm";
import type { BelongsTo } from "@adonisjs/lucid/types/relations";

import { CompanyBeneficialOwnerRoleSchema } from "#database/schema";
import CompanyBeneficialOwner from "#models/company_beneficial_owner";

export const CompanyBeneficialOwnerRoleCode = {
	DIRECTOR: 1,
	BENEFICIAL_OWNER: 2,
	PROXY: 3,
	SHAREHOLDER: 4,
} as const;

export type CompanyBeneficialOwnerRoleCode =
	(typeof CompanyBeneficialOwnerRoleCode)[keyof typeof CompanyBeneficialOwnerRoleCode];

export default class CompanyBeneficialOwnerRole extends CompanyBeneficialOwnerRoleSchema {
	declare role: CompanyBeneficialOwnerRoleCode;

	@belongsTo(() => CompanyBeneficialOwner)
	declare companyBeneficialOwner: BelongsTo<typeof CompanyBeneficialOwner>;
}
