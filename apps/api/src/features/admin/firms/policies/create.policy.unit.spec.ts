import { test } from "@japa/runner";

import CreateFirmPolicy from "#features/admin/firms/policies/create.policy";
import Admin from "#models/admin";
import User from "#models/user";

test.group("Features / Admin / Firms / Policies / Create Policy", () => {
	test("it should allow an admin", ({ assert }) => {
		const policy = new CreateFirmPolicy();

		assert.isTrue(policy.handle(new Admin()));
	});

	test("it should deny a user", ({ assert }) => {
		const policy = new CreateFirmPolicy();

		assert.isFalse(policy.handle(new User()));
	});
});
