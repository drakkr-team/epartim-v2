import mail from "@adonisjs/mail/services/main";
import { test } from "@japa/runner";

import { AdminFactory } from "#database/factories/admin.factory";
import SendResetPasswordInstruction from "#features/admin/account_management/password/jobs/send_reset_password_instruction.job";
import ResetPasswordInstructionMail from "#features/admin/account_management/password/mails/reset_password_instruction.mail";

test.group(
	"Features / Admin / Account Management / Password / Jobs / Send Reset Password Instruction",
	() => {
		test("it should send the reset password instruction email", async () => {
			const fakeMailer = mail.fake();

			const admin = await AdminFactory.create();
			const resetPasswordUrl = new URL("https://app.example.test/reset-password?token=test-token");

			const job = new SendResetPasswordInstruction();
			job.$hydrate(
				{ admin, resetPasswordUrl },
				{
					jobId: "test",
					name: SendResetPasswordInstruction.name,
					attempt: 1,
					queue: "default",
					priority: 5,
					acquiredAt: new Date(),
					stalledCount: 0,
				},
			);
			await job.execute();

			fakeMailer.mails.assertSent(ResetPasswordInstructionMail, ({ message }) => {
				return message.hasTo(admin.email);
			});
		});
	},
);
