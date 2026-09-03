import factory from "@adonisjs/lucid/factories";

import { AddressFactory } from "#database/factories/address.factory";
import { PaymentDetailFactory } from "#database/factories/payment_detail.factory";
import { SubscriptionFactory } from "#database/factories/subscription.factory";
import Company, { CompanyLegalForm } from "#models/company";

export const CompanyFactory = factory
	.define(Company, ({ faker }) => ({
		siret: faker.string.numeric(14),
		siren: faker.string.numeric(9),
		naf: `${faker.string.numeric(4)}${faker.string.alpha({ length: 1 }).toUpperCase()}`,
		name: faker.company.name(),
		legalForm: faker.helpers.arrayElement(Object.values(CompanyLegalForm)),
		companyHeadcount: faker.number.int({ min: 1, max: 500 }).toString(),
		vatNumber: `FR${faker.string.numeric(2)}${faker.string.numeric(9)}`,
		financialYearClosingDay: "31/12",
	}))
	.relation("subscription", () => SubscriptionFactory)
	.relation("address", () => AddressFactory)
	.relation("paymentDetail", () => PaymentDetailFactory)
	.build();
