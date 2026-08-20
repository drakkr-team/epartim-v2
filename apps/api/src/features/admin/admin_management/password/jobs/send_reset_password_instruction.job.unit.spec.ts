import mail from "@adonisjs/mail/services/main";
import { test } from "@japa/runner";

import { UserFactory } from "#database/factories/user.factory";
import SendResetPasswordInstruction from "#features/user_management/password/jobs/send_reset_password_instruction.job";
import ResetPasswordInstructionMail from "#features/user_management/password/mails/reset_password_instruction.mail";

test.group("Features / User Management / Password / Jobs / Send Reset Password Instruction", () => {
	test("it should send the reset password instruction email", async () => {
		const fakeMailer = mail.fake();

		const user = await UserFactory.create();
		const resetPasswordUrl = new URL("https://app.example.test/reset-password?token=test-token");

		const job = new SendResetPasswordInstruction();
		job.$hydrate(
			{ user, resetPasswordUrl },
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
			return message.hasTo(user.email);
		});
	});
});
