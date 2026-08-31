import factory from "@adonisjs/lucid/factories";

import Address from "#models/address";

export const AddressFactory = factory
	.define(Address, ({ faker }) => ({
		lineOne: faker.location.streetAddress(),
		lineTwo: faker.helpers.maybe(() => faker.location.secondaryAddress()),
		zip: faker.location.zipCode(),
		city: faker.location.city(),
		coordinates: {
			latitude: faker.location.latitude(),
			longitude: faker.location.longitude(),
		},
	}))
	.build();
