import { test } from "@japa/runner";

import ListNetworksPolicy from "#features/admin/networks/policies/list.policy";
import Admin from "#models/admin";
import User from "#models/user";

test.group("Features / Admin / Networks / Policies / List Policy", () => {
	test("it should allow an admin", ({ assert }) => {
		const policy = new ListNetworksPolicy();

		assert.isTrue(policy.handle(new Admin()));
	});

	test("it should deny a user", ({ assert }) => {
		const policy = new ListNetworksPolicy();

		assert.isFalse(policy.handle(new User()));
	});
});
