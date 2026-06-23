import mail from "@adonisjs/mail/services/main";
import { Job } from "@adonisjs/queue";
import type { JobOptions } from "@adonisjs/queue/types";

import AccountDeletedNotificationMail from "#features/user_management/profile/mails/account_deleted_notification.mail";
import User from "#models/user";

interface Payload {
	user: User;
}

export default class SendAccountDeletedNotification extends Job<Payload> {
	static options: JobOptions = {
		queue: "emails",
	};

	async execute() {
		const { user } = this.payload;

		await mail.send(new AccountDeletedNotificationMail({ user }));
	}
}
