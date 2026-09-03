import type CompanyContact from "#models/company_contact";

export default class CompanyContactPresenter {
	toJSON(companyContact: CompanyContact) {
		return {
			id: companyContact.id,

			companyId: companyContact.companyId,
			contactId: companyContact.contactId,
		};
	}
}
