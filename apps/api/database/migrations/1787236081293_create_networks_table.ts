import { BaseSchema } from "@adonisjs/lucid/schema";

export default class extends BaseSchema {
	protected tableName = "networks";

	async up() {
		this.schema.createTable(this.tableName, (table) => {
			table.increments("id").notNullable();

			table.string("name", 254).notNullable().unique();
			table.string("amundi_org_id", 254).nullable().unique();
			table.string("go_code", 254).nullable();

			table
				.integer("address_id")
				.notNullable()
				.references("id")
				.inTable("addresses")
				.onDelete("RESTRICT");
			table
				.integer("payment_detail_id")
				.notNullable()
				.references("id")
				.inTable("payment_details")
				.onDelete("RESTRICT");

			table.timestamps(true, true);
		});
	}

	async down() {
		this.schema.dropTable(this.tableName);
	}
}
