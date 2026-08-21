import { test } from "@japa/runner";

import ListAdminsPolicy from "#features/admin/admins/policies/list.policy";
import Admin from "#models/admin";
import User from "#models/user";

test.group("Features / Admin / Admins / Policies / List Policy", () => {
	test("it should allow an admin", ({ assert }) => {
		const policy = new ListAdminsPolicy();

		const canList = policy.handle(new Admin());

		assert.isTrue(canList);
	});

	test("it should deny a user", ({ assert }) => {
		const policy = new ListAdminsPolicy();

		const canList = policy.handle(new User());

		assert.isFalse(canList);
	});
});
