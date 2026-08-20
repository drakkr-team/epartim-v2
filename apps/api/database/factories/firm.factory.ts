import factory from "@adonisjs/lucid/factories";

import { AddressFactory } from "#database/factories/address.factory";
import Firm from "#models/firm";

export const FirmFactory = factory
	.define(Firm, ({ faker }) => ({
		networkId: null,
		name: faker.company.name(),
		amundiOrgId: faker.string.alphanumeric(12).toUpperCase(),
		addressId: faker.number.int({ min: 1, max: 999_999 }),
		bic: faker.finance.bic(),
		iban: faker.finance.iban({ countryCode: "FR" }),
		orias: faker.string.numeric(8),
		paymentDetailsId: null,
	}))
	.relation("address", () => AddressFactory)
	.build();
