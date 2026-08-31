import { inject } from "@adonisjs/core";
import { HttpContext } from "@adonisjs/core/http";

import DeleteFirmPolicy from "#features/admin/firms/policies/delete.policy";
import UpdateFirmPolicy from "#features/admin/firms/policies/update.policy";
import ViewFirmPolicy from "#features/admin/firms/policies/view.policy";
import ViewFirmService from "#features/admin/firms/services/view.service";
import FirmPresenter from "#presenters/firm.presenter";

@inject()
export default class ViewFirmController {
	constructor(
		protected viewFirmService: ViewFirmService,
		protected firmPresenter: FirmPresenter,
	) {}

	async handle({ params, bouncer }: HttpContext) {
		await bouncer.with(ViewFirmPolicy).authorize("handle");

		const firm = await this.viewFirmService.handle(params.firmId);

		return {
			...this.firmPresenter.toJSON(firm),
			meta: {
				canUpdate: await bouncer.with(UpdateFirmPolicy).allows("handle"),
				canDelete: await bouncer.with(DeleteFirmPolicy).allows("handle"),
			},
		};
	}
}
