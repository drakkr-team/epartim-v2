import { createHash } from "node:crypto";

import { BaseSeeder } from "@adonisjs/lucid/seeders";
import { DateTime } from "luxon";

import Role from "#models/role";
import User from "#models/user";

export default class UserSeeder extends BaseSeeder {
	static environment = ["manual"];

	async run() {
		const admin = await User.updateOrCreate(
			{ email: "admin@example.com" },
			{
				name: "Admin Epartim",
				email: "admin@example.com",
				password: "password123",
				firstName: "Admin",
				lastName: "Epartim",
				status: "active",
				amundiEmployeeType: "conseiller_pdf",
			},
		);
		const administratorRole = await Role.findByOrFail("code", "administrator");
		await admin.related("roles").sync([administratorRole.id]);

		const now = DateTime.now().toJSDate();

		await this.client
			.getWriteClient()
			.table("users")
			.insert({
				name: "Utilisateur Invite",
				email: "invited@example.com",
				password: null,
				first_name: "Utilisateur",
				last_name: "Invite",
				status: "invited",
				amundi_employee_type: "conseiller_pdf",
				created_at: now,
				updated_at: now,
			})
			.onConflict("email")
			.merge({
				name: "Utilisateur Invite",
				password: null,
				first_name: "Utilisateur",
				last_name: "Invite",
				status: "invited",
				amundi_employee_type: "conseiller_pdf",
				updated_at: now,
			});

		await this.seedInvitation();
	}

	private async seedInvitation() {
		const now = DateTime.now().toJSDate();
		const invitationTokenHash = createHash("sha256").update("dev-invitation-token").digest("hex");

		const invitedUser = await this.client
			.getWriteClient()
			.table("users")
			.where("email", "invited@example.com")
			.first("id");

		if (!invitedUser) {
			return;
		}

		await this.client
			.getWriteClient()
			.table("user_invitations")
			.where("user_id", invitedUser.id)
			.whereNull("accepted_at")
			.whereNull("revoked_at")
			.whereNot("token_hash", invitationTokenHash)
			.update({
				revoked_at: now,
				updated_at: now,
			});

		await this.client
			.getWriteClient()
			.table("user_invitations")
			.insert({
				user_id: invitedUser.id,
				invited_by_user_id: null,
				token_hash: invitationTokenHash,
				email: "invited@example.com",
				sent_at: now,
				expires_at: DateTime.now().plus({ days: 7 }).toJSDate(),
				created_at: now,
				updated_at: now,
			})
			.onConflict("token_hash")
			.merge({
				email: "invited@example.com",
				sent_at: now,
				expires_at: DateTime.now().plus({ days: 7 }).toJSDate(),
				accepted_at: null,
				revoked_at: null,
				updated_at: now,
			});
	}
}
