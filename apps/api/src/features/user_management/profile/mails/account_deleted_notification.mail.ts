import { BaseMail } from "@adonisjs/mail";

import User from "#models/user";

export default class AccountDeletedNotificationMail extends BaseMail {
	subject = "Votre compte a été définitivement supprimé";

	constructor(private params: AccountDeletedNotificationMailDTO) {
		super();
	}

	prepare() {
		const { user } = this.params;

		this.message.to(user.email);
		this.message.htmlView(
			"../features/user_management/profile/mails/account_deleted_notification.html",
			{
				user,
			},
		);
	}
}

type AccountDeletedNotificationMailDTO = {
	user: User;
};
