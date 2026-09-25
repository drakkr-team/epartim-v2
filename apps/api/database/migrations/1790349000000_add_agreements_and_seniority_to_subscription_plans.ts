import { BaseSchema } from "@adonisjs/lucid/schema";

export default class extends BaseSchema {
	async up() {
		this.schema.alterTable("subscription_plans", (table) => {
			table.text("other_agreement_details").nullable();
			table.integer("minimum_seniority_months").nullable();
		});

		this.schema.createTable("subscription_existing_agreements", (table) => {
			table.increments("id").notNullable();
			table
				.integer("subscription_id")
				.notNullable()
				.references("id")
				.inTable("subscriptions")
				.onDelete("CASCADE");
			table.string("type").notNullable();
			table.unique(["subscription_id", "type"]);
			table.timestamps(true, true);
		});
	}

	async down() {
		this.schema.dropTable("subscription_existing_agreements");
		this.schema.alterTable("subscription_plans", (table) => {
			table.dropColumns("other_agreement_details", "minimum_seniority_months");
		});
	}
}
