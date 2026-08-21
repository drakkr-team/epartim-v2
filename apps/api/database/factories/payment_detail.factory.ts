import factory from "@adonisjs/lucid/factories";

import PaymentDetail from "#models/payment_detail";

export const PaymentDetailFactory = factory
	.define(PaymentDetail, ({ faker }) => ({
		iban: faker.finance.iban({ countryCode: "FR" }),
		bic: faker.finance.bic(),
	}))
	.build();
