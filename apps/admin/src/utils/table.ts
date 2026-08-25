import type { SortingState } from "@tanstack/react-table";

export function orderByToSortingSate(orderBy: string | undefined): SortingState {
	if (!orderBy) return [];

	const [id, desc] = orderBy.split("_");
	return [{ id, desc: desc === "desc" }];
}

export function sortingStateToOrderBy(sorting: SortingState | undefined) {
	if (!sorting || sorting.length === 0) return undefined;

	const order = sorting[0];
	return `${order.id}_${order.desc ? "desc" : "asc"}`;
}
