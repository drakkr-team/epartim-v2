import factory from "@adonisjs/lucid/factories";

import { CompanyFactory } from "#database/factories/company.factory";
import Contact, { ContactAuthorization, ContactFunction, ContactKind } from "#models/contact";

export const ContactFactory = factory
	.define(Contact, ({ faker }) => {
		const firstName = faker.person.firstName();
		const lastName = faker.person.lastName();
		const kind = faker.helpers.arrayElement(Object.values(ContactKind));

		return {
			kind,
			firstName: kind === ContactKind.PERSONNE_PHYSIQUE ? firstName : null,
			lastName: kind === ContactKind.PERSONNE_PHYSIQUE ? lastName : null,
			legalName: kind === ContactKind.PERSONNE_MORALE ? faker.company.name() : null,
			function: faker.helpers.arrayElement(Object.values(ContactFunction)),
			email: faker.internet.exampleEmail({ firstName, lastName }),
			phoneNumber:
				kind === ContactKind.PERSONNE_PHYSIQUE
					? faker.phone.number({ style: "international" })
					: null,
			amundiPortalId:
				kind === ContactKind.PERSONNE_PHYSIQUE
					? faker.helpers.maybe(() => faker.string.alphanumeric(12).toUpperCase())
					: null,
			isSignatoryOnKbis: kind === ContactKind.PERSONNE_PHYSIQUE ? faker.datatype.boolean() : null,
			isSameAsLegal: faker.datatype.boolean(),
			authorizations:
				kind === ContactKind.PERSONNE_PHYSIQUE
					? faker.helpers.arrayElements(Object.values(ContactAuthorization))
					: null,
		};
	})
	.relation("company", () => CompanyFactory)
	.build();
