import { inject } from "@adonisjs/core";
import { HttpContext } from "@adonisjs/core/http";
import vine from "@vinejs/vine";

import UpdatePolicy from "#features/user_management/password/policies/update.policy";
import PasswordService from "#features/user_management/password/services/password.service";
import { UserPasswordValidator } from "#validators/user.validator";

@inject()
export default class UpdatePasswordController {
	constructor(protected passwordService: PasswordService) {}

	async handle({ request, bouncer }: HttpContext) {
		await bouncer.with(UpdatePolicy).authorize("handle");

		const { currentPassword, newPassword } = await request.validateUsing(
			UpdatePasswordController.payloadSchema,
		);

		await this.passwordService.update({
			currentPassword,
			newPassword,
		});

		return null;
	}

	static payloadSchema = vine.create({
		currentPassword: vine.string(),
		newPassword: UserPasswordValidator,
	});
}
