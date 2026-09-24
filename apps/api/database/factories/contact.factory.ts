import factory from "@adonisjs/lucid/factories";

import {
	CONTACT_AUTHORIZATIONS,
	CONTACT_CIVILITIES,
	CONTACT_FUNCTIONS,
	CONTACT_KINDS,
} from "#constants/contact";
import Contact from "#models/contact";

export const ContactFactory = factory
	.define(Contact, ({ faker }) => {
		const firstName = faker.person.firstName();
		const lastName = faker.person.lastName();

		return {
			civility: faker.helpers.arrayElement(Object.values(CONTACT_CIVILITIES)),
			kind: CONTACT_KINDS.PERSONNE_PHYSIQUE,
			firstName,
			lastName,
			legalName: null,
			function: faker.helpers.arrayElement(Object.values(CONTACT_FUNCTIONS)),
			email: faker.internet.exampleEmail({ firstName, lastName }),
			phoneNumber: faker.phone.number({ style: "international" }),
			amundiPortalId: null,
			isSignatoryOnKbis: null,
			isSameAsLegal: null,
			authorizations: null,
		};
	})
	.state("legalEntity", (contact, { faker }) => {
		contact.kind = CONTACT_KINDS.PERSONNE_MORALE;
		contact.civility = null;
		contact.firstName = null;
		contact.lastName = null;
		contact.legalName = faker.company.name();
		contact.phoneNumber = null;
		contact.amundiPortalId = null;
		contact.isSignatoryOnKbis = null;
		contact.authorizations = null;
	})
	.state("withAuthorizations", (contact, { faker }) => {
		contact.kind = CONTACT_KINDS.PERSONNE_PHYSIQUE;
		contact.firstName ??= faker.person.firstName();
		contact.lastName ??= faker.person.lastName();
		contact.legalName = null;
		contact.phoneNumber ??= faker.phone.number({ style: "international" });
		contact.authorizations = faker.helpers.arrayElements(Object.values(CONTACT_AUTHORIZATIONS), {
			min: 1,
			max: 3,
		});
	})
	.build();
