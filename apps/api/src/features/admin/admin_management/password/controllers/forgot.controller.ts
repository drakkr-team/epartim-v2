import { inject } from "@adonisjs/core";
import { HttpContext } from "@adonisjs/core/http";
import vine from "@vinejs/vine";

import ForgotPolicy from "#features/user_management/password/policies/forgot.policy";
import PasswordService from "#features/user_management/password/services/password.service";

@inject()
export default class ForgotPasswordController {
	constructor(protected passwordService: PasswordService) {}

	async handle({ request, bouncer }: HttpContext) {
		await bouncer.with(ForgotPolicy).authorize("handle");

		const { email } = await request.validateUsing(ForgotPasswordController.payloadSchema);

		await this.passwordService.forgot(email);

		return null;
	}

	static payloadSchema = vine.create({
		email: vine.string().email(),
	});
}
