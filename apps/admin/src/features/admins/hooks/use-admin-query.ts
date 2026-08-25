import { useQuery } from "@tanstack/react-query";

import { api } from "#/libs/tuyau";

export function useAdminQuery(adminId: string) {
	return useQuery(api.admins.view.queryOptions({ params: { adminId } }));
}
