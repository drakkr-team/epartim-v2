import { test } from "@japa/runner";

import DeleteUserPolicy from "#features/admin/users/policies/delete.policy";
import Admin from "#models/admin";
import User from "#models/user";

test.group("Features / Admin / Users / Policies / Delete Policy", () => {
	test("it should allow an admin to delete a user", ({ assert }) => {
		const policy = new DeleteUserPolicy();

		const canDelete = policy.handle(new Admin(), 1);

		assert.isTrue(canDelete);
	});

	test("it should deny a user", ({ assert }) => {
		const policy = new DeleteUserPolicy();

		const canDelete = policy.handle(new User(), 1);

		assert.isFalse(canDelete);
	});
});
