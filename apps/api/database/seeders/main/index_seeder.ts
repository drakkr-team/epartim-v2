import app from "@adonisjs/core/services/app";
import { BaseSeeder } from "@adonisjs/lucid/seeders";

export default class extends BaseSeeder {
	private async seed(SeederModule: { default: typeof BaseSeeder }) {
		const Seeder = SeederModule.default;

		if (Seeder.environment && !Seeder.environment.includes(app.nodeEnvironment)) {
			return;
		}

		await new Seeder(this.client).run();
	}

	async run() {
		await this.seed(await import("#database/seeders/network_seeder"));
	}
}
