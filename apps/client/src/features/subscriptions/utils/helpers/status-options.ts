export const subscriptionTabsStatusOptions = {
	draft: {
		translationKey: "draft",
		color: "warning",
		badgeClassName: "",
	},
	validating: {
		translationKey: "validating",
		color: "warning",
		badgeClassName: "bg-warning-2",
	},
	finalized: {
		translationKey: "finalized",
		color: "neutral",
		badgeClassName: "",
	},
} as const;

export type SubscriptionTabsListStatus = keyof typeof subscriptionTabsStatusOptions;

export const subscriptionListStatuses = Object.keys(subscriptionTabsStatusOptions) as [
	SubscriptionTabsListStatus,
	...SubscriptionTabsListStatus[],
];

export const DEFAULT_SUBSCRIPTION_LIST_STATUS = subscriptionListStatuses[0];
