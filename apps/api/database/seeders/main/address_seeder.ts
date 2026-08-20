import { BaseSeeder } from "@adonisjs/lucid/seeders";

import Address from "#models/address";

export default class AddressSeeder extends BaseSeeder {
	static environment = ["manual"];

	async run() {
		await Address.updateOrCreate(
			{ lineOne: "1 rue de la Paix", zip: "75002", city: "Paris" },
			{
				lineOne: "1 rue de la Paix",
				lineTwo: null,
				lineThree: null,
				zip: "75002",
				city: "Paris",
			},
		);
	}
}
