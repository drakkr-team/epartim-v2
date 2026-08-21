import { test } from "@japa/runner";

import UpdateUserPolicy from "#features/admin/users/policies/update.policy";
import Admin from "#models/admin";
import User from "#models/user";

test.group("Features / Admin / Users / Policies / Update Policy", () => {
	test("it should allow an admin", ({ assert }) => {
		const policy = new UpdateUserPolicy();

		const canUpdate = policy.handle(new Admin());

		assert.isTrue(canUpdate);
	});

	test("it should deny a user", ({ assert }) => {
		const policy = new UpdateUserPolicy();

		const canUpdate = policy.handle(new User());

		assert.isFalse(canUpdate);
	});
});
