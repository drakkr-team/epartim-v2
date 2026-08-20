import { BaseSchema } from "@adonisjs/lucid/schema";

export default class extends BaseSchema {
	protected tableName = "networks";

	async up() {
		this.schema.createTable(this.tableName, (table) => {
			table.bigIncrements("id").notNullable();
			table.string("name", 254).notNullable().unique();
			table.string("amundi_org_id", 254).nullable().unique();
			table
				.bigInteger("address_id")
				.nullable()
				.references("id")
				.inTable("addresses")
				.onDelete("SET NULL");
			table.bigInteger("go_code").nullable();
			table.bigInteger("payment_details_id").nullable();
			table.timestamps(true, true);
		});
	}

	async down() {
		this.schema.dropTable(this.tableName);
	}
}
