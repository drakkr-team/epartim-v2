import mail from "@adonisjs/mail/services/main";
import { test } from "@japa/runner";

import { UserFactory } from "#database/factories/user.factory";
import SendPasswordChangedNotification from "#features/user_management/password/jobs/send_password_changed_notification.job";
import PasswordChangedNotificationMail from "#features/user_management/password/mails/password_changed_notifiction.mail";

test.group(
	"Features / User Management / Password / Jobs / Send Password Changed Notification",
	() => {
		test("it should send the password changed notification email", async () => {
			const fakeMailer = mail.fake();

			const user = await UserFactory.create();
			const loginUrl = new URL("https://app.example.test/login");

			const job = new SendPasswordChangedNotification();
			job.$hydrate(
				{ user, loginUrl },
				{
					jobId: "test",
					name: SendPasswordChangedNotification.name,
					attempt: 1,
					queue: "default",
					priority: 5,
					acquiredAt: new Date(),
					stalledCount: 0,
				},
			);
			await job.execute();

			fakeMailer.mails.assertSent(PasswordChangedNotificationMail, ({ message }) => {
				return message.hasTo(user.email);
			});
		});
	},
);
