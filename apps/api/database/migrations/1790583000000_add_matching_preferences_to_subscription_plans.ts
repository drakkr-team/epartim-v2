import { BaseSchema } from "@adonisjs/lucid/schema";

export default class extends BaseSchema {
	async up() {
		this.schema.alterTable("subscription_plans", (table) => {
			table.integer("matching_calculation_method").unsigned().notNullable().defaultTo(1);
			table.integer("matching_distribution_period").unsigned().notNullable().defaultTo(1);
		});
	}

	async down() {
		this.schema.alterTable("subscription_plans", (table) => {
			table.dropColumns("matching_calculation_method", "matching_distribution_period");
		});
	}
}
