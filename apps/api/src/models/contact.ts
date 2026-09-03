import { belongsTo, hasMany } from "@adonisjs/lucid/orm";
import type { BelongsTo, HasMany } from "@adonisjs/lucid/types/relations";

import { ContactSchema } from "#database/schema";
import Company from "#models/company";
import CompanyContact from "#models/company_contact";

export default class Contact extends ContactSchema {
	@belongsTo(() => Company)
	declare company: BelongsTo<typeof Company>;

	@hasMany(() => CompanyContact)
	declare companyContacts: HasMany<typeof CompanyContact>;
}
