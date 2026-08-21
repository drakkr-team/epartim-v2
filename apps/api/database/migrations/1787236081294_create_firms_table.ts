import { BaseSchema } from "@adonisjs/lucid/schema";

export default class extends BaseSchema {
	protected tableName = "firms";

	async up() {
		this.schema.createTable(this.tableName, (table) => {
			table.bigIncrements("id").notNullable();
			table
				.bigInteger("network_id")
				.nullable()
				.references("id")
				.inTable("networks")
				.onDelete("SET NULL");
			table.string("name", 254).notNullable().unique();
			table.string("amundi_org_id", 254).nullable().unique();
			table
				.bigInteger("address_id")
				.notNullable()
				.unique()
				.references("id")
				.inTable("addresses")
				.onDelete("RESTRICT");
			table
				.bigInteger("payment_details_id")
				.notNullable()
				.references("id")
				.inTable("payment_details")
				.onDelete("RESTRICT");
			table.string("orias", 254).notNullable();
			table.timestamps(true, true);

			table.index(["network_id"], "idx_firms_network_id");
		});
	}

	async down() {
		this.schema.dropTable(this.tableName);
	}
}
