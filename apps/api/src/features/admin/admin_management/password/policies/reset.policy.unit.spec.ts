import { test } from "@japa/runner";

import ResetPolicy from "#features/user_management/password/policies/reset.policy";

test.group("Features / User Management / Password / Policies / Reset Policy", () => {
	test("it should allow everyone", async ({ assert }) => {
		const resetPolicy = new ResetPolicy();
		const canHandle = await resetPolicy.handle();

		assert.isTrue(canHandle);
	});
});
