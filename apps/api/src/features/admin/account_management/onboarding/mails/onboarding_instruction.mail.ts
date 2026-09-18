import { BaseMail } from "@adonisjs/mail";

import Admin from "#models/admin";

type AdminOnboardingInstructionMailParams = {
	admin: Admin;
	onboardingUrl: URL;
};

export default class AdminOnboardingInstructionMail extends BaseMail {
	subject = "Vous avez été invité à rejoindre l'espace administrateur";

	constructor(private params: AdminOnboardingInstructionMailParams) {
		super();
	}

	prepare() {
		this.message.to(this.params.admin.email);
		this.message.htmlView(
			"../features/admin/account_management/onboarding/mails/onboarding_instruction.html",
			{
				admin: this.params.admin,
				onboardingUrl: this.params.onboardingUrl.toString(),
			},
		);
	}
}
