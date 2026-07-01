import { BaseSeeder } from "@adonisjs/lucid/seeders";

import ProjectSeeder from "#database/seeders/main/project_seeder";
import UserSeeder from "#database/seeders/main/user_seeder";

export default class extends BaseSeeder {
	static environment = ["development"];

	async run() {
		for (const Seeder of [ProjectSeeder, UserSeeder]) {
			await new Seeder(this.client).run();
		}
	}
}
