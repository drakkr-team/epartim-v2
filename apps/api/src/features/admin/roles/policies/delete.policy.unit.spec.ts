import { test } from "@japa/runner";

import DeleteRolePolicy from "#features/admin/roles/policies/delete.policy";
import Admin from "#models/admin";
import User from "#models/user";

test.group("Features / Admin / Roles / Policies / Delete Policy", () => {
	test("it should allow an admin and deny a user", ({ assert }) => {
		const policy = new DeleteRolePolicy();

		assert.isTrue(policy.handle(new Admin()));
		assert.isFalse(policy.handle(new User()));
	});
});
