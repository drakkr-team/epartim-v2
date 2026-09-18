import mail from "@adonisjs/mail/services/main";
import { test } from "@japa/runner";

import { AdminFactory } from "#database/factories/admin.factory";
import SendAdminOnboardingNotificationJob from "#features/admin/account_management/onboarding/jobs/send_onboarding_notification.job";
import AdminOnboardingInstructionMail from "#features/admin/account_management/onboarding/mails/onboarding_instruction.mail";

test.group(
	"Features / Admin / Account Management / Onboarding / Jobs / Send Onboarding Notification",
	() => {
		test("it should send the onboarding instruction email", async () => {
			const fakeMailer = mail.fake();
			const admin = await AdminFactory.apply("unactive").with("role").create();
			const onboardingUrl = new URL("https://admin.example.test/onboarding?token=test-token");

			const job = new SendAdminOnboardingNotificationJob();
			job.$hydrate(
				{ admin, onboardingUrl },
				{
					jobId: "test",
					name: SendAdminOnboardingNotificationJob.name,
					attempt: 1,
					queue: "emails",
					priority: 5,
					acquiredAt: new Date(),
					stalledCount: 0,
				},
			);
			await job.execute();

			fakeMailer.mails.assertSent(AdminOnboardingInstructionMail, ({ message }) => {
				return message.hasTo(admin.email);
			});
		});
	},
);
