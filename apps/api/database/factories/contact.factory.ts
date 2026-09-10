import factory from "@adonisjs/lucid/factories";

import Contact, { ContactAuthorization, ContactFunction, ContactKind } from "#models/contact";

export const ContactFactory = factory
	.define(Contact, ({ faker }) => {
		const firstName = faker.person.firstName();
		const lastName = faker.person.lastName();

		return {
			kind: ContactKind.PERSONNE_PHYSIQUE,
			firstName,
			lastName,
			legalName: null,
			function: faker.helpers.arrayElement(Object.values(ContactFunction)),
			email: faker.internet.exampleEmail({ firstName, lastName }),
			phoneNumber: faker.phone.number({ style: "international" }),
			amundiPortalId: null,
			isSignatoryOnKbis: null,
			isSameAsLegal: null,
			authorizations: null,
		};
	})
	.state("legalEntity", (contact, { faker }) => {
		contact.kind = ContactKind.PERSONNE_MORALE;
		contact.firstName = null;
		contact.lastName = null;
		contact.legalName = faker.company.name();
		contact.phoneNumber = null;
		contact.amundiPortalId = null;
		contact.isSignatoryOnKbis = null;
		contact.authorizations = null;
	})
	.state("withAuthorizations", (contact, { faker }) => {
		contact.kind = ContactKind.PERSONNE_PHYSIQUE;
		contact.firstName ??= faker.person.firstName();
		contact.lastName ??= faker.person.lastName();
		contact.legalName = null;
		contact.phoneNumber ??= faker.phone.number({ style: "international" });
		contact.authorizations = faker.helpers.arrayElements(Object.values(ContactAuthorization), {
			min: 1,
			max: 3,
		});
	})
	.build();
