import { BaseSchema } from "@adonisjs/lucid/schema";

export default class extends BaseSchema {
	protected tableName = "admins";

	async up() {
		this.schema.createTable(this.tableName, (table) => {
			table.bigIncrements("id");

			table.string("name").notNullable();
			table.string("email", 254).notNullable().unique();
			table.string("password").notNullable();
			table.timestamp("activated_at");

			table.timestamps(true, true);
		});
	}

	async down() {
		this.schema.dropTable(this.tableName);
	}
}
