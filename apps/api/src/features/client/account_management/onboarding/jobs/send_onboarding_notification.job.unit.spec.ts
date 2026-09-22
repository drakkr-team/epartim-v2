import mail from "@adonisjs/mail/services/main";
import { test } from "@japa/runner";

import { UserFactory } from "#database/factories/user.factory";
import SendUserOnboardingNotificationJob from "#features/client/account_management/onboarding/jobs/send_onboarding_notification.job";
import UserOnboardingInstructionMail from "#features/client/account_management/onboarding/mails/onboarding_instruction.mail";

test.group(
	"Features / Client / Account Management / Onboarding / Jobs / Send Onboarding Notification",
	() => {
		test("it should send the onboarding instruction email", async () => {
			const fakeMailer = mail.fake();
			const user = await UserFactory.apply("unactive").create();
			const onboardingUrl = new URL("https://client.example.test/onboarding?token=test-token");

			const job = new SendUserOnboardingNotificationJob();
			job.$hydrate(
				{ user, onboardingUrl },
				{
					jobId: "test",
					name: SendUserOnboardingNotificationJob.name,
					attempt: 1,
					queue: "emails",
					priority: 5,
					acquiredAt: new Date(),
					stalledCount: 0,
				},
			);
			await job.execute();

			fakeMailer.mails.assertSent(UserOnboardingInstructionMail, ({ message }) => {
				return message.hasTo(user.email);
			});
		});
	},
);
