import factory from "@adonisjs/lucid/factories";

import { CompanyFactory } from "#database/factories/company.factory";
import Contact, { ContactAuthorization, ContactFunction, ContactKind } from "#models/contact";

export const ContactFactory = factory
	.define(Contact, ({ faker }) => {
		const firstName = faker.person.firstName();
		const lastName = faker.person.lastName();

		return {
			kind: faker.helpers.arrayElement(Object.values(ContactKind)),
			firstName,
			lastName,
			function: faker.helpers.arrayElement(Object.values(ContactFunction)),
			email: faker.internet.exampleEmail({ firstName, lastName }),
			phoneNumber: faker.phone.number({ style: "international" }),
			amundiPortalId: faker.helpers.maybe(() => faker.string.alphanumeric(12).toUpperCase()),
			isSignatoryOnKbis: faker.datatype.boolean(),
			isSameAsLegal: faker.datatype.boolean(),
			authorizations: faker.helpers.arrayElements(Object.values(ContactAuthorization)),
		};
	})
	.relation("company", () => CompanyFactory)
	.build();
