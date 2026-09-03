import { BaseSchema } from "@adonisjs/lucid/schema";

export default class extends BaseSchema {
	protected tableName = "files";

	async up() {
		this.schema.createTable(this.tableName, (table) => {
			table.increments("id");

			table.string("key").unique().notNullable();
			table.string("name").notNullable();
			table.integer("size").notNullable();
			table.string("type").nullable();

			table.timestamps(true, true);
		});
	}

	async down() {
		this.schema.dropTable(this.tableName);
	}
}
