import { inject } from "@adonisjs/core";
import { HttpContext } from "@adonisjs/core/http";
import vine from "@vinejs/vine";

import CreateFirmPolicy from "#features/admin/firms/policies/create.policy";
import CreateFirmService from "#features/admin/firms/services/create.service";
import FirmPresenter from "#presenters/firm.presenter";
import { CreateFirmSchema } from "#validators/firm.validator";

@inject()
export default class CreateFirmController {
	constructor(
		protected createFirmService: CreateFirmService,
		protected firmPresenter: FirmPresenter,
	) {}

	async handle({ request, response, bouncer }: HttpContext) {
		await bouncer.with(CreateFirmPolicy).authorize("handle");

		const payload = await request.validateUsing(CreateFirmController.payloadSchema);
		const firm = await this.createFirmService.handle(payload);

		return response.created(this.firmPresenter.toJSON(firm));
	}

	static payloadSchema = vine.create(CreateFirmSchema);
}
