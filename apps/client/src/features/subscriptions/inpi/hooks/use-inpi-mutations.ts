import { useMutation, useQueryClient } from "@tanstack/react-query";

import { api } from "#/libs/tuyau";

export function useInpiMutations(subscriptionId: string) {
	const queryClient = useQueryClient();
	const scope = { id: `subscription:${subscriptionId}:inpi` };
	const refresh = () =>
		queryClient.invalidateQueries({ queryKey: api.subscriptions.view.pathKey() });
	const apply = useMutation(
		api.subscriptions.inpi.apply.mutationOptions({ scope, onSuccess: refresh }),
	);
	const articles = useMutation(
		api.subscriptions.inpi.importArticles.mutationOptions({ scope, onSuccess: refresh }),
	);
	return { apply, articles };
}
