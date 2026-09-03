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
	SOCIETE_ANONYME: 9,
	SOCIETE_CIVILE: 10,
	SPFPL: 11,
	SOCIETE_COOPERATIVE: 12,
	SOCIETE_DE_DROIT_ETRANGER: 13,
	SNC: 14,
	SCF: 15,
	ENTREPRISE_INDIVIDUELLE: 16,
	PROFESSION_LIBERALE: 17,
	ENTREPRISE_ASSURANCES_OU_MUTUELLE_CODE_ASSURANCES: 18,
	SYNDICAT: 19,
	INSTITUTION_FINANCIERE_OU_BANCAIRE: 20,
	ORGANISME_PUBLIC: 21,
	ETABLISSEMENT_PUBLIC_LOCAL_EPIC: 22,
	ETABLISSEMENTS_PUBLICS_LOCAUX_REGIE_PERSONNALISEE: 23,
	AUTRES: 24,
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
