import { test } from "@japa/runner";

import ForgotPolicy from "#features/user_management/password/policies/forgot.policy";

test.group("Features / User Management / Password / Policies / Forgot Policy", () => {
	test("it should allow everyone", async ({ assert }) => {
		const forgotPolicy = new ForgotPolicy();
		const canHandle = await forgotPolicy.handle();

		assert.isTrue(canHandle);
	});
});
