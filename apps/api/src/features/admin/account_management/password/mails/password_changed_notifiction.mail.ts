import { BaseMail } from "@adonisjs/mail";

import Admin from "#models/admin";

export default class PasswordChangedNotificationMail extends BaseMail {
	subject = "Votre mot de passe a été modifié";

	constructor(private params: PasswordChangedNotificationMailDTO) {
		super();
	}

	prepare() {
		this.message.to(this.params.admin.email);
		this.message.htmlView(
			"../features/admin/account_management/password/mails/password_changed_notification.html",
			{
				admin: this.params.admin,
				loginUrl: this.params.loginUrl,
			},
		);
	}
}

type PasswordChangedNotificationMailDTO = {
	admin: Admin;
	loginUrl: URL;
};
