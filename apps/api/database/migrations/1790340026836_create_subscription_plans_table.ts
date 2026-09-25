import { BaseSchema } from "@adonisjs/lucid/schema";

export default class extends BaseSchema {
	protected tableName = "subscription_plans";

	async up() {
		this.schema.createTable(this.tableName, (table) => {
			table.increments("id").notNullable();
			table
				.integer("subscription_id")
				.notNullable()
				.unique()
				.references("id")
				.inTable("subscriptions")
				.onDelete("CASCADE");
			table.boolean("existing_device_transfer").notNullable().defaultTo(false);
			table.bigInteger("estimated_transfer_amount_cents").nullable();

			table.timestamps(true, true);
		});

		this.schema.createTable("subscription_plan_adhesions", (table) => {
			table.increments("id").notNullable();
			table
				.integer("subscription_plan_id")
				.notNullable()
				.references("id")
				.inTable(this.tableName)
				.onDelete("CASCADE");
			table.integer("type").unsigned().notNullable();
			table.unique(["subscription_plan_id", "type"]);
			table.timestamps(true, true);
		});
	}

	async down() {
		this.schema.dropTable("subscription_plan_adhesions");
		this.schema.dropTable(this.tableName);
	}
}
