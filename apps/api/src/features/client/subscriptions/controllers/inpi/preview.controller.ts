import { inject } from "@adonisjs/core";
import type { HttpContext } from "@adonisjs/core/http";
import limiter from "@adonisjs/limiter/services/main";
import vine from "@vinejs/vine";

import AccessSubscriptionPolicy from "#features/client/subscriptions/policies/access.policy";
import PreviewSubscriptionInpiService from "#features/client/subscriptions/services/inpi/preview.service";
import Subscription from "#models/subscription";
import SubscriptionInpiPreviewPresenter from "#presenters/subscription_inpi_preview.presenter";
import { PreviewSubscriptionInpiSchema } from "#validators/subscription/inpi.validator";

const previewLimiter = limiter.use({ requests: 20, duration: "1 minute" });

@inject()
export default class PreviewSubscriptionInpiController {
	constructor(
		protected previewService: PreviewSubscriptionInpiService,
		protected previewPresenter: SubscriptionInpiPreviewPresenter,
	) {}

	async handle({ bouncer, params, request }: HttpContext) {
		const subscription = await Subscription.findOrFail(params.subscriptionId);
		await bouncer.with(AccessSubscriptionPolicy).authorize("handle", subscription);
		const { siren } = await request.validateUsing(PreviewSubscriptionInpiController.payloadSchema);
		await previewLimiter.consume(`inpi:${subscription.createdBy}`);
		return this.previewPresenter.toJSON(await this.previewService.handle(subscription, siren));
	}

	static payloadSchema = vine.create(PreviewSubscriptionInpiSchema);
}
