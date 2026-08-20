import { BaseMail } from "@adonisjs/mail";

import Admin from "#models/admin";

export default class ResetPasswordInstructionMail extends BaseMail {
	subject = "Réinitialisation de votre mot de passe";

	constructor(private params: ResetPasswordInstructionMailDTO) {
		super();
	}

	prepare() {
		this.message.to(this.params.admin.email);
		this.message.htmlView(
			"../features/admin/admin_management/password/mails/reset_password_instruction.html",
			{
				admin: this.params.admin,
				resetPasswordUrl: this.params.resetPasswordUrl.toString(),
			},
		);
	}
}

type ResetPasswordInstructionMailDTO = {
	admin: Admin;
	resetPasswordUrl: URL;
};
