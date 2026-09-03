import { BaseSchema } from "@adonisjs/lucid/schema";

export default class extends BaseSchema {
	protected tableName = "subscriptions";

	async up() {
		this.schema.createTable(this.tableName, (table) => {
			table.increments("id").notNullable();

			table.integer("created_by").nullable().references("id").inTable("users").onDelete("SET NULL");
			table.timestamp("submitted_at").nullable();
			table.timestamp("approved_at").nullable();
			table.timestamp("completed_at").nullable();
			table.integer("status").nullable();
			table.timestamp("status_updated_at").nullable();
			table.jsonb("completed_steps").nullable();

			table.timestamps(true, true);
		});
	}

	async down() {
		this.schema.dropTable(this.tableName);
	}
}
