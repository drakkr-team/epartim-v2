import factory from "@adonisjs/lucid/factories";

import { AddressFactory } from "#database/factories/address.factory";
import { CommissionRateFactory } from "#database/factories/commission_rate.factory";
import { NetworkFactory } from "#database/factories/network.factory";
import { PaymentDetailFactory } from "#database/factories/payment_detail.factory";
import Firm from "#models/firm";

export const FirmFactory = factory
	.define(Firm, ({ faker }) => ({
		name: `${faker.company.name()} ${faker.string.uuid()}`,
		amundiOrgId: faker.helpers.maybe(() => faker.string.alphanumeric(12).toUpperCase()),
		orias: faker.string.numeric(8),
	}))
	.relation("address", () => AddressFactory)
	.relation("network", () => NetworkFactory)
	.relation("paymentDetail", () => PaymentDetailFactory)
	.relation("commissionRate", () => CommissionRateFactory)
	.build();
