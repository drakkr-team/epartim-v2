import { test } from "@japa/runner";

import ViewNetworkPolicy from "#features/admin/networks/policies/view.policy";
import Admin from "#models/admin";
import User from "#models/user";

test.group("Features / Admin / Networks / Policies / View Policy", () => {
	test("it should allow an admin", ({ assert }) => {
		const policy = new ViewNetworkPolicy();

		assert.isTrue(policy.handle(new Admin()));
	});

	test("it should deny a user", ({ assert }) => {
		const policy = new ViewNetworkPolicy();

		assert.isFalse(policy.handle(new User()));
	});
});
