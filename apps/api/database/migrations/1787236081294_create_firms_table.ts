import { BaseSchema } from "@adonisjs/lucid/schema";

export default class extends BaseSchema {
	protected tableName = "firms";

	async up() {
		this.schema.createTable(this.tableName, (table) => {
			table.increments("id").notNullable();

			table.string("name", 254).notNullable().unique();
			table.string("orias", 254).notNullable().unique();
			table.string("amundi_org_id", 254).nullable().unique();

			table
				.integer("network_id")
				.nullable()
				.references("id")
				.inTable("networks")
				.onDelete("SET NULL");
			table
				.integer("address_id")
				.notNullable()
				.unique()
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
