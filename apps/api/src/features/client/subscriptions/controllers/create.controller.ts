import { inject } from "@adonisjs/core";
import type { HttpContext } from "@adonisjs/core/http";

import CreateSubscriptionPolicy from "#features/client/subscriptions/policies/create.policy";
import CreateSubscriptionService from "#features/client/subscriptions/services/create.service";
import User from "#models/user";
import SubscriptionPresenter from "#presenters/subscription.presenter";

@inject()
export default class CreateSubscriptionController {
	constructor(
		protected createSubscriptionService: CreateSubscriptionService,
		protected subscriptionPresenter: SubscriptionPresenter,
	) {}

	async handle({ auth, bouncer, response }: HttpContext) {
		const user = auth.user as User;
		await bouncer.with(CreateSubscriptionPolicy).authorize("handle");

		const subscription = await this.createSubscriptionService.handle(user.id);

		return response.created(this.subscriptionPresenter.toJSON(subscription));
	}
}
