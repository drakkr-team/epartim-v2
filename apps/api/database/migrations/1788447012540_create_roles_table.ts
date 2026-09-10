import { BaseSchema } from "@adonisjs/lucid/schema";

export default class extends BaseSchema {
	protected tableName = "roles";

	async up() {
		this.schema.createTable(this.tableName, (table) => {
			table.increments("id");

			table.string("name", 254).notNullable().unique();
			table.boolean("is_super_admin").notNullable().defaultTo(false);
			table.jsonb("authorizations").notNullable().defaultTo("[]");

			table.timestamps(true, true);
		});

		this.schema.alterTable("admins", (table) => {
			table.integer("role_id").unsigned().nullable();
		});

		this.defer(async (db) => {
			const [role] = await db.table("roles").returning(["id"]).insert({
				name: "Super Administrateur",
				is_super_admin: true,
			});
			await db.from("admins").update({ role_id: role.id });
		});

		this.schema.alterTable("admins", (table) => {
			table
				.integer("role_id")
				.unsigned()
				.notNullable()
				.references("id")
				.inTable("roles")
				.onDelete("RESTRICT")
				.alter();
		});
	}

	async down() {
		this.schema.alterTable("admins", (table) => {
			table.dropColumn("role_id");
		});
		this.schema.dropTable(this.tableName);
	}
}
