import { BaseSchema } from "@adonisjs/lucid/schema";

export default class extends BaseSchema {
	protected tableName = "user_tokens";

	async up() {
		this.schema.createTable(this.tableName, (table) => {
			table.increments("id").notNullable();
			table
				.integer("user_id")
				.unsigned()
				.references("id")
				.inTable("users")
				.onDelete("CASCADE")
				.notNullable();

			table.integer("type").unsigned().notNullable();
			table.string("token", 64).notNullable();
			table.timestamp("expires_at").notNullable();

			table.timestamps(true, true);
		});
	}

	async down() {
		this.schema.dropTable(this.tableName);
	}
}
