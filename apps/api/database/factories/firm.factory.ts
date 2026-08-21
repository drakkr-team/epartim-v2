import factory from "@adonisjs/lucid/factories";

import { AddressFactory } from "#database/factories/address.factory";
import { NetworkFactory } from "#database/factories/network.factory";
import { PaymentDetailFactory } from "#database/factories/payment_detail.factory";
import Firm from "#models/firm";

export const FirmFactory = factory
	.define(Firm, ({ faker }) => ({
		name: faker.company.name(),
		amundiOrgId: faker.string.alphanumeric(12).toUpperCase(),
		addressId: faker.number.int({ min: 1, max: 999_999 }),
		orias: faker.string.numeric(8),
	}))
	.relation("address", () => AddressFactory)
	.relation("network", () => NetworkFactory)
	.relation("paymentDetails", () => PaymentDetailFactory)
	.build();
