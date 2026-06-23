import { BaseMail } from "@adonisjs/mail";

import User from "#models/user";

export default class ResetPasswordInstructionMail extends BaseMail {
	subject = "Réinitialisation de votre mot de passe";

	constructor(private params: ResetPasswordInstructionMailDTO) {
		super();
	}

	prepare() {
		this.message.to(this.params.user.email);
		this.message.htmlView(
			"../features/user_management/password/mails/reset_password_instruction.html",
			{
				user: this.params.user,
				resetPasswordUrl: this.params.resetPasswordUrl.toString(),
			},
		);
	}
}

type ResetPasswordInstructionMailDTO = {
	user: User;
	resetPasswordUrl: URL;
};
