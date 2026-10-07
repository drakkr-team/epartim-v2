import { inject } from "@adonisjs/core";
import type { HttpContext } from "@adonisjs/core/http";
import type { NextFn } from "@adonisjs/core/types/http";

import SubscriptionEditConflictException from "#exceptions/subscription_edit_conflict.exception";
import AccessSubscriptionPolicy from "#features/client/subscriptions/policies/access.policy";
import SubscriptionEditLockService from "#features/client/subscriptions/services/edit_lock.service";
import Subscription from "#models/subscription";

@inject()
export default class SubscriptionEditMiddleware {
	constructor(protected editLockService: SubscriptionEditLockService) {}

	async handle(ctx: HttpContext, next: NextFn) {
		if (!ctx.params.subscriptionId) return next();
		const subscription = await Subscription.findOrFail(ctx.params.subscriptionId);
		await ctx.bouncer.with(AccessSubscriptionPolicy).authorize("handle", subscription);
		return this.editLockService.handle(subscription.id, async () => {
			await subscription.refresh();
			const isMutation =
				!["GET", "HEAD"].includes(ctx.request.method()) &&
				ctx.route?.name !== "client.subscriptions.inpi.preview";
			const expected = ctx.request.header("x-subscription-revision");
			if (isMutation && expected !== undefined && expected !== String(subscription.editRevision)) {
				throw new SubscriptionEditConflictException();
			}
			await next();
			if (isMutation && ctx.response.getStatus() < 400) {
				await Subscription.query().where("id", subscription.id).increment("editRevision", 1);
				await subscription.refresh();
			}
			ctx.response.header("x-subscription-revision", String(subscription.editRevision));
		});
	}
}
