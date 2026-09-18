import mail from "@adonisjs/mail/services/main";
import { Job } from "@adonisjs/queue";
import { JobOptions } from "@adonisjs/queue/types";

import AdminOnboardingInstructionMail from "#features/admin/admins/mails/onboarding_instruction.mail";
import Admin from "#models/admin";

interface Payload {
	admin: Admin;
	onboardingUrl: URL;
}

export default class SendAdminOnboardingNotificationJob extends Job<Payload> {
	static options: JobOptions = {
		queue: "emails",
	};

	async execute() {
		const { admin, onboardingUrl } = this.payload;

		await mail.send(new AdminOnboardingInstructionMail({ admin, onboardingUrl }));
	}
}
