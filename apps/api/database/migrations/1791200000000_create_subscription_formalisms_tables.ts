import { BaseSchema } from "@adonisjs/lucid/schema";

export default class extends BaseSchema {
	protected tableName = "subscription_formalisms";

	async up() {
		this.schema.createTable(this.tableName, (table) => {
			table.increments("id").notNullable();
			table
				.integer("subscription_id")
				.notNullable()
				.references("id")
				.inTable("subscriptions")
				.onDelete("CASCADE");
			table.integer("group").notNullable();
			table.integer("method").nullable();
			table.boolean("method_invalidated").notNullable().defaultTo(false);
			table.date("meeting_date").nullable();
			table.string("meeting_city", 120).nullable();
			table.string("closing_time", 5).nullable();
			table.integer("votes_for").nullable();
			table.integer("votes_against").nullable();
			table.integer("votes_abstentions").nullable();
			table.string("president_first_name", 254).nullable();
			table.string("president_last_name", 254).nullable();
			table.string("president_email", 254).nullable();
			table.unique(["subscription_id", "group"]);
			table.timestamps(true, true);
		});
		this.schema.createTable("subscription_cse_members", (table) => {
			table.increments("id").notNullable();
			table
				.integer("subscription_formalism_id")
				.notNullable()
				.references("id")
				.inTable(this.tableName)
				.onDelete("CASCADE");
			table.string("first_name", 254).nullable();
			table.string("last_name", 254).nullable();
			table.string("email", 254).nullable();
			table.integer("function").nullable();
			table.boolean("attending").nullable();
			table.boolean("mandated").notNullable().defaultTo(false);
			table.timestamps(true, true);
		});
		this.schema.createTable("subscription_formalism_employees", (table) => {
			table.increments("id").notNullable();
			table
				.integer("subscription_id")
				.notNullable()
				.references("id")
				.inTable("subscriptions")
				.onDelete("CASCADE");
			table.string("first_name", 254).nullable();
			table.string("last_name", 254).nullable();
			table.string("email", 254).nullable();
			table.unique(["subscription_id", "email"]);
			table.timestamps(true, true);
		});
	}

	async down() {
		this.schema.dropTable("subscription_formalism_employees");
		this.schema.dropTable("subscription_cse_members");
		this.schema.dropTable(this.tableName);
	}
}
