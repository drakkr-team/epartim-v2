import factory from "@adonisjs/lucid/factories";

import { CompanyFactory } from "#database/factories/company.factory";
import { ContactFactory } from "#database/factories/contact.factory";
import CompanyContact from "#models/company_contact";

export const CompanyContactFactory = factory
	.define(CompanyContact, () => ({}))
	.relation("company", () => CompanyFactory)
	.relation("contact", () => ContactFactory)
	.build();
