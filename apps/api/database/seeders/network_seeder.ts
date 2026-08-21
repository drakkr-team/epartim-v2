import { BaseSeeder } from "@adonisjs/lucid/seeders";

import { FirmFactory } from "#database/factories/firm.factory";
import { NetworkFactory } from "#database/factories/network.factory";

export default class extends BaseSeeder {
	static environment = ["development"];

	async run() {
		const networks = await NetworkFactory.with("address").with("paymentDetails").createMany(10);

		for (const network of networks) {
			await FirmFactory.merge({ networkId: network.id })
				.with("address")
				.with("paymentDetails")
				.createMany(2);
		}
	}
}
