import { test } from "@japa/runner";

import LogoutPolicy from "#features/user_management/authentication/policies/logout.policy";

test.group("Features / User Management / Authentication / Policies / Logout Policy", () => {
	test("it should allow everyone to logout", async ({ assert }) => {
		const logoutPolicy = new LogoutPolicy();
		const canLogout = logoutPolicy.handle();

		assert.isTrue(canLogout);
	});
});
