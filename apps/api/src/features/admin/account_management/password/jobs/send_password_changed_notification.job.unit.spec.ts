import mail from "@adonisjs/mail/services/main";
import { test } from "@japa/runner";

import { AdminFactory } from "#database/factories/admin.factory";
import SendPasswordChangedNotification from "#features/admin/account_management/password/jobs/send_password_changed_notification.job";
import PasswordChangedNotificationMail from "#features/admin/account_management/password/mails/password_changed_notifiction.mail";

test.group(
	"Features / Admin / Admin Management / Password / Jobs / Send Password Changed Notification",
	() => {
		test("it should send the password changed notification email", async () => {
			const fakeMailer = mail.fake();

			const admin = await AdminFactory.create();
			const loginUrl = new URL("https://app.example.test/login");

			const job = new SendPasswordChangedNotification();
			job.$hydrate(
				{ admin, loginUrl },
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
				return message.hasTo(admin.email);
			});
		});
	},
);
