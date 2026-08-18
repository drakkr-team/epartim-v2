import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "@tanstack/react-router";

import { api } from "#/libs/tuyau";

export function useLogoutMutation() {
	const navigate = useNavigate();
	const queryClient = useQueryClient();

	return useMutation(
		api.admin.authentication.logout.mutationOptions({
			onSuccess: () => {
				queryClient.removeQueries({
					queryKey: api.admin.authentication.viewCurrentUser.pathKey(),
				});
				navigate({ to: "/login" });
			},
		}),
	);
}
