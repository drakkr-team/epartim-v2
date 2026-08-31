import { inject } from "@adonisjs/core";
import { HttpContext } from "@adonisjs/core/http";
import vine from "@vinejs/vine";

import CreateNetworkPolicy from "#features/admin/networks/policies/create.policy";
import DeleteNetworkPolicy from "#features/admin/networks/policies/delete.policy";
import ListNetworksPolicy from "#features/admin/networks/policies/list.policy";
import UpdateNetworkPolicy from "#features/admin/networks/policies/update.policy";
import ListNetworksService from "#features/admin/networks/services/list.service";
import NetworkPresenter from "#presenters/network.presenter";
import PaginationPresenter from "#presenters/pagination.presenter";
import { PaginationValidator } from "#validators/pagination.validator";

@inject()
export default class ListNetworksController {
	constructor(
		protected listNetworksService: ListNetworksService,
		protected networkPresenter: NetworkPresenter,
		protected paginationPresenter: PaginationPresenter,
	) {}

	async handle({ request, bouncer }: HttpContext) {
		await bouncer.with(ListNetworksPolicy).authorize("handle");

		const {
			page = 1,
			perPage = 20,
			q,
			orderBy,
		} = await request.validateUsing(ListNetworksController.querySchema);

		const networks = await this.listNetworksService.handle({ q, orderBy }).paginate(page, perPage);

		return {
			meta: {
				...this.paginationPresenter.toJSON(networks),
				canCreate: await bouncer.with(CreateNetworkPolicy).allows("handle"),
			},
			data: await Promise.all(
				networks.all().map(async (network) => ({
					...this.networkPresenter.toJSON(network),
					meta: {
						canUpdate: await bouncer.with(UpdateNetworkPolicy).allows("handle"),
						canDelete: await bouncer.with(DeleteNetworkPolicy).allows("handle"),
					},
				})),
			),
		};
	}

	static querySchema = vine.create({
		...PaginationValidator.getProperties(),
		q: vine.string().optional(),
		orderBy: vine.string().optional(),
	});
}
