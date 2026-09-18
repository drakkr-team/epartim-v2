import { BaseSeeder } from "@adonisjs/lucid/seeders";

import { AdminFactory } from "#database/factories/admin.factory";
import Role from "#models/role";

export default class extends BaseSeeder {
	static environment = ["development"];

	async run() {
		const roles = await Role.all();

		await AdminFactory.tap(
			(admin, { faker }) => (admin.roleId = faker.helpers.arrayElement(roles).id),
		).createMany(100);
	}
}
