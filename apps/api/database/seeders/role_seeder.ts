import { BaseSeeder } from "@adonisjs/lucid/seeders";

import { RoleFactory } from "#database/factories/role.factory";
import Role from "#models/role";

export default class extends BaseSeeder {
	static environment = ["development"];

	async run() {
		await Role.firstOrCreate(
			{ name: "Super Administrateur" },
			{ isSuperAdmin: true, authorizations: [] },
		);
		await RoleFactory.createMany(5);
	}
}
