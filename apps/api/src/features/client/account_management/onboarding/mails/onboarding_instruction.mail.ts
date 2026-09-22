import { BaseMail } from "@adonisjs/mail";

import User from "#models/user";

type UserOnboardingInstructionMailParams = {
	user: User;
	onboardingUrl: URL;
};

export default class UserOnboardingInstructionMail extends BaseMail {
	subject = "Vous avez été invité à rejoindre ePartim";

	constructor(private params: UserOnboardingInstructionMailParams) {
		super();
	}

	prepare() {
		this.message.to(this.params.user.email);
		this.message.htmlView(
			"../features/client/account_management/onboarding/mails/onboarding_instruction.html",
			{
				user: this.params.user,
				onboardingUrl: this.params.onboardingUrl.toString(),
			},
		);
	}
}
