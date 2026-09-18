import { BaseSeeder } from "@adonisjs/lucid/seeders";

import { RoleFactory } from "#database/factories/role.factory";

export default class extends BaseSeeder {
	static environment = ["development"];

	async run() {
		await RoleFactory.createMany(5);
	}
}
