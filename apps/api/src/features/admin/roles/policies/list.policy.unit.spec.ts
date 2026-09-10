import { test } from "@japa/runner";

import ListRolePolicy from "#features/admin/roles/policies/list.policy";
import Admin from "#models/admin";
import User from "#models/user";

test.group("Features / Admin / Roles / Policies / List Policy", () => {
	test("it should allow an admin and deny a user", ({ assert }) => {
		const policy = new ListRolePolicy();

		assert.isTrue(policy.handle(new Admin()));
		assert.isFalse(policy.handle(new User()));
	});
});
