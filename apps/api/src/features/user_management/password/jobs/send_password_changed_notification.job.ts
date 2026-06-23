import mail from "@adonisjs/mail/services/main";
import { Job } from "@adonisjs/queue";
import type { JobOptions } from "@adonisjs/queue/types";

import PasswordChangedNotificationMail from "#features/user_management/password/mails/password_changed_notifiction.mail";
import User from "#models/user";

interface Payload {
	user: User;
	loginUrl: URL;
}

export default class SendPasswordChangedNotification extends Job<Payload> {
	static options: JobOptions = {
		queue: "emails",
	};

	async execute() {
		const { user, loginUrl } = this.payload;

		await mail.send(new PasswordChangedNotificationMail({ user, loginUrl }));
	}
}
