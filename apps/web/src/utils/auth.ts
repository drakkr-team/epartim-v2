import type { QueryClient } from "@tanstack/react-query";

import { api } from "#/libs/tuyau";

export async function isAuthenticated(queryClient: QueryClient) {
	try {
		const currentUser = await queryClient.ensureQueryData(
			api.userManagement.profile.view.queryOptions(),
		);
		return !!currentUser;
	} catch (_error) {
		// @ts-expect-error: Set null to prevent refetching the user profile until the next authentication attempt
		queryClient.setQueryData(api.userManagement.profile.view.queryKey(), null);
		return false;
	}
}
