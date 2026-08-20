import { BaseSeeder } from "@adonisjs/lucid/seeders";

import Address from "#models/address";
import Firm from "#models/firm";
import Network from "#models/network";

export default class FirmSeeder extends BaseSeeder {
	static environment = ["manual"];

	async run() {
		const network = await Network.findByOrFail("name", "Réseau de démonstration");
		const address = await Address.findByOrFail("zip", "75002");

		await Firm.updateOrCreate(
			{ name: "Cabinet de démonstration" },
			{
				networkId: network.id,
				name: "Cabinet de démonstration",
				amundiOrgId: "EPARTIM-DEMO-FIRM",
				addressId: address.id,
				bic: "AGRIFRPP",
				iban: "FR7630006000011234567890189",
				orias: "00000000",
				paymentDetailsId: null,
			},
		);
	}
}
