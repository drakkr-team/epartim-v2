import { test } from "@japa/runner";

import ResetPolicy from "#features/admin/admin_management/password/policies/reset.policy";

test.group("Features / Admin / Admin Management / Password / Policies / Reset Policy", () => {
	test("it should allow everyone", async ({ assert }) => {
		const resetPolicy = new ResetPolicy();
		const canHandle = await resetPolicy.handle();

		assert.isTrue(canHandle);
	});
});
