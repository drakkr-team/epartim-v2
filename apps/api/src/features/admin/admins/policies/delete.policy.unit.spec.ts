import { test } from "@japa/runner";

import DeleteAdminPolicy from "#features/admin/admins/policies/delete.policy";
import Admin from "#models/admin";
import User from "#models/user";

test.group("Features / Admin / Admins / Policies / Delete Policy", () => {
	test("it should allow an admin to delete another admin", ({ assert }) => {
		const policy = new DeleteAdminPolicy();
		const currentAdmin = new Admin();
		currentAdmin.id = 1;

		const canDelete = policy.handle(currentAdmin, 2);

		assert.isTrue(canDelete);
	});

	test("it should deny an admin deleting itself", ({ assert }) => {
		const policy = new DeleteAdminPolicy();
		const currentAdmin = new Admin();
		currentAdmin.id = 1;

		const canDelete = policy.handle(currentAdmin, currentAdmin.id);

		assert.isFalse(canDelete);
	});

	test("it should deny a user", ({ assert }) => {
		const policy = new DeleteAdminPolicy();

		const canDelete = policy.handle(new User(), 1);

		assert.isFalse(canDelete);
	});
});
