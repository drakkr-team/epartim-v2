import type { QueryClient } from "@tanstack/react-query";

import { api } from "#/libs/tuyau";

export async function getCurrentAdmin(queryClient: QueryClient) {
	try {
		return await queryClient.ensureQueryData(
			api.admin.authentication.viewCurrentUser.queryOptions(),
		);
	} catch (_error) {
		queryClient.removeQueries({
			queryKey: api.admin.authentication.viewCurrentUser.queryKey(),
		});
		return null;
	}
}
