import { inject } from "@adonisjs/core";
import { HttpContext } from "@adonisjs/core/http";
import vine from "@vinejs/vine";

import CreateFirmPolicy from "#features/admin/firms/policies/create.policy";
import DeleteFirmPolicy from "#features/admin/firms/policies/delete.policy";
import ListFirmsPolicy from "#features/admin/firms/policies/list.policy";
import UpdateFirmPolicy from "#features/admin/firms/policies/update.policy";
import ListFirmsService, { FirmOrderByValues } from "#features/admin/firms/services/list.service";
import FirmPresenter from "#presenters/firm.presenter";
import PaginationPresenter from "#presenters/pagination.presenter";
import { PaginationValidator } from "#validators/pagination.validator";

@inject()
export default class ListFirmsController {
	constructor(
		protected listFirmsService: ListFirmsService,
		protected firmPresenter: FirmPresenter,
		protected paginationPresenter: PaginationPresenter,
	) {}

	async handle({ request, bouncer }: HttpContext) {
		await bouncer.with(ListFirmsPolicy).authorize("handle");

		const {
			page = 1,
			perPage = 20,
			q,
			networkId,
			orderBy,
		} = await request.validateUsing(ListFirmsController.querySchema);

		const firms = await this.listFirmsService
			.handle({ q, networkId, orderBy })
			.paginate(page, perPage);

		return {
			meta: {
				...this.paginationPresenter.toJSON(firms),
				canCreate: await bouncer.with(CreateFirmPolicy).allows("handle"),
			},
			data: await Promise.all(
				firms.all().map(async (firm) => ({
					...this.firmPresenter.toJSON(firm),
					meta: {
						canUpdate: await bouncer.with(UpdateFirmPolicy).allows("handle"),
						canDelete: await bouncer.with(DeleteFirmPolicy).allows("handle"),
					},
				})),
			),
		};
	}

	static querySchema = vine.create({
		...PaginationValidator.getProperties(),
		q: vine.string().optional(),
		networkId: vine.number().positive().withoutDecimals().optional(),
		orderBy: vine.enum(FirmOrderByValues).optional(),
	});
}
