import { useQuery } from "@tanstack/react-query";

import { api } from "#/libs/tuyau";

export function useSubscriptionQuery(subscriptionId: string) {
	return useQuery(
		api.subscriptions.view.queryOptions({
			params: { subscriptionId },
		}),
	);
}
