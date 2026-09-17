import { BaseSchema } from "@adonisjs/lucid/schema";

export default class extends BaseSchema {
	protected tableName = "subscription_documents";

	async up() {
		this.schema.createTable(this.tableName, (table) => {
			table.increments("id").notNullable();

			table
				.integer("subscription_id")
				.notNullable()
				.references("id")
				.inTable("subscriptions")
				.onDelete("CASCADE");
			table
				.integer("file_id")
				.notNullable()
				.unique()
				.references("id")
				.inTable("files")
				.onDelete("RESTRICT");
			table.integer("type").unsigned().notNullable();

			table.unique(["subscription_id", "type"]);
			table.timestamps(true, true);
		});
	}

	async down() {
		this.schema.dropTable(this.tableName);
	}
}
