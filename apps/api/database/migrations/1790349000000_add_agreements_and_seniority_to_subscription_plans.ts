import { BaseSchema } from "@adonisjs/lucid/schema";

export default class extends BaseSchema {
	async up() {
		this.schema.alterTable("subscription_plans", (table) => {
			table.jsonb("existing_agreements").notNullable().defaultTo("[]");
			table.text("other_agreement_details").nullable();
			table.integer("minimum_seniority_months").nullable();
		});
	}

	async down() {
		this.schema.alterTable("subscription_plans", (table) => {
			table.dropColumns(
				"existing_agreements",
				"other_agreement_details",
				"minimum_seniority_months",
			);
		});
	}
}
