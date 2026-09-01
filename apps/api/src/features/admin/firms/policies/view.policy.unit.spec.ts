import { test } from "@japa/runner";

import ViewFirmPolicy from "#features/admin/firms/policies/view.policy";
import Admin from "#models/admin";
import User from "#models/user";

test.group("Features / Admin / Firms / Policies / View Policy", () => {
	test("it should allow an admin", ({ assert }) => {
		const policy = new ViewFirmPolicy();

		assert.isTrue(policy.handle(new Admin()));
	});

	test("it should deny a user", ({ assert }) => {
		const policy = new ViewFirmPolicy();

		assert.isFalse(policy.handle(new User()));
	});
});
