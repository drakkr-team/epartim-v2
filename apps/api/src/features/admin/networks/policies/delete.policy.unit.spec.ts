import { test } from "@japa/runner";

import DeleteNetworkPolicy from "#features/admin/networks/policies/delete.policy";
import Admin from "#models/admin";
import User from "#models/user";

test.group("Features / Admin / Networks / Policies / Delete Policy", () => {
	test("it should allow an admin", ({ assert }) => {
		const policy = new DeleteNetworkPolicy();

		assert.isTrue(policy.handle(new Admin()));
	});

	test("it should deny a user", ({ assert }) => {
		const policy = new DeleteNetworkPolicy();

		assert.isFalse(policy.handle(new User()));
	});
});
