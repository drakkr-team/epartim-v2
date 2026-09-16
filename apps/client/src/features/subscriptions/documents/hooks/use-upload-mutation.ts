import { useMutation, useQueryClient } from "@tanstack/react-query";

import { api } from "#/libs/tuyau";

export function useUploadSubscriptionDocumentMutation(subscriptionId: string) {
	const queryClient = useQueryClient();

	return useMutation(
		api.subscriptions.uploadDocument.mutationOptions({
			scope: { id: `subscription:${subscriptionId}:documents:upload` },
			onSuccess: () =>
				queryClient.invalidateQueries({ queryKey: api.subscriptions.view.pathKey() }),
		}),
	);
}
