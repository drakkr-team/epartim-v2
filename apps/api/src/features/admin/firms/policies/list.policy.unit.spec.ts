import { test } from "@japa/runner";

import ListFirmsPolicy from "#features/admin/firms/policies/list.policy";
import Admin from "#models/admin";
import User from "#models/user";

test.group("Features / Admin / Firms / Policies / List Policy", () => {
	test("it should allow an admin", ({ assert }) => {
		const policy = new ListFirmsPolicy();

		assert.isTrue(policy.handle(new Admin()));
	});

	test("it should deny a user", ({ assert }) => {
		const policy = new ListFirmsPolicy();

		assert.isFalse(policy.handle(new User()));
	});
});
