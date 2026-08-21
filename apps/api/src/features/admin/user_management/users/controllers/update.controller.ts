import { inject } from "@adonisjs/core";
import { HttpContext } from "@adonisjs/core/http";
import vine from "@vinejs/vine";

import UpdateUserPolicy from "#features/admin/user_management/users/policies/update.policy";
import User from "#models/user";
import UserPresenter from "#presenters/user.presenter";
import { UpdateManagedUserSchema } from "#validators/user.validator";

@inject()
export default class UpdateUserController {
	constructor(protected userPresenter: UserPresenter) {}

	async handle({ params, request, response, bouncer }: HttpContext) {
		await bouncer.with(UpdateUserPolicy).authorize("handle");

		const id = Number(params.id);

		if (!Number.isSafeInteger(id) || id < 1) {
			return response.notFound();
		}

		const user = await User.find(id);

		if (!user) {
			return response.notFound();
		}

		const payload = await request.validateUsing(UpdateUserController.payloadSchema);

		await user.merge(payload).save();

		return this.userPresenter.toJSON(user);
	}

	static payloadSchema = vine.create(UpdateManagedUserSchema);
}
