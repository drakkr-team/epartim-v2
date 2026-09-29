import { BaseSchema } from "@adonisjs/lucid/schema";

export default class extends BaseSchema {
	protected tableName = "companies";

	async up() {
		this.schema.alterTable(this.tableName, (table) => {
			table.string("amundi_id").nullable().unique();
		});
	}

	async down() {
		this.schema.alterTable(this.tableName, (table) => {
			table.dropColumn("amundi_id");
		});
	}
}
