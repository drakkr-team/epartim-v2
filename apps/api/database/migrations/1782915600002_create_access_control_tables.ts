import { BaseSchema } from "@adonisjs/lucid/schema";

export default class extends BaseSchema {
	async up() {
		this.schema.createTable("networks", (table) => {
			table.increments("id").notNullable();
			table.string("name", 254).notNullable().unique();
			table.timestamps(true, true);
		});

		this.schema.createTable("firms", (table) => {
			table.increments("id").notNullable();
			table.string("name", 254).notNullable().unique();
			table.integer("network_id").unsigned().nullable().references("id").inTable("networks");
			table.timestamps(true, true);
			table.index(["network_id"], "idx_firms_network_id");
		});

		this.schema.createTable("roles", (table) => {
			table.increments("id").notNullable();
			table.string("code", 64).notNullable().unique();
			table.string("name", 254).notNullable();
			table.timestamps(true, true);
		});

		this.schema.createTable("user_roles", (table) => {
			table
				.integer("user_id")
				.unsigned()
				.notNullable()
				.references("id")
				.inTable("users")
				.onDelete("CASCADE");
			table
				.integer("role_id")
				.unsigned()
				.notNullable()
				.references("id")
				.inTable("roles")
				.onDelete("CASCADE");
			table.primary(["user_id", "role_id"]);
		});

		this.schema.raw(`
			INSERT INTO roles (code, name, created_at, updated_at)
			VALUES
				('administrator', 'Administrateur', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
				('commercial', 'Commercial GO/Epartim', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
				('network_manager', 'Manager réseau', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
				('distributor', 'Distributeur', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)
		`);

		this.schema.alterTable("users", (table) => {
			table.integer("auth_version").unsigned().notNullable().defaultTo(1);
			table.integer("network_id").unsigned().nullable().references("id").inTable("networks");
			table.foreign("firm_id").references("id").inTable("firms").onDelete("SET NULL");
			table.index(["network_id"], "idx_users_network_id");
		});
	}

	async down() {
		this.schema.alterTable("users", (table) => {
			table.dropForeign(["firm_id"]);
			table.dropIndex(["network_id"], "idx_users_network_id");
			table.dropForeign(["network_id"]);
			table.dropColumn("network_id");
			table.dropColumn("auth_version");
		});

		this.schema.dropTable("user_roles");
		this.schema.dropTable("roles");
		this.schema.dropTable("firms");
		this.schema.dropTable("networks");
	}
}
