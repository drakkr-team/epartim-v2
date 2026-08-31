import { test } from "@japa/runner";

import UpdateFirmPolicy from "#features/admin/firms/policies/update.policy";
import Admin from "#models/admin";
import User from "#models/user";

test.group("Features / Admin / Firms / Policies / Update Policy", () => {
	test("it should allow an admin", ({ assert }) => {
		const policy = new UpdateFirmPolicy();

		assert.isTrue(policy.handle(new Admin()));
	});

	test("it should deny a user", ({ assert }) => {
		const policy = new UpdateFirmPolicy();

		assert.isFalse(policy.handle(new User()));
	});
});
