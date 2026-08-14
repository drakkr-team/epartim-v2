import { BaseMail } from "@adonisjs/mail";

import User from "#models/user";

export default class AccountInvitationMail extends BaseMail {
	subject = "Activez votre compte Epartim";

	constructor(private params: AccountInvitationMailDTO) {
		super();
	}

	prepare() {
		this.message.to(this.params.user.email);
		this.message.htmlView(
			"../features/user_management/administration/mails/account_invitation.html",
			{
				user: this.params.user,
				activationUrl: this.params.activationUrl.toString(),
			},
		);
	}
}

type AccountInvitationMailDTO = {
	user: User;
	activationUrl: URL;
};
