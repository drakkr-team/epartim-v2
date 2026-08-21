import { test } from "@japa/runner";

import LoginPolicy from "#features/admin/admin_management/authentication/policies/login.policy";

test.group("Features / Admin / Admin Management / Authentication / Policies / Login Policy", () => {
	test("it should allow everyone", async ({ assert }) => {
		const loginPolicy = new LoginPolicy();
		const canLogin = loginPolicy.handle();

		assert.isTrue(canLogin);
	});
});
