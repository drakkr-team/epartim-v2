import { belongsTo, hasOne, manyToMany } from "@adonisjs/lucid/orm";
import type { BelongsTo, HasOne, ManyToMany } from "@adonisjs/lucid/types/relations";

import { CompanySchema } from "#database/schema";
import Address from "#models/address";
import CompanyKycProfile from "#models/company_kyc_profile";
import Contact from "#models/contact";
import File from "#models/file";
import PaymentDetail from "#models/payment_detail";
import Subscription from "#models/subscription";

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

	@belongsTo(() => Contact, { foreignKey: "companySignerId" })
	declare signer: BelongsTo<typeof Contact>;

	@hasOne(() => CompanyKycProfile)
	declare kycProfile: HasOne<typeof CompanyKycProfile>;

	@manyToMany(() => Contact, { pivotTable: "company_contacts" })
	declare contacts: ManyToMany<typeof Contact>;
}
