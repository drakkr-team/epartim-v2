import { test } from "@japa/runner";

import DeleteFirmPolicy from "#features/admin/firms/policies/delete.policy";
import Admin from "#models/admin";
import User from "#models/user";

test.group("Features / Admin / Firms / Policies / Delete Policy", () => {
	test("it should allow an admin", ({ assert }) => {
		const policy = new DeleteFirmPolicy();

		assert.isTrue(policy.handle(new Admin()));
	});

	test("it should deny a user", ({ assert }) => {
		const policy = new DeleteFirmPolicy();

		assert.isFalse(policy.handle(new User()));
	});
});
