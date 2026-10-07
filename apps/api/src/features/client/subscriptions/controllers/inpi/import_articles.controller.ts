import { inject } from "@adonisjs/core";
import type { HttpContext } from "@adonisjs/core/http";
import vine from "@vinejs/vine";

import AccessSubscriptionPolicy from "#features/client/subscriptions/policies/access.policy";
import SubscriptionInpiArticlesService from "#features/client/subscriptions/services/inpi/articles.service";
import Subscription from "#models/subscription";
import FilePresenter from "#presenters/file.presenter";
import { ImportSubscriptionInpiArticlesSchema } from "#validators/subscription/inpi.validator";

@inject()
export default class ImportSubscriptionInpiArticlesController {
	constructor(
		protected articlesService: SubscriptionInpiArticlesService,
		protected filePresenter: FilePresenter,
	) {}

	async handle({ bouncer, params, request, response }: HttpContext) {
		const subscription = await Subscription.findOrFail(params.subscriptionId);
		await bouncer.with(AccessSubscriptionPolicy).authorize("handle", subscription);
		const payload = await request.validateUsing(
			ImportSubscriptionInpiArticlesController.payloadSchema,
		);
		return response.created(
			await this.filePresenter.toJSON(await this.articlesService.import(subscription, payload)),
		);
	}

	static payloadSchema = vine.create(ImportSubscriptionInpiArticlesSchema);
}
