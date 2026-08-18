import { BaseSchema } from "@adonisjs/lucid/schema";

export default class extends BaseSchema {
	async up() {
		this.schema.createTable("admin_users", (table) => {
			table.increments("id").notNullable();
			table.string("name", 254).notNullable();
			table.string("email", 254).notNullable().unique();
			table.string("password").notNullable();
			table.string("status", 32).notNullable().defaultTo("active");
			table.timestamp("disabled_at").nullable();
			table.integer("auth_version").unsigned().notNullable().defaultTo(1);
			table.timestamps(true, true);
			table.index(["status"], "idx_admin_users_status");
		});

		this.schema.raw(`
			ALTER TABLE "admin_users"
			ADD CONSTRAINT "admin_users_status_check"
			CHECK ("status" IN ('active', 'disabled'))
		`);

		this.schema.alterTable("user_invitations", (table) => {
			table
				.integer("invited_by_admin_user_id")
				.unsigned()
				.nullable()
				.references("id")
				.inTable("admin_users")
				.onDelete("SET NULL");
			table.index(["invited_by_admin_user_id"], "idx_user_invitations_invited_by_admin_user_id");
		});
	}

	async down() {
		this.schema.alterTable("user_invitations", (table) => {
			table.dropIndex(
				["invited_by_admin_user_id"],
				"idx_user_invitations_invited_by_admin_user_id",
			);
			table.dropForeign(["invited_by_admin_user_id"]);
			table.dropColumn("invited_by_admin_user_id");
		});

		this.schema.raw('ALTER TABLE "admin_users" DROP CONSTRAINT "admin_users_status_check"');
		this.schema.dropTable("admin_users");
	}
}
