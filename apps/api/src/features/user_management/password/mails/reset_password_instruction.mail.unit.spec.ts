import { test } from "@japa/runner";

import { UserFactory } from "#database/factories/user.factory";
import ResetPasswordInstructionMail from "#features/user_management/password/mails/reset_password_instruction.mail";

test.group(
	"Features / User Management / Password / Mails / Reset Password Instruction Mail",
	() => {
		test("it should render the reset password instruction email", async () => {
			const user = await UserFactory.create();
			const resetPasswordUrl = new URL("https://app.example.test/reset-password?token=test-token");
			const email = new ResetPasswordInstructionMail({ user, resetPasswordUrl });

			await email.buildWithContents();

			email.message.assertTo(user.email);

			email.message.assertHtmlIncludes(user.name);
			email.message.assertHtmlIncludes(resetPasswordUrl.toString());
		});
	},
);
