import { BaseSchema } from "@adonisjs/lucid/schema";

export default class extends BaseSchema {
	protected tableName = "users";

	async up() {
		this.schema.createTable(this.tableName, (table) => {
			table.bigIncrements("id").notNullable();

			table.string("first_name", 254).notNullable();
			table.string("last_name", 254).notNullable();
			table.string("email", 254).notNullable().unique();
			table.string("password").notNullable();

			table.timestamps(true, true);
		});
	}

	async down() {
		this.schema.dropTable(this.tableName);
	}
}
