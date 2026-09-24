import { inject } from "@adonisjs/core";
import { HttpContext } from "@adonisjs/core/http";

import UpdateCompanyPolicy from "#features/admin/companies/policies/update.policy";
import ViewCompanyPolicy from "#features/admin/companies/policies/view.policy";
import Company from "#models/company";
import AddressPresenter from "#presenters/address.presenter";
import CompanyPresenter from "#presenters/company.presenter";
import CompanyKycProfilePresenter from "#presenters/company_kyc_profile.presenter";
import ContactPresenter from "#presenters/contact.presenter";
import FilePresenter from "#presenters/file.presenter";
import PaymentDetailPresenter from "#presenters/payment_detail.presenter";

@inject()
export default class ViewCompanyController {
	constructor(
		protected companyPresenter: CompanyPresenter,
		protected addressPresenter: AddressPresenter,
		protected paymentDetailPresenter: PaymentDetailPresenter,
		protected contactPresenter: ContactPresenter,
		protected kycProfilePresenter: CompanyKycProfilePresenter,
		protected filePresenter: FilePresenter,
	) {}

	async handle({ params, bouncer }: HttpContext) {
		await bouncer.with(ViewCompanyPolicy).authorize("handle");

		const company = await Company.findOrFail(params.companyId);
		await Promise.all([
			company.load("address"),
			company.load("paymentDetail"),
			company.load("legalAgent"),
			company.load("contacts"),
			company.load("correspondent"),
			company.load("signer"),
			company.load("kycProfile"),
			company.load("bankDetailsDocument"),
			company.load("legalAgentIdDocument"),
			company.load("companyDetailsDocument"),
			company.load("contactsStatusDocument"),
		]);

		return {
			...this.companyPresenter.toJSON(company),
			address: company.address ? this.addressPresenter.toJSON(company.address) : null,
			paymentDetail: company.paymentDetail
				? this.paymentDetailPresenter.toJSON(company.paymentDetail)
				: null,
			legalAgent: company.legalAgent ? this.contactPresenter.toJSON(company.legalAgent) : null,
			contacts: company.contacts.map(this.contactPresenter.toJSON),
			correspondent: company.correspondent
				? this.contactPresenter.toJSON(company.correspondent)
				: null,
			signer: company.signer ? this.contactPresenter.toJSON(company.signer) : null,
			kycProfile: company.kycProfile ? this.kycProfilePresenter.toJSON(company.kycProfile) : null,
			bankDetailsDocument: company.bankDetailsDocument
				? await this.filePresenter.toJSON(company.bankDetailsDocument)
				: null,
			legalAgentIdDocument: company.legalAgentIdDocument
				? await this.filePresenter.toJSON(company.legalAgentIdDocument)
				: null,
			companyDetailsDocument: company.companyDetailsDocument
				? await this.filePresenter.toJSON(company.companyDetailsDocument)
				: null,
			contactsStatusDocument: company.contactsStatusDocument
				? await this.filePresenter.toJSON(company.contactsStatusDocument)
				: null,
			meta: {
				canUpdate: await bouncer.with(UpdateCompanyPolicy).allows("handle"),
			},
		};
	}
}
