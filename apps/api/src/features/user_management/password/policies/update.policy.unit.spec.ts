import { test } from "@japa/runner";

import UpdatePolicy from "#features/user_management/password/policies/update.policy";

test.group("Features / User Management / Password / Policies / Update Policy", () => {
	test("it should allow everyone", async ({ assert }) => {
		const updatePolicy = new UpdatePolicy();
		const canHandle = await updatePolicy.handle();

		assert.isTrue(canHandle);
	});
});
