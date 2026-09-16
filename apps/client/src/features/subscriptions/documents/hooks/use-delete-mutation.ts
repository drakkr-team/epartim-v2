import { useMutation, useQueryClient } from "@tanstack/react-query";

import { api } from "#/libs/tuyau";

export function useDeleteSubscriptionDocumentMutation(subscriptionId: string) {
	const queryClient = useQueryClient();

	return useMutation(
		api.subscriptions.deleteDocument.mutationOptions({
			scope: { id: `subscription:${subscriptionId}:documents:delete` },
			onSuccess: () =>
				queryClient.invalidateQueries({ queryKey: api.subscriptions.view.pathKey() }),
		}),
	);
}
