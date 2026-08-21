import factory from "@adonisjs/lucid/factories";

import Address from "#models/address";

export const AddressFactory = factory
	.define(Address, ({ faker }) => ({
		lineOne: faker.location.streetAddress(),
		lineTwo: faker.location.secondaryAddress(),
		zip: faker.location.zipCode(),
		city: faker.location.city(),
		coordinates: {
			latitude: Number(faker.location.latitude()),
			longitude: Number(faker.location.longitude()),
		},
	}))
	.build();
