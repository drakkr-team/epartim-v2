import { BaseSchema } from "@adonisjs/lucid/schema";

export default class extends BaseSchema {
	async up() {
		this.schema.alterTable("subscription_plans", (table) => {
			table.boolean("voluntary_payments_limited_to_period").notNullable().defaultTo(false);
			table.date("voluntary_payment_period_start_date").nullable();
			table.date("voluntary_payment_period_end_date").nullable();
		});
	}

	async down() {
		this.schema.alterTable("subscription_plans", (table) => {
			table.dropColumns(
				"voluntary_payments_limited_to_period",
				"voluntary_payment_period_start_date",
				"voluntary_payment_period_end_date",
			);
		});
	}
}
