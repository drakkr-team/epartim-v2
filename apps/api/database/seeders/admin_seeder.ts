import { BaseSeeder } from "@adonisjs/lucid/seeders";

import { AdminFactory } from "#database/factories/admin.factory";
import Role from "#models/role";

export default class extends BaseSeeder {
	static environment = ["development"];

	async run() {
		const roles = await Role.all();

		const AdminsPromises = Array(100)
			.fill(null)
			.map(async () => {
				const role = roles[Math.floor(Math.random() * roles.length)];
				await AdminFactory.merge({ roleId: role.id }).create();
			});

		await Promise.all(AdminsPromises);
	}
}
