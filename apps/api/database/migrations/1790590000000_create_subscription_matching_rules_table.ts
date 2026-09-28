import { BaseSchema } from "@adonisjs/lucid/schema";

export default class extends BaseSchema {
	protected tableName = "subscription_matching_rules";

	async up() {
		this.schema.createTable(this.tableName, (table) => {
			table.increments("id").notNullable();
			table
				.integer("subscription_plan_id")
				.notNullable()
				.references("id")
				.inTable("subscription_plans")
				.onDelete("CASCADE");
			table.integer("device").unsigned().notNullable();
			table.integer("type").unsigned().notNullable();
			table.jsonb("details").notNullable().defaultTo("{}");
			table.unique(["subscription_plan_id", "device", "type"]);
			table.timestamps(true, true);
		});
	}

	async down() {
		this.schema.dropTable(this.tableName);
	}
}
