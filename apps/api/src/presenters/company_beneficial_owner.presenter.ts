import type Address from "#models/address";
import type CompanyBeneficialOwner from "#models/company_beneficial_owner";
import type CompanyBeneficialOwnerRole from "#models/company_beneficial_owner_role";

export default class CompanyBeneficialOwnerPresenter {
	toJSON(owner: CompanyBeneficialOwner, address: Address, roles: CompanyBeneficialOwnerRole[]) {
		return {
			id: owner.id,
			companyId: owner.companyId,
			kind: owner.kind,
			firstName: owner.firstName,
			lastName: owner.lastName,
			legalName: owner.legalName,
			function: owner.function,
			shareholdingPercentage:
				owner.shareholdingPercentage === null || owner.shareholdingPercentage === undefined
					? null
					: Number(owner.shareholdingPercentage),
			siren: owner.siren,
			birthDate: owner.birthDate?.toISODate() ?? null,
			birthCity: owner.birthCity,
			nationality: owner.nationality,
			roles: roles.map((role) => role.role),
			address: {
				id: address.id,
				lineOne: address.lineOne,
				lineTwo: address.lineTwo,
				zip: address.zip,
				city: address.city,
			},
		};
	}
}
