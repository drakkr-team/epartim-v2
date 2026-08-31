import { inject } from "@adonisjs/core";
import { HttpContext } from "@adonisjs/core/http";
import vine from "@vinejs/vine";

import CreateNetworkPolicy from "#features/admin/networks/policies/create.policy";
import CreateNetworkService from "#features/admin/networks/services/create.service";
import NetworkPresenter from "#presenters/network.presenter";
import { CreateNetworkSchema } from "#validators/network.validator";

@inject()
export default class CreateNetworkController {
	constructor(
		private createNetworkService: CreateNetworkService,
		private networkPresenter: NetworkPresenter,
	) {}

	async handle({ request, response, bouncer }: HttpContext) {
		await bouncer.with(CreateNetworkPolicy).authorize("handle");

		const payload = await request.validateUsing(CreateNetworkController.payloadSchema);
		const network = await this.createNetworkService.execute(payload);

		return response.created(this.networkPresenter.toJSON(network));
	}

	static payloadSchema = vine.create(CreateNetworkSchema);
}
