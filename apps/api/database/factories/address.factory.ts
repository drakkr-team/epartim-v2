import factory from "@adonisjs/lucid/factories";

import Address from "#models/address";

export const AddressFactory = factory
	.define(Address, ({ faker }) => ({
		lineOne: faker.location.streetAddress(),
		lineTwo: null,
		lineThree: null,
		zip: faker.location.zipCode(),
		city: faker.location.city(),
	}))
	.build();
