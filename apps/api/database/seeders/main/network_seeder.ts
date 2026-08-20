import { BaseSeeder } from "@adonisjs/lucid/seeders";

import Network from "#models/network";

export default class NetworkSeeder extends BaseSeeder {
	static environment = ["manual"];

	async run() {
		await Network.updateOrCreate(
			{ name: "Réseau de démonstration" },
			{
				name: "Réseau de démonstration",
				amundiOrgId: "EPARTIM-DEMO-NETWORK",
				addressId: null,
				goCode: 100_000,
				paymentDetailsId: null,
			},
		);
	}
}
