import mail from "@adonisjs/mail/services/main";
import { Job } from "@adonisjs/queue";
import type { JobOptions } from "@adonisjs/queue/types";

import ResetPasswordInstructionMail from "#features/admin/admin_management/password/mails/reset_password_instruction.mail";
import Admin from "#models/admin";

type Payload = {
	admin: Admin;
	resetPasswordUrl: URL;
};

export default class SendResetPasswordInstruction extends Job<Payload> {
	static options: JobOptions = {
		queue: "emails",
	};

	async execute() {
		const { admin, resetPasswordUrl } = this.payload;

		await mail.send(new ResetPasswordInstructionMail({ admin, resetPasswordUrl }));
	}
}
