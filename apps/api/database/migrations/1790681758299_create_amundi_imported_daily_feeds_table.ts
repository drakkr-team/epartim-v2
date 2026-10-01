import { BaseSchema } from "@adonisjs/lucid/schema";

export default class extends BaseSchema {
	protected tableName = "amundi_imported_daily_feeds";

	async up() {
		this.schema.createTable(this.tableName, (table) => {
			table.increments("id");

			table.string("ref").notNullable().unique();
			table.string("file_name").notNullable();

			table.timestamps(true, true);
		});
	}

	async down() {
		this.schema.dropTable(this.tableName);
	}
}
