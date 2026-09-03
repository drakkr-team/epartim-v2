import factory from "@adonisjs/lucid/factories";

import { CompanyFactory } from "#database/factories/company.factory";
import Contact, { ContactFunction } from "#models/contact";

const contactKinds = [
	"legal_representative",
	"signatory",
	"company_correspondent",
	"amundi_authorization",
] as const;

const authorizationCodes = ["ACCOUNTANT", "ACT_AND_VIEW", "ADMINISTER"] as const;

export const ContactFactory = factory
	.define(Contact, ({ faker }) => {
		const firstName = faker.person.firstName();
		const lastName = faker.person.lastName();

		return {
			kind: faker.helpers.arrayElement(contactKinds),
			firstName,
			lastName,
			function: faker.helpers.arrayElement(Object.values(ContactFunction)),
			email: faker.internet.exampleEmail({ firstName, lastName }),
			phoneNumber: faker.phone.number({ style: "international" }),
			amundiPortalId: faker.helpers.maybe(() => faker.string.alphanumeric(12).toUpperCase()),
			isSignatoryOnKbis: faker.datatype.boolean(),
			isSameAsLegal: faker.datatype.boolean(),
			authorizations: faker.helpers.arrayElements(authorizationCodes),
		};
	})
	.relation("company", () => CompanyFactory)
	.build();
