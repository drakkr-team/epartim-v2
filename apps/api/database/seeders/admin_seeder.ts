import { BaseSeeder } from "@adonisjs/lucid/seeders";

import { AdminFactory } from "#database/factories/admin.factory";

export default class extends BaseSeeder {
	static environment = ["development"];

	async run() {
		await AdminFactory.createMany(100);
	}
}
