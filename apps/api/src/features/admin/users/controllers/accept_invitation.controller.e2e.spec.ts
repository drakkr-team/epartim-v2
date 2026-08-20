import { createHash } from "node:crypto";

import { test } from "@japa/runner";
import { DateTime } from "luxon";

import { UserFactory } from "#database/factories/user.factory";
import UserInvitationStoreService from "#features/admin/users/services/user_invitation_store.service";
import User from "#models/user";

test.group("Features / User Management / Administration / Controllers / Accept Invitation", () => {
	test("it activates an invited user and creates a session", async ({ client, assert }) => {
		const user = await UserFactory.apply("invited").create();
		const token = "activation-token";
		const invitationStore = new UserInvitationStoreService();
		await invitationStore.restore({
			userId: user.id,
			invitedByUserId: null,
			email: user.email,
			tokenHash: createHash("sha256").update(token).digest("hex"),
			sentAt: DateTime.now().toISO()!,
			expiresAt: DateTime.now().plus({ days: 7 }).toISO()!,
		});

		const response = await client.visit("admin.accept_invitation").json({
			token,
			password: "new-password",
		});

		response.assertOk();
		const activatedUser = await User.findOrFail(user.id);
		assert.equal(activatedUser.status, "active");
		assert.isNotNull(activatedUser.password);
		assert.isNull(await invitationStore.getByUserId(user.id));
	});

	test("it refuses an already consumed invitation token", async ({ client }) => {
		const user = await UserFactory.apply("invited").create();
		const token = "already-consumed-token";
		const invitationStore = new UserInvitationStoreService();
		await invitationStore.restore({
			userId: user.id,
			invitedByUserId: null,
			email: user.email,
			tokenHash: createHash("sha256").update(token).digest("hex"),
			sentAt: DateTime.now().toISO()!,
			expiresAt: DateTime.now().plus({ days: 7 }).toISO()!,
		});

		const firstResponse = await client.visit("admin.accept_invitation").json({
			token,
			password: "new-password",
		});
		const secondResponse = await client.visit("admin.accept_invitation").json({
			token,
			password: "new-password",
		});

		firstResponse.assertOk();
		secondResponse.assertBadRequest();
		secondResponse.assertBodyContains({
			code: "E_INVALID_TOKEN",
		});
	});

	test("it refuses an expired invitation token", async ({ client }) => {
		const user = await UserFactory.apply("invited").create();
		const token = "expired-token";
		const invitationStore = new UserInvitationStoreService();
		await invitationStore.restore({
			userId: user.id,
			invitedByUserId: null,
			email: user.email,
			tokenHash: createHash("sha256").update(token).digest("hex"),
			sentAt: DateTime.now().toISO()!,
			expiresAt: DateTime.now().minus({ second: 1 }).toISO()!,
		});

		const response = await client.visit("admin.accept_invitation").json({
			token,
			password: "new-password",
		});

		response.assertBadRequest();
		response.assertBodyContains({
			code: "E_INVALID_TOKEN",
		});
	});
});
