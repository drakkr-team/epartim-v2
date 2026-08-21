import { test } from "@japa/runner";

import { AdminFactory } from "#database/factories/admin.factory";
import CannotDeleteSelfException from "#exceptions/cannot_delete_self.exception";
import DeleteAdminPolicy from "#features/admin/admin_management/admins/policies/delete.policy";

test.group("Features / Admin / Admin Management / Admins / Policies / Delete Policy", () => {
	test("it should allow deleting another administrator", async ({ assert }) => {
		const authenticatedAdmin = await AdminFactory.merge({ id: 1 }).make();
		const targetAdmin = await AdminFactory.merge({ id: 2 }).make();
		const policy = new DeleteAdminPolicy();

		assert.isTrue(policy.handle(authenticatedAdmin, targetAdmin));
	});

	test("it should reject deleting the authenticated administrator", async ({ assert }) => {
		const authenticatedAdmin = await AdminFactory.make();
		const policy = new DeleteAdminPolicy();

		assert.throws(
			() => policy.handle(authenticatedAdmin, authenticatedAdmin),
			CannotDeleteSelfException,
		);
	});
});
