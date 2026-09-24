import { belongsTo } from "@adonisjs/lucid/orm";
import type { BelongsTo } from "@adonisjs/lucid/types/relations";

import type { CompanyBeneficialOwnerRoleCode } from "#constants/company_beneficial_owner_role";
import { CompanyBeneficialOwnerRoleSchema } from "#database/schema";
import CompanyBeneficialOwner from "#models/company_beneficial_owner";

export default class CompanyBeneficialOwnerRole extends CompanyBeneficialOwnerRoleSchema {
	declare role: CompanyBeneficialOwnerRoleCode;

	@belongsTo(() => CompanyBeneficialOwner)
	declare companyBeneficialOwner: BelongsTo<typeof CompanyBeneficialOwner>;
}
