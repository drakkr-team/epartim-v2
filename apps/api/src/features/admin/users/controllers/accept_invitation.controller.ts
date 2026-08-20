import { inject } from "@adonisjs/core";
import { HttpContext } from "@adonisjs/core/http";
import vine from "@vinejs/vine";

import InvitationActivationService from "#features/admin/users/services/invitation_activation.service";
import UserPresenter from "#presenters/user.presenter";
import { UserPasswordValidator } from "#validators/user.validator";

@inject()
export default class AcceptInvitationController {
	constructor(
		private invitationActivationService: InvitationActivationService,
		private userPresenter: UserPresenter,
	) {}

	async handle({ request }: HttpContext) {
		const { token, password } = await request.validateUsing(
			AcceptInvitationController.payloadSchema,
		);
		const user = await this.invitationActivationService.accept(token, password);
		return this.userPresenter.toJSON(user);
	}

	static payloadSchema = vine.create({
		token: vine.string(),
		password: UserPasswordValidator,
	});
}
