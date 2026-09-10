import { test } from "@japa/runner";

import ViewRolePolicy from "#features/admin/roles/policies/view.policy";
import Admin from "#models/admin";
import User from "#models/user";

test.group("Features / Admin / Roles / Policies / View Policy", () => {
	test("it should allow an admin and deny a user", ({ assert }) => {
		const policy = new ViewRolePolicy();

		assert.isTrue(policy.handle(new Admin()));
		assert.isFalse(policy.handle(new User()));
	});
});
