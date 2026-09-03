import factory from "@adonisjs/lucid/factories";

import { UserFactory } from "#database/factories/user.factory";
import Subscription, { SubscriptionStatus } from "#models/subscription";

export const SubscriptionFactory = factory
	.define(Subscription, ({ faker }) => ({
		status: faker.helpers.arrayElement(Object.values(SubscriptionStatus)),
		completedSteps: [],
	}))
	.state("draft", (subscription) => {
		subscription.status = SubscriptionStatus.DRAFT;
	})
	.state("waitingForSignatures", (subscription) => {
		subscription.status = SubscriptionStatus.WAITING_FOR_SIGNATURES;
	})
	.state("toBeSent", (subscription) => {
		subscription.status = SubscriptionStatus.TO_BE_SENT;
	})
	.state("complete", (subscription) => {
		subscription.status = SubscriptionStatus.COMPLETE;
	})
	.state("error", (subscription) => {
		subscription.status = SubscriptionStatus.ERROR;
	})
	.relation("creator", () => UserFactory)
	.build();
