import { inject } from "@adonisjs/core";
import type { HttpContext } from "@adonisjs/core/http";
import vine from "@vinejs/vine";

import ListSubscriptionsPolicy from "#features/client/subscriptions/policies/list.policy";
import ListSubscriptionsService from "#features/client/subscriptions/services/list.service";
import PaginationPresenter from "#presenters/pagination.presenter";
import SubscriptionPresenter from "#presenters/subscription.presenter";
import { PaginationValidator } from "#validators/pagination.validator";

@inject()
export default class ListSubscriptionsController {
	constructor(
		protected listSubscriptionsService: ListSubscriptionsService,
		protected subscriptionPresenter: SubscriptionPresenter,
		protected paginationPresenter: PaginationPresenter,
	) {}

	async handle({ request, bouncer }: HttpContext) {
		await bouncer.with(ListSubscriptionsPolicy).authorize("handle");

		const { page = 1, perPage = 20 } = await request.validateUsing(
			ListSubscriptionsController.querySchema,
		);
		const subscriptions = await this.listSubscriptionsService.handle().paginate(page, perPage);

		return {
			meta: this.paginationPresenter.toJSON(subscriptions),
			data: subscriptions
				.all()
				.map((subscription) => this.subscriptionPresenter.toListJSON(subscription)),
		};
	}

	static querySchema = vine.create({
		...PaginationValidator.getProperties(),
	});
}
