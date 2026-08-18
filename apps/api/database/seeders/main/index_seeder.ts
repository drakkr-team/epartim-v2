import { BaseSeeder } from "@adonisjs/lucid/seeders";

import AccessControlSeeder from "#database/seeders/main/access_control_seeder";
import AdminUserSeeder from "#database/seeders/main/admin_user_seeder";
import ProjectSeeder from "#database/seeders/main/project_seeder";
import UserSeeder from "#database/seeders/main/user_seeder";

export default class extends BaseSeeder {
	static environment = ["development"];

	async run() {
		for (const Seeder of [ProjectSeeder, AccessControlSeeder, AdminUserSeeder, UserSeeder]) {
			await new Seeder(this.client).run();
		}
	}
}
