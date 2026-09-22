import mail from "@adonisjs/mail/services/main";
import { Job } from "@adonisjs/queue";
import type { JobOptions } from "@adonisjs/queue/types";

import UserOnboardingInstructionMail from "#features/client/account_management/onboarding/mails/onboarding_instruction.mail";
import User from "#models/user";

interface Payload {
	user: User;
	onboardingUrl: URL;
}

export default class SendUserOnboardingNotificationJob extends Job<Payload> {
	static options: JobOptions = {
		queue: "emails",
	};

	async execute() {
		const { user, onboardingUrl } = this.payload;

		await mail.send(new UserOnboardingInstructionMail({ user, onboardingUrl }));
	}
}
