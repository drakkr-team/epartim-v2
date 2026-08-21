import { test } from "@japa/runner";

import { AdminFactory } from "#database/factories/admin.factory";
import ResetPasswordInstructionMail from "#features/admin/account_management/password/mails/reset_password_instruction.mail";

test.group(
	"Features / Admin / Admin Management / Password / Mails / Reset Password Instruction Mail",
	() => {
		test("it should render the reset password instruction email", async () => {
			const admin = await AdminFactory.create();
			const resetPasswordUrl = new URL("https://app.example.test/reset-password?token=test-token");
			const email = new ResetPasswordInstructionMail({ admin, resetPasswordUrl });

			await email.buildWithContents();

			email.message.assertTo(admin.email);

			email.message.assertHtmlIncludes(admin.name);
			email.message.assertHtmlIncludes(resetPasswordUrl.toString());
		});
	},
);
