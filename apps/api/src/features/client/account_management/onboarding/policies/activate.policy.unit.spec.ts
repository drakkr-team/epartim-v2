import { test } from "@japa/runner";

import ActivatePolicy from "#features/client/account_management/onboarding/policies/activate.policy";

test.group(
	"Features / Client / Account Management / Onboarding / Policies / Activate Policy",
	() => {
		test("it should allow guests", async ({ assert }) => {
			const canHandle = await new ActivatePolicy().handle();

			assert.isTrue(canHandle);
		});
	},
);
