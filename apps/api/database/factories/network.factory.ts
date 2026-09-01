import factory from "@adonisjs/lucid/factories";

import { AddressFactory } from "#database/factories/address.factory";
import { PaymentDetailFactory } from "#database/factories/payment_detail.factory";
import Network from "#models/network";

export const NetworkFactory = factory
	.define(Network, ({ faker }) => ({
		name: faker.company.name(),
		amundiOrgId: faker.helpers.maybe(() => faker.string.alphanumeric(12).toUpperCase()),
		goCode: faker.helpers.maybe(() => faker.number.int({ min: 100_000, max: 999_999 })),
	}))
	.relation("address", () => AddressFactory)
	.relation("paymentDetail", () => PaymentDetailFactory)
	.build();
