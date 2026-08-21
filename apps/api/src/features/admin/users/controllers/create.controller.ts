import { randomBytes } from "node:crypto";

import { inject } from "@adonisjs/core";
import { HttpContext } from "@adonisjs/core/http";
import vine from "@vinejs/vine";

import CreateUserPolicy from "#features/admin/users/policies/create.policy";
import User from "#models/user";
import UserPresenter from "#presenters/user.presenter";
import { CreateUserSchema } from "#validators/user.validator";

@inject()
export default class CreateUserController {
	constructor(protected userPresenter: UserPresenter) {}

	async handle({ request, response, bouncer }: HttpContext) {
		await bouncer.with(CreateUserPolicy).authorize("handle");

		const payload = await request.validateUsing(CreateUserController.payloadSchema);

		const user = await User.create({
			...payload,
			password: randomBytes(32).toString("base64url"),
		});

		return response.created(this.userPresenter.toJSON(user));
	}

	static payloadSchema = vine.create(CreateUserSchema);
}
