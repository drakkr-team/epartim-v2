import { test } from "@japa/runner";

import ListUsersPolicy from "#features/admin/users/policies/list.policy";
import Admin from "#models/admin";
import User from "#models/user";

test.group("Features / Admin / Users / Policies / List Policy", () => {
	test("it should allow an admin", ({ assert }) => {
		const policy = new ListUsersPolicy();

		const canList = policy.handle(new Admin());

		assert.isTrue(canList);
	});

	test("it should deny a user", ({ assert }) => {
		const policy = new ListUsersPolicy();

		const canList = policy.handle(new User());

		assert.isFalse(canList);
	});
});
