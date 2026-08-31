import { inject } from "@adonisjs/core";
import { HttpContext } from "@adonisjs/core/http";
import vine from "@vinejs/vine";

import UpdateNetworkPolicy from "#features/admin/networks/policies/update.policy";
import UpdateNetworkService from "#features/admin/networks/services/update.service";
import NetworkPresenter from "#presenters/network.presenter";
import { UpdateNetworkSchema } from "#validators/network.validator";

@inject()
export default class UpdateNetworkController {
	constructor(
		private updateNetworkService: UpdateNetworkService,
		private networkPresenter: NetworkPresenter,
	) {}

	async handle({ params, request, bouncer }: HttpContext) {
		const { networkId } = params;

		await bouncer.with(UpdateNetworkPolicy).authorize("handle");

		const payload = await request.validateUsing(UpdateNetworkController.payloadSchema);
		const network = await this.updateNetworkService.execute(networkId, payload);

		return this.networkPresenter.toJSON(network);
	}

	static payloadSchema = vine.create(UpdateNetworkSchema);
}
