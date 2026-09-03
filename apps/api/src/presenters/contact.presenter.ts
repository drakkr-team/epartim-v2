import type Contact from "#models/contact";

export default class ContactPresenter {
	toJSON(contact: Contact) {
		return {
			id: contact.id,

			companyId: contact.companyId,
			kind: contact.kind,
			firstName: contact.firstName,
			lastName: contact.lastName,
			legalName: contact.legalName,
			function: contact.function,
			email: contact.email,
			phoneNumber: contact.phoneNumber,
			amundiPortalId: contact.amundiPortalId,
			isSignatoryOnKbis: contact.isSignatoryOnKbis,
			isSameAsLegal: contact.isSameAsLegal,
			authorizations: contact.authorizations,

			createdAt: contact.createdAt.toJSDate(),
			updatedAt: contact.updatedAt.toJSDate(),
		};
	}
}
