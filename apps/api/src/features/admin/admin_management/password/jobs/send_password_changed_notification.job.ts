import mail from "@adonisjs/mail/services/main";
import { Job } from "@adonisjs/queue";
import type { JobOptions } from "@adonisjs/queue/types";

import PasswordChangedNotificationMail from "#features/admin/admin_management/password/mails/password_changed_notifiction.mail";
import Admin from "#models/admin";

interface Payload {
	admin: Admin
	loginUrl: URL;
}

export default class SendPasswordChangedNotification extends Job<Payload> {
	static options: JobOptions = {
		queue: "emails",
	};

	async execute() {
		const { admin, loginUrl } = this.payload;

		await mail.send(new PasswordChangedNotificationMail({ admin, loginUrl }));
	}
}
