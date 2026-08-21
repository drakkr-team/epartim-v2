import { test } from "@japa/runner";

import UpdateAdminPolicy from "#features/admin/admins/policies/update.policy";
import Admin from "#models/admin";
import User from "#models/user";

test.group("Features / Admin / Admins / Policies / Update Policy", () => {
	test("it should allow an admin", ({ assert }) => {
		const policy = new UpdateAdminPolicy();

		const canUpdate = policy.handle(new Admin());

		assert.isTrue(canUpdate);
	});

	test("it should deny a user", ({ assert }) => {
		const policy = new UpdateAdminPolicy();

		const canUpdate = policy.handle(new User());

		assert.isFalse(canUpdate);
	});
});
