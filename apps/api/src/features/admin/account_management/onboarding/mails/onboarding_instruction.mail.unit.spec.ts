import { test } from "@japa/runner";

import { AdminFactory } from "#database/factories/admin.factory";
import AdminOnboardingInstructionMail from "#features/admin/account_management/onboarding/mails/onboarding_instruction.mail";

test.group(
	"Features / Admin / Account Management / Onboarding / Mails / Onboarding Instruction Mail",
	() => {
		test("it should render the onboarding instruction email", async () => {
			const admin = await AdminFactory.apply("unactive")
				.merge({
					name: "Alex Martin",
					email: "onboarding@example.com",
				})
				.with("role")
				.create();
			const onboardingUrl = new URL("https://admin.example.test/onboarding?token=test-token");
			const email = new AdminOnboardingInstructionMail({ admin, onboardingUrl });

			await email.buildWithContents();

			email.message.assertTo(admin.email);
			email.message.assertHtmlIncludes(admin.name);
			email.message.assertHtmlIncludes(onboardingUrl.toString());
		});
	},
);
