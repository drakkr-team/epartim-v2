import { randomBytes } from "node:crypto";

import { inject } from "@adonisjs/core";
import { HttpContext } from "@adonisjs/core/http";
import vine from "@vinejs/vine";

import EmailAlreadyExistsException from "#exceptions/email_already_exists.exception";
import CreateAdminPolicy from "#features/admin/admin_management/admins/policies/create.policy";
import Admin from "#models/admin";
import AdminPresenter from "#presenters/admin.presenter";
import { CreateAdminSchema } from "#validators/admin.validator";

@inject()
export default class CreateAdminController {
	constructor(protected adminPresenter: AdminPresenter) {}

	async handle({ request, response, bouncer }: HttpContext) {
		await bouncer.with(CreateAdminPolicy).authorize("handle");

		const payload = await request.validateUsing(CreateAdminController.payloadSchema);
		const existingAdmin = await Admin.findBy("email", payload.email);

		if (existingAdmin) {
			throw new EmailAlreadyExistsException();
		}

		const admin = await Admin.create({
			...payload,
			password: randomBytes(32).toString("base64url"),
		});

		return response.created(this.adminPresenter.toJSON(admin));
	}

	static payloadSchema = vine.create(CreateAdminSchema);
}
