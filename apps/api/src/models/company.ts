import { belongsTo, hasMany } from "@adonisjs/lucid/orm";
import type { BelongsTo, HasMany } from "@adonisjs/lucid/types/relations";

import { CompanySchema } from "#database/schema";
import Address from "#models/address";
import CompanyContact from "#models/company_contact";
import Contact from "#models/contact";
import PaymentDetail from "#models/payment_detail";
import Subscription from "#models/subscription";

export default class Company extends CompanySchema {
	@belongsTo(() => Subscription)
	declare subscription: BelongsTo<typeof Subscription>;

	@belongsTo(() => Address)
	declare address: BelongsTo<typeof Address>;

	@belongsTo(() => PaymentDetail)
	declare paymentDetail: BelongsTo<typeof PaymentDetail>;

	@belongsTo(() => Contact, { foreignKey: "companyLegalAgentId" })
	declare legalAgent: BelongsTo<typeof Contact>;

	@hasMany(() => Contact)
	declare contacts: HasMany<typeof Contact>;

	@hasMany(() => CompanyContact)
	declare companyContacts: HasMany<typeof CompanyContact>;
}
