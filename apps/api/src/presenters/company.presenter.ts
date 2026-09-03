import type Company from "#models/company";

export default class CompanyPresenter {
	toJSON(company: Company) {
		return {
			id: company.id,

			subscriptionId: company.subscriptionId,
			addressId: company.addressId,
			paymentDetailId: company.paymentDetailId,
			companyLegalAgentId: company.companyLegalAgentId,
			companyCorrespondentId: company.companyCorrespondentId,

			siret: company.siret,
			siren: company.siren,
			naf: company.naf,
			name: company.name,
			legalForm: company.legalForm,
			companyHeadcount: company.companyHeadcount,
			vatNumber: company.vatNumber,
			financialYearClosingDay: company.financialYearClosingDay,

			createdAt: company.createdAt.toJSDate(),
			updatedAt: company.updatedAt.toJSDate(),
		};
	}
}
