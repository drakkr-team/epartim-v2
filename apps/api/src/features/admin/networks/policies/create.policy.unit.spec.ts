import { test } from "@japa/runner";

import CreateNetworkPolicy from "#features/admin/networks/policies/create.policy";
import Admin from "#models/admin";
import User from "#models/user";

test.group("Features / Admin / Networks / Policies / Create Policy", () => {
	test("it should allow an admin", ({ assert }) => {
		const policy = new CreateNetworkPolicy();

		assert.isTrue(policy.handle(new Admin()));
	});

	test("it should deny a user", ({ assert }) => {
		const policy = new CreateNetworkPolicy();

		assert.isFalse(policy.handle(new User()));
	});
});
