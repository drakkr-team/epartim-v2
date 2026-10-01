import factory from "@adonisjs/lucid/factories";

import CommissionRate from "#models/commission_rate";

export const CommissionRateFactory = factory
	.define(CommissionRate, ({ faker }) => {
		return {
			shortTermRatePercent: faker.number.float({ min: 0, max: 100, fractionDigits: 2 }),
			mediumTermRatePercent: faker.number.float({ min: 0, max: 100, fractionDigits: 2 }),
			longTermRatePercent: faker.number.float({ min: 0, max: 100, fractionDigits: 2 }),
		};
	})
	.build();
