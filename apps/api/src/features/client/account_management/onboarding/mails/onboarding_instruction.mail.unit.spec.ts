import { test } from "@japa/runner";

import { UserFactory } from "#database/factories/user.factory";
import UserOnboardingInstructionMail from "#features/client/account_management/onboarding/mails/onboarding_instruction.mail";

test.group(
	"Features / Client / Account Management / Onboarding / Mails / Onboarding Instruction Mail",
	() => {
		test("it should render the onboarding instruction email", async () => {
			const user = await UserFactory.apply("unactive")
				.merge({
					firstName: "Alex",
					lastName: "Martin",
					email: "onboarding@example.com",
				})
				.create();
			const onboardingUrl = new URL("https://client.example.test/onboarding?token=test-token");
			const email = new UserOnboardingInstructionMail({ user, onboardingUrl });

			await email.buildWithContents();

			email.message.assertTo(user.email);
			email.message.assertHtmlIncludes(user.name);
			email.message.assertHtmlIncludes(onboardingUrl.toString());
		});
	},
);
