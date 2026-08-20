import { BaseSeeder } from "@adonisjs/lucid/seeders";

import ProjectSeeder from "#database/seeders/main/project_seeder";

export default class extends BaseSeeder {
	static environment = ["development"];

	async run() {
		for (const Seeder of [ProjectSeeder]) {
			await new Seeder(this.client).run();
		}
	}
}
