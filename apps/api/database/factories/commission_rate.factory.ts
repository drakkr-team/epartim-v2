import factory from "@adonisjs/lucid/factories";

import CommissionRate from "#models/commission_rate";

export const CommissionRateFactory = factory
	.define(CommissionRate, ({ faker }) => {
		return {
			shortTermCommissionRate: faker.number.float({ min: 0, max: 100, fractionDigits: 2 }),
			mediumTermCommissionRate: faker.number.float({ min: 0, max: 100, fractionDigits: 2 }),
			longTermCommissionRate: faker.number.float({ min: 0, max: 100, fractionDigits: 2 }),
		};
	})
	.build();
