import { createHash } from "node:crypto";

import { BaseSeeder } from "@adonisjs/lucid/seeders";
import { DateTime } from "luxon";

import UserInvitationStoreService from "#features/admin/users/services/user_invitation_store.service";
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
		const now = DateTime.now();
		const invitationTokenHash = createHash("sha256").update("dev-invitation-token").digest("hex");
		const invitationStore = new UserInvitationStoreService();

		const invitedUser = await this.client
			.getWriteClient()
			.table("users")
			.where("email", "invited@example.com")
			.first("id");

		if (!invitedUser) {
			return;
		}

		await invitationStore.invalidateByUserId(invitedUser.id);
		await invitationStore.restore({
			userId: invitedUser.id,
			invitedByUserId: null,
			email: "invited@example.com",
			tokenHash: invitationTokenHash,
			sentAt: now.toISO()!,
			expiresAt: now.plus({ days: 7 }).toISO()!,
		});
	}
}
