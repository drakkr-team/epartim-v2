import { BaseSchema } from "@adonisjs/lucid/schema";

export default class extends BaseSchema {
	protected tableName = "addresses";

	async up() {
		this.schema.createTable(this.tableName, (table) => {
			table.bigIncrements("id").notNullable();
			table.string("line_one", 254).notNullable();
			table.string("line_two", 254).nullable();
			table.string("zip", 254).notNullable();
			table.string("city", 254).notNullable();
			table.jsonb("coordinates").nullable();
		});
	}

	async down() {
		this.schema.dropTable(this.tableName);
	}
}
