import { BaseSchema } from "@adonisjs/lucid/schema";

export default class extends BaseSchema {
	protected tableName = "networks";

	async up() {
		this.schema.alterTable(this.tableName, (table) => {
			table.bigInteger("address_id").notNullable().alter();
		});
	}

	async down() {
		this.schema.alterTable(this.tableName, (table) => {
			table.bigInteger("address_id").nullable().alter();
		});
	}
}
