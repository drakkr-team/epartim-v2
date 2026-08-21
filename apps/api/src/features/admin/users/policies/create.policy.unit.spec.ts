import { test } from "@japa/runner";

import CreateUserPolicy from "#features/admin/users/policies/create.policy";
import Admin from "#models/admin";
import User from "#models/user";

test.group("Features / Admin / Users / Policies / Create Policy", () => {
	test("it should allow an admin", ({ assert }) => {
		const policy = new CreateUserPolicy();

		const canCreate = policy.handle(new Admin());

		assert.isTrue(canCreate);
	});

	test("it should deny a user", ({ assert }) => {
		const policy = new CreateUserPolicy();

		const canCreate = policy.handle(new User());

		assert.isFalse(canCreate);
	});
});
