import { belongsTo } from "@adonisjs/lucid/orm";
import type { BelongsTo } from "@adonisjs/lucid/types/relations";

import { CompanyContactSchema } from "#database/schema";
import Company from "#models/company";
import Contact from "#models/contact";

export default class CompanyContact extends CompanyContactSchema {
	@belongsTo(() => Company)
	declare company: BelongsTo<typeof Company>;

	@belongsTo(() => Contact)
	declare contact: BelongsTo<typeof Contact>;
}
