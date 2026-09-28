import { BaseSchema } from "@adonisjs/lucid/schema";

export default class extends BaseSchema {
	async up() {
		this.schema.alterTable("subscription_plans", (table) => {
			table.string("matching_calculation_method").notNullable().defaultTo("amundi");
			table.string("matching_distribution_period").notNullable().defaultTo("years");
		});
	}

	async down() {
		this.schema.alterTable("subscription_plans", (table) => {
			table.dropColumns("matching_calculation_method", "matching_distribution_period");
		});
	}
}
