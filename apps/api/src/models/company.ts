import { belongsTo, manyToMany } from "@adonisjs/lucid/orm";
import type { BelongsTo, ManyToMany } from "@adonisjs/lucid/types/relations";

import { CompanySchema } from "#database/schema";
import Address from "#models/address";
import Contact from "#models/contact";
import File from "#models/file";
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

	@belongsTo(() => File, { foreignKey: "bankDetailsDocumentId" })
	declare bankDetailsDocument: BelongsTo<typeof File>;

	@belongsTo(() => File, { foreignKey: "companyDetailsDocumentId" })
	declare companyDetailsDocument: BelongsTo<typeof File>;

	@belongsTo(() => File, { foreignKey: "legalAgentIdDocumentId" })
	declare legalAgentIdDocument: BelongsTo<typeof File>;

	@belongsTo(() => File, { foreignKey: "contactsStatusDocumentId" })
	declare contactsStatusDocument: BelongsTo<typeof File>;

	@belongsTo(() => Contact, { foreignKey: "companyLegalAgentId" })
	declare legalAgent: BelongsTo<typeof Contact>;

	@belongsTo(() => Contact, { foreignKey: "companyCorrespondentId" })
	declare correspondent: BelongsTo<typeof Contact>;

	@manyToMany(() => Contact, { pivotTable: "company_contacts" })
	declare contacts: ManyToMany<typeof Contact>;
}
