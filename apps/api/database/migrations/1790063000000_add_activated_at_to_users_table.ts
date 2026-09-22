import { BaseSchema } from "@adonisjs/lucid/schema";

export default class extends BaseSchema {
	protected tableName = "users";

	async up() {
		this.schema.alterTable(this.tableName, (table) => {
			table.timestamp("activated_at");
		});
	}

	async down() {
		this.schema.alterTable(this.tableName, (table) => {
			table.dropColumn("activated_at");
		});
	}
}
