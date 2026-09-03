import { belongsTo, hasMany } from "@adonisjs/lucid/orm";
import type { BelongsTo, HasMany } from "@adonisjs/lucid/types/relations";

import { ContactSchema } from "#database/schema";
import Company from "#models/company";
import CompanyContact from "#models/company_contact";

export const ContactFunction = {
	CEO: 1,
	MANAGER: 2,
	GENERAL_MANAGER: 3,
	FINANCE_DIRECTOR: 4,
	ADMINISTRATIVE_AND_FINANCE_DIRECTOR: 5,
	ACCOUNTING_MANAGER: 6,
	HUMAN_RESOURCES_DIRECTOR: 7,
	HUMAN_RESOURCES: 8,
	ASSISTANT: 9,
	ES_OPERATIONAL_CORRESPONDENT: 10,
	PRESIDENT: 11,
	LEGAL_REPRESENTATIVE: 12,
	OTHER: 13,
} as const;

export type ContactFunction = (typeof ContactFunction)[keyof typeof ContactFunction];

export default class Contact extends ContactSchema {
	@belongsTo(() => Company)
	declare company: BelongsTo<typeof Company>;

	@hasMany(() => CompanyContact)
	declare companyContacts: HasMany<typeof CompanyContact>;
}
