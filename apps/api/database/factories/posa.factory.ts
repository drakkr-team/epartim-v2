import factory from "@adonisjs/lucid/factories";
import { DateTime } from "luxon";

import { POSA_DEVICE_TYPES, POSA_FUNDS } from "#constants/posa";
import { CompanyFactory } from "#database/factories/company.factory";
import Posa from "#models/posa";

export const PosaFactory = factory
	.define(Posa, ({ faker }) => {
		return {
			valuationDate: DateTime.fromJSDate(faker.date.anytime()),
			deviceCode: faker.string.uuid(),
			deviceType: faker.helpers.arrayElement(Object.values(POSA_DEVICE_TYPES)),
			fund: faker.helpers.arrayElement(Object.values(POSA_FUNDS)),
			rate: 0,
			availableShares: 0,
			unavailableShares: 0,
		};
	})
	.relation("company", () => CompanyFactory)
	.build();
