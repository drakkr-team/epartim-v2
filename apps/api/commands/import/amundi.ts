import { inject } from "@adonisjs/core";
import { BaseCommand } from "@adonisjs/core/ace";
import type { CommandOptions } from "@adonisjs/core/types/ace";

import AmundiDailyFeedService from "#services/amundi/daily_feed/main.service";

export default class ImportAmundi extends BaseCommand {
	static commandName = "import:amundi";
	static description = "Import data from Amundi";

	static options: CommandOptions = {
		startApp: true,
	};

	@inject()
	async run(dailyFeedService: AmundiDailyFeedService) {
		await dailyFeedService.import();
	}
}
