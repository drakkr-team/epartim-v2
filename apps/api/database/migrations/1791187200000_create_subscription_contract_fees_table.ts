import { BaseSchema } from "@adonisjs/lucid/schema";

export default class extends BaseSchema {
	protected tableName = "subscription_contract_fees";

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
			table.integer("pricing_offer").notNullable();
			table.bigInteger("annual_account_fee_cents").notNullable();
			table.bigInteger("annual_account_fee_per_employee_cents").notNullable();
			table.integer("entry_fee_payer").nullable();
			table.integer("entry_fee_rate_basis_points").nullable();
			table.timestamps(true, true);
		});
	}

	async down() {
		this.schema.dropTable(this.tableName);
	}
}
