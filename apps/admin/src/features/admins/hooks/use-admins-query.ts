import { useQuery } from "@tanstack/react-query";

import type { AdminListSearch } from "#/features/admins/model";
import { api } from "#/libs/tuyau";

export function useAdminsQuery(search: AdminListSearch) {
	return useQuery(api.admins.list.queryOptions({ query: search }));
}
