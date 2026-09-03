import type Subscription from "#models/subscription";

export default class SubscriptionPresenter {
	toJSON(subscription: Subscription) {
		return {
			id: subscription.id,

			createdBy: subscription.createdBy,
			status: subscription.status,
			completedSteps: subscription.completedSteps,

			submittedAt: subscription.submittedAt?.toJSDate() ?? null,
			approvedAt: subscription.approvedAt?.toJSDate() ?? null,
			completedAt: subscription.completedAt?.toJSDate() ?? null,
			statusUpdatedAt: subscription.statusUpdatedAt?.toJSDate() ?? null,
			createdAt: subscription.createdAt.toJSDate(),
			updatedAt: subscription.updatedAt.toJSDate(),
		};
	}
}
