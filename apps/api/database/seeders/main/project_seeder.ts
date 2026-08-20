import { BaseSeeder } from "@adonisjs/lucid/seeders";

import AddressSeeder from "#database/seeders/main/address_seeder";
import FirmSeeder from "#database/seeders/main/firm_seeder";
import NetworkSeeder from "#database/seeders/main/network_seeder";

export default class ProjectSeeder extends BaseSeeder {
	static environment = ["manual"];

	async run() {
		for (const Seeder of [AddressSeeder, NetworkSeeder, FirmSeeder]) {
			await new Seeder(this.client).run();
		}
	}
}
