import { createHash } from "node:crypto";

import { test } from "@japa/runner";
import { DateTime } from "luxon";

import { UserFactory } from "#database/factories/user.factory";
import User from "#models/user";
import UserInvitation from "#models/user_invitation";

test.group("Features / User Management / Administration / Controllers / Accept Invitation", () => {
	test("it activates an invited user and creates a session", async ({ client, assert }) => {
		const user = await UserFactory.apply("invited").create();
		const token = "activation-token";
		await UserInvitation.create({
			userId: user.id,
			invitedByUserId: null,
			email: user.email,
			tokenHash: createHash("sha256").update(token).digest("hex"),
			sentAt: DateTime.now(),
			expiresAt: DateTime.now().plus({ days: 7 }),
		});

		const response = await client.visit("admin.accept_invitation").json({
			token,
			password: "new-password",
		});

		response.assertOk();
		const activatedUser = await User.findOrFail(user.id);
		assert.equal(activatedUser.status, "active");
		assert.isNotNull(activatedUser.password);
	});
});
