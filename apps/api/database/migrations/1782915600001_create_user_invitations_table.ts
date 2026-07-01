import { BaseSchema } from "@adonisjs/lucid/schema";

export default class extends BaseSchema {
	protected tableName = "user_invitations";

	async up() {
		await this.schema.createTable(this.tableName, (table) => {
			table.increments("id").notNullable();
			table
				.integer("user_id")
				.unsigned()
				.notNullable()
				.references("id")
				.inTable("users")
				.onDelete("CASCADE");
			table
				.integer("invited_by_user_id")
				.unsigned()
				.nullable()
				.references("id")
				.inTable("users")
				.onDelete("SET NULL");
			table.string("token_hash").notNullable().unique();
			table.string("email", 254).notNullable();
			table.timestamp("sent_at").nullable();
			table.timestamp("expires_at").notNullable();
			table.timestamp("accepted_at").nullable();
			table.timestamp("revoked_at").nullable();

			table.timestamps(true, true);

			table.index(["user_id"], "idx_user_invitations_user_id");
			table.index(["invited_by_user_id"], "idx_user_invitations_invited_by_user_id");
			table.index(["email"], "idx_user_invitations_email");
		});

		await this.schema.raw(`
			CREATE UNIQUE INDEX "uniq_user_invitations_active_user_id"
			ON "${this.tableName}" ("user_id")
			WHERE "accepted_at" IS NULL AND "revoked_at" IS NULL
		`);
	}

	async down() {
		await this.schema.dropTable(this.tableName);
	}
}
