import { BaseMail } from "@adonisjs/mail";

import User from "#models/user";

export default class PasswordChangedNotificationMail extends BaseMail {
	subject = "Votre mot de passe a été modifié";

	constructor(private params: PasswordChangedNotificationMailDTO) {
		super();
	}

	prepare() {
		this.message.to(this.params.user.email);
		this.message.htmlView(
			"../features/user_management/password/mails/password_changed_notification.html",
			{
				user: this.params.user,
				loginUrl: this.params.loginUrl,
			},
		);
	}
}

type PasswordChangedNotificationMailDTO = {
	user: User;
	loginUrl: URL;
};
