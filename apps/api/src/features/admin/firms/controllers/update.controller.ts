import { inject } from "@adonisjs/core";
import { HttpContext } from "@adonisjs/core/http";
import vine from "@vinejs/vine";

import UpdateFirmPolicy from "#features/admin/firms/policies/update.policy";
import UpdateFirmService from "#features/admin/firms/services/update.service";
import FirmPresenter from "#presenters/firm.presenter";
import { UpdateFirmSchema } from "#validators/firm.validator";

@inject()
export default class UpdateFirmController {
	constructor(
		protected updateFirmService: UpdateFirmService,
		protected firmPresenter: FirmPresenter,
	) {}

	async handle({ params, request, bouncer }: HttpContext) {
		await bouncer.with(UpdateFirmPolicy).authorize("handle");

		const payload = await request.validateUsing(UpdateFirmController.payloadSchema, {
			meta: { firmId: Number(params.firmId) },
		});
		const firm = await this.updateFirmService.handle(params.firmId, payload);

		return this.firmPresenter.toJSON(firm);
	}

	static payloadSchema = vine.withMetaData<{ firmId: number }>().create(UpdateFirmSchema);
}
