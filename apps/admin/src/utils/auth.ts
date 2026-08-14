import type { QueryClient } from "@tanstack/react-query";

import { api } from "#/libs/tuyau";

export async function isAdministrator(queryClient: QueryClient) {
	try {
		const user = await queryClient.ensureQueryData(api.userManagement.profile.view.queryOptions());
		return user.roles.includes("administrator");
	} catch (_error) {
		return false;
	}
}
