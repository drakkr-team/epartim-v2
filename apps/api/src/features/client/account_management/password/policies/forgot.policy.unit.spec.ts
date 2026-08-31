import { test } from "@japa/runner";

import ForgotPolicy from "#features/client/account_management/password/policies/forgot.policy";

test.group("Features / Account Management / Password / Policies / Forgot Policy", () => {
	test("it should allow everyone", async ({ assert }) => {
		const forgotPolicy = new ForgotPolicy();
		const canHandle = await forgotPolicy.handle();

		assert.isTrue(canHandle);
	});
});
