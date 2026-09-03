import { belongsTo, hasMany } from "@adonisjs/lucid/orm";
import type { BelongsTo, HasMany } from "@adonisjs/lucid/types/relations";

import { CompanySchema } from "#database/schema";
import Address from "#models/address";
import CompanyContact from "#models/company_contact";
import Contact from "#models/contact";
import PaymentDetail from "#models/payment_detail";
import Subscription from "#models/subscription";

export const CompanyLegalForm = {
	ASSOCIATION: 1,
	EARL: 2,
	GAEC: 3,
	GIE: 4,
	SA: 5,
	SARL: 6,
	SAS: 7,
	SELARL: 8,
	ANONYMOUS_COMPANY: 9,
	CIVIL_COMPANY: 10,
	SPFPL: 11,
	COOPERATIVE_COMPANY: 12,
	FOREIGN_LAW_COMPANY: 13,
	SNC: 14,
	SCF: 15,
	SOLE_PROPRIETORSHIP: 16,
	LIBERAL_PROFESSION: 17,
	INSURANCE_OR_MUTUAL: 18,
	UNION: 19,
	FINANCIAL_OR_BANKING_INSTITUTION: 20,
	PUBLIC_BODY: 21,
	LOCAL_PUBLIC_ESTABLISHMENT_EPIC: 22,
	LOCAL_PUBLIC_ESTABLISHMENT_PERSONALIZED_REGIE: 23,
	OTHER: 24,
} as const;

export type CompanyLegalForm = (typeof CompanyLegalForm)[keyof typeof CompanyLegalForm];

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
