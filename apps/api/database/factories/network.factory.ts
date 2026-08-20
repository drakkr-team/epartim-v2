import factory from "@adonisjs/lucid/factories";

import { AddressFactory } from "#database/factories/address.factory";
import Network from "#models/network";

export const NetworkFactory = factory
	.define(Network, ({ faker }) => ({
		name: faker.company.name(),
		amundiOrgId: faker.string.alphanumeric(12).toUpperCase(),
		addressId: null,
		goCode: faker.number.int({ min: 100_000, max: 999_999 }),
		paymentDetailsId: null,
	}))
	.relation("address", () => AddressFactory)
	.build();
