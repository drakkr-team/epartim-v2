import { inject } from "@adonisjs/core";
import { HttpContext } from "@adonisjs/core/http";
import vine from "@vinejs/vine";

import ResetPolicy from "#features/user_management/password/policies/reset.policy";
import PasswordService from "#features/user_management/password/services/password.service";
import { UserPasswordValidator } from "#validators/user.validator";

@inject()
export default class ResetPasswordController {
	constructor(protected passwordService: PasswordService) {}

	async handle({ request, bouncer }: HttpContext) {
		await bouncer.with(ResetPolicy).authorize("handle");

		const { token, newPassword } = await request.validateUsing(
			ResetPasswordController.payloadSchema,
		);

		await this.passwordService.reset({ token, newPassword });

		return null;
	}

	static payloadSchema = vine.create({
		token: vine.string(),
		newPassword: UserPasswordValidator,
	});
}
