import { inject } from "@adonisjs/core";
import { HttpContext } from "@adonisjs/core/http";
import vine from "@vinejs/vine";

import UpdateUserPolicy from "#features/admin/users/policies/update.policy";
import User from "#models/user";
import UserPresenter from "#presenters/user.presenter";
import { UpdateUserSchema } from "#validators/user.validator";

@inject()
export default class UpdateUserController {
	constructor(protected userPresenter: UserPresenter) {}

	async handle({ params, request, bouncer }: HttpContext) {
		const { userId } = params;

		await bouncer.with(UpdateUserPolicy).authorize("handle");

		const payload = await request.validateUsing(UpdateUserController.payloadSchema);

		const user = await User.findOrFail(userId);
		await user.merge(payload).save();

		return this.userPresenter.toJSON(user);
	}

	static payloadSchema = vine.create(UpdateUserSchema);
}
