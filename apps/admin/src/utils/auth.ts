import type { QueryClient } from "@tanstack/react-query";

import { api } from "#/libs/tuyau";

export async function isAuthenticated(queryClient: QueryClient) {
	try {
		return !!(await getCurrentUser(queryClient));
	} catch (_error) {
		return false;
	}
}

export async function getCurrentUser(queryClient: QueryClient) {
	try {
		return await queryClient.query(api.accountManagement.profile.view.queryOptions());
	} catch (_error) {
		// @ts-expect-error: Set null to prevent refetching the user profile until the next authentication attempt
		queryClient.setQueryData(api.accountManagement.profile.view.queryKey(), null);
		return null;
	}
}
