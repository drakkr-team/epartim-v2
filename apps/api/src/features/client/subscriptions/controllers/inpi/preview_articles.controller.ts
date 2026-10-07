import { inject } from "@adonisjs/core";
import type { HttpContext } from "@adonisjs/core/http";
import vine from "@vinejs/vine";

import AccessSubscriptionPolicy from "#features/client/subscriptions/policies/access.policy";
import SubscriptionInpiArticlesService from "#features/client/subscriptions/services/inpi/articles.service";
import Subscription from "#models/subscription";
import { PreviewSubscriptionInpiArticlesSchema } from "#validators/subscription/inpi.validator";

@inject()
export default class PreviewSubscriptionInpiArticlesController {
	constructor(protected articlesService: SubscriptionInpiArticlesService) {}

	async handle({ bouncer, params, request, response }: HttpContext) {
		const subscription = await Subscription.findOrFail(params.subscriptionId);
		await bouncer.with(AccessSubscriptionPolicy).authorize("handle", subscription);
		const payload = await request.validateUsing(
			PreviewSubscriptionInpiArticlesController.payloadSchema,
		);
		const { article, buffer } = await this.articlesService.preview(
			subscription,
			payload.params.previewId,
			payload.params.actId,
		);
		response.header("Cache-Control", "private, no-store");
		response.header("Content-Disposition", `inline; filename="statuts_${article.siren}.pdf"`);
		response.header("X-Content-Type-Options", "nosniff");
		return response.type("application/pdf").send(buffer);
	}

	static payloadSchema = vine.create(PreviewSubscriptionInpiArticlesSchema);
}
