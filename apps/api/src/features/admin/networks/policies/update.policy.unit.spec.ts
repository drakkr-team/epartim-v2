import { test } from "@japa/runner";

import UpdateNetworkPolicy from "#features/admin/networks/policies/update.policy";
import Admin from "#models/admin";
import User from "#models/user";

test.group("Features / Admin / Networks / Policies / Update Policy", () => {
	test("it should allow an admin", ({ assert }) => {
		const policy = new UpdateNetworkPolicy();

		assert.isTrue(policy.handle(new Admin()));
	});

	test("it should deny a user", ({ assert }) => {
		const policy = new UpdateNetworkPolicy();

		assert.isFalse(policy.handle(new User()));
	});
});
