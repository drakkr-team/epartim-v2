import { test } from "@japa/runner";

import CreateRolePolicy from "#features/admin/roles/policies/create.policy";
import Admin from "#models/admin";
import User from "#models/user";

test.group("Features / Admin / Roles / Policies / Create Policy", () => {
	test("it should allow an admin and deny a user", ({ assert }) => {
		const policy = new CreateRolePolicy();

		assert.isTrue(policy.handle(new Admin()));
		assert.isFalse(policy.handle(new User()));
	});
});
