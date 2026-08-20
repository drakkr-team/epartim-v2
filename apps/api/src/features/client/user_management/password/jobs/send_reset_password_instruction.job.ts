import mail from "@adonisjs/mail/services/main";
import { Job } from "@adonisjs/queue";
import type { JobOptions } from "@adonisjs/queue/types";

import ResetPasswordInstructionMail from "#features/user_management/password/mails/reset_password_instruction.mail";
import User from "#models/user";

type Payload = {
	user: User;
	resetPasswordUrl: URL;
};

export default class SendResetPasswordInstruction extends Job<Payload> {
	static options: JobOptions = {
		queue: "emails",
	};

	async execute() {
		const { user, resetPasswordUrl } = this.payload;

		await mail.send(new ResetPasswordInstructionMail({ user, resetPasswordUrl }));
	}
}
