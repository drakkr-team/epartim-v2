import { test } from "@japa/runner";

import ViewUserPolicy from "#features/admin/users/policies/view.policy";
import Admin from "#models/admin";
import User from "#models/user";

test.group("Features / Admin / Users / Policies / View Policy", () => {
	test("it should allow an admin", ({ assert }) => {
		const policy = new ViewUserPolicy();

		const canView = policy.handle(new Admin());

		assert.isTrue(canView);
	});

	test("it should deny a user", ({ assert }) => {
		const policy = new ViewUserPolicy();

		const canView = policy.handle(new User());

		assert.isFalse(canView);
	});
});
