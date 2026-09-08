import { inject } from "@adonisjs/core";
import type { HttpContext } from "@adonisjs/core/http";
import vine from "@vinejs/vine";

import ListSubscriptionsPolicy from "#features/client/subscriptions/policies/list.policy";
import ListSubscriptionsService, {
	subscriptionListStatuses,
} from "#features/client/subscriptions/services/list.service";
import CompanyPresenter from "#presenters/company.presenter";
import PaginationPresenter from "#presenters/pagination.presenter";
import SubscriptionPresenter from "#presenters/subscription.presenter";
import { PaginationValidator } from "#validators/pagination.validator";

@inject()
export default class ListSubscriptionsController {
	constructor(
		protected listSubscriptionsService: ListSubscriptionsService,
		protected subscriptionPresenter: SubscriptionPresenter,
		protected companyPresenter: CompanyPresenter,
		protected paginationPresenter: PaginationPresenter,
	) {}

	async handle({ request, bouncer }: HttpContext) {
		await bouncer.with(ListSubscriptionsPolicy).authorize("handle");

		const {
			page = 1,
			perPage = 20,
			q,
			status,
			progress,
			createdAtFrom,
			createdAtTo,
		} = await request.validateUsing(ListSubscriptionsController.querySchema);
		const subscriptionsQuery = this.listSubscriptionsService.handle({
			q,
			status,
			progress,
			createdAtFrom,
			createdAtTo,
		});
		subscriptionsQuery.preload("company");
		const subscriptions = await subscriptionsQuery.paginate(page, perPage);

		return {
			meta: {
				...this.paginationPresenter.toJSON(subscriptions),
				statusCounts: await this.listSubscriptionsService.getStatusCounts({
					q,
					progress,
					createdAtFrom,
					createdAtTo,
				}),
			},
			data: subscriptions.all().map((subscription) => ({
				...this.subscriptionPresenter.toJSON(subscription),
				company: this.companyPresenter.toJSON(subscription.company),
			})),
		};
	}

	static querySchema = vine.create({
		...PaginationValidator.getProperties(),
		q: vine.string().trim().optional(),
		status: vine.enum(subscriptionListStatuses).optional(),
		progress: vine.number().min(1).max(5).withoutDecimals().optional(),
		createdAtFrom: vine.date({ formats: ["YYYY-MM-DD"] }).optional(),
		createdAtTo: vine
			.date({ formats: ["YYYY-MM-DD"] })
			.afterOrSameAs("createdAtFrom")
			.optional(),
	});
}
