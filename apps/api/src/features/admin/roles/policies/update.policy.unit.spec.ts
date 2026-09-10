import { test } from "@japa/runner";

import UpdateRolePolicy from "#features/admin/roles/policies/update.policy";
import Admin from "#models/admin";
import User from "#models/user";

test.group("Features / Admin / Roles / Policies / Update Policy", () => {
	test("it should allow an admin and deny a user", ({ assert }) => {
		const policy = new UpdateRolePolicy();

		assert.isTrue(policy.handle(new Admin()));
		assert.isFalse(policy.handle(new User()));
	});
});
