import { BaseSchema } from "@adonisjs/lucid/schema";

export default class extends BaseSchema {
	protected tableName = "commission_rates";

	async up() {
		this.schema.createTable(this.tableName, (table) => {
			table.increments("id");

			table.float("short_term_commission_rate").notNullable().defaultTo(0);
			table.float("medium_term_commission_rate").notNullable().defaultTo(0);
			table.float("long_term_commission_rate").notNullable().defaultTo(0);

			table.timestamps(true, true);
		});

		this.schema.alterTable("networks", (table) => {
			table.integer("commission_rate_id").unsigned();
		});

		this.schema.alterTable("firms", (table) => {
			table.integer("commission_rate_id").unsigned();
		});

		this.defer(async (db) => {
			const networks = await db.from("networks").select("id");
			for (const network of networks) {
				const [commissionRate] = await db.table("commission_rates").returning("id").insert({
					short_term_commission_rate: 0,
					medium_term_commission_rate: 0,
					long_term_commission_rate: 0,
				});

				await db.from("networks").where("id", network.id).update({
					commission_rate_id: commissionRate.id,
				});
			}

			const firms = await db.from("firms").select("id");
			for (const firm of firms) {
				const [commissionRate] = await db.table("commission_rates").returning("id").insert({
					short_term_commission_rate: 0,
					medium_term_commission_rate: 0,
					long_term_commission_rate: 0,
				});

				await db.from("firms").where("id", firm.id).update({
					commission_rate_id: commissionRate.id,
				});
			}
		});

		this.schema.alterTable("networks", (table) => {
			table
				.integer("commission_rate_id")
				.unsigned()
				.references("id")
				.inTable("commission_rates")
				.notNullable()
				.alter();
		});

		this.schema.alterTable("firms", (table) => {
			table
				.integer("commission_rate_id")
				.unsigned()
				.references("id")
				.inTable("commission_rates")
				.notNullable()
				.alter();
		});
	}

	async down() {
		this.schema.alterTable("networks", (table) => {
			table.dropColumn("commission_rate_id");
		});

		this.schema.alterTable("firms", (table) => {
			table.dropColumn("commission_rate_id");
		});

		this.schema.dropTable(this.tableName);
	}
}
