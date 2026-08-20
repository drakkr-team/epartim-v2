import mail from "@adonisjs/mail/services/main";
import { Job } from "@adonisjs/queue";
import type { JobOptions } from "@adonisjs/queue/types";

import AccountInvitationMail from "#features/user_management/administration/mails/account_invitation.mail";
import User from "#models/user";

type Payload = {
	user: User;
	activationUrl: URL;
};

export default class SendAccountInvitation extends Job<Payload> {
	static options: JobOptions = {
		queue: "emails",
	};

	async execute() {
		const { user, activationUrl } = this.payload;
		await mail.send(new AccountInvitationMail({ user, activationUrl }));
	}
}
