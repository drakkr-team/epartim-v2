import { inject } from "@adonisjs/core";
import { HttpContext } from "@adonisjs/core/http";
import vine from "@vinejs/vine";

import UpdateProfilePolicy from "#features/client/user_management/profile/policies/update.policy";
import User from "#models/user";
import UserPresenter from "#presenters/user.presenter";
import { UpdateUserSchema } from "#validators/user.validator";

@inject()
export default class UpdateProfileController {
	constructor(protected userPresenter: UserPresenter) {}

	async handle({ request, auth, bouncer }: HttpContext) {
		await bouncer.with(UpdateProfilePolicy).authorize("handle");

		const user = auth.user as User;

		const payload = await request.validateUsing(UpdateProfileController.payloadSchema);

		await user.merge(payload).save();

		return this.userPresenter.toJSON(user);
	}

	static payloadSchema = vine.create(UpdateUserSchema);
}
