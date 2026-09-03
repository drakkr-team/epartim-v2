import { belongsTo, column, hasMany } from "@adonisjs/lucid/orm";
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

export const ContactKind = {
	PHYSICAL: "physical",
	LEGAL: "legal",
} as const;

export type ContactKind = (typeof ContactKind)[keyof typeof ContactKind];

export const ContactAuthorization = {
	ACCOUNTANT: "ACCOUNTANT",
	ACT_AND_VIEW: "ACT_AND_VIEW",
	ADMINISTER: "ADMINISTER",
} as const;

export type ContactAuthorization = (typeof ContactAuthorization)[keyof typeof ContactAuthorization];

export default class Contact extends ContactSchema {
	declare kind: ContactKind | null;

	@column({
		prepare: (authorizations: ContactAuthorization[] | null) =>
			authorizations === null ? null : JSON.stringify(authorizations),
		consume: (authorizations: ContactAuthorization[] | null) => authorizations,
	})
	declare authorizations: ContactAuthorization[] | null;

	@belongsTo(() => Company)
	declare company: BelongsTo<typeof Company>;

	@hasMany(() => CompanyContact)
	declare companyContacts: HasMany<typeof CompanyContact>;
}
