import { createHash } from "node:crypto";

import { QueueManager } from "@adonisjs/queue";
import { test } from "@japa/runner";
import { DateTime } from "luxon";

import { UserFactory } from "#database/factories/user.factory";
import SendAccountInvitation from "#features/admin/users/jobs/send_account_invitation.job";
import UserInvitationStoreService from "#features/admin/users/services/user_invitation_store.service";
import Role from "#models/role";

async function createAdministrator() {
	const user = await UserFactory.create();
	const role = await Role.firstOrCreate(
		{ code: "administrator" },
		{ code: "administrator", name: "Administrateur" },
	);
	await user.related("roles").sync([role.id]);
	return user;
}

test.group(
	"Features / User Management / Administration / Controllers / Manage Invitation",
	(group) => {
		group.each.teardown(() => {
			QueueManager.restore();
		});

		test("it resends an invitation and invalidates the previous token", async ({
			client,
			assert,
		}) => {
			const fakeQueueManager = QueueManager.fake();
			const invitationStore = new UserInvitationStoreService();
			const administrator = await createAdministrator();
			const invitedUser = await UserFactory.apply("invited").create();
			const previousToken = "old-invitation-token";
			const previousTokenHash = createHash("sha256").update(previousToken).digest("hex");

			await invitationStore.restore({
				userId: invitedUser.id,
				invitedByUserId: administrator.id,
				email: invitedUser.email,
				tokenHash: previousTokenHash,
				sentAt: DateTime.now().minus({ day: 1 }).toISO()!,
				expiresAt: DateTime.now().plus({ days: 6 }).toISO()!,
			});

			const response = await client
				.visit("admin.resend_invitation", { id: String(invitedUser.id) })
				.loginAs(administrator)
				.json({});

			response.assertOk();
			const nextInvitation = await invitationStore.getByUserId(invitedUser.id);
			assert.isNotNull(nextInvitation);
			assert.notEqual(nextInvitation?.tokenHash, previousTokenHash);
			const previousTokenResponse = await client.visit("admin.accept_invitation").json({
				token: previousToken,
				password: "new-password",
			});
			previousTokenResponse.assertBadRequest();
			previousTokenResponse.assertBodyContains({
				code: "E_INVALID_TOKEN",
			});
			fakeQueueManager.assertPushed(SendAccountInvitation);
		});

		test("it cancels an invitation by invalidating the stored token", async ({
			client,
			assert,
		}) => {
			const invitationStore = new UserInvitationStoreService();
			const administrator = await createAdministrator();
			const invitedUser = await UserFactory.apply("invited").create();

			await invitationStore.restore({
				userId: invitedUser.id,
				invitedByUserId: administrator.id,
				email: invitedUser.email,
				tokenHash: createHash("sha256").update("cancel-invitation-token").digest("hex"),
				sentAt: DateTime.now().toISO()!,
				expiresAt: DateTime.now().plus({ days: 7 }).toISO()!,
			});

			const response = await client
				.visit("admin.cancel_invitation", { id: String(invitedUser.id) })
				.loginAs(administrator)
				.json({});

			response.assertNoContent();
			assert.isNull(await invitationStore.getByUserId(invitedUser.id));
		});
	},
);
