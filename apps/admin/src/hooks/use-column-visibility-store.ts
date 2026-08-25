import type { VisibilityState } from "@tanstack/react-table";
import type { StoreApi, UseBoundStore } from "zustand";
import { persist } from "zustand/middleware";
import { create } from "zustand/react";

type ColumnVisibilityStore = {
	columnVisibility: VisibilityState;
	setColumnVisibility: (
		updaterOrValue: VisibilityState | ((prev: VisibilityState) => VisibilityState),
	) => void;
};

type UseColumnVisibilityStoreParams = {
	name: string;
	defaultValue?: VisibilityState;
};

const stores = new Map<string, UseBoundStore<StoreApi<ColumnVisibilityStore>>>();

export function useColumnVisibilityStore(params: UseColumnVisibilityStoreParams) {
	let useStore = stores.get(params.name);

	if (!useStore) {
		useStore = create<ColumnVisibilityStore>()(
			persist(
				(set) => ({
					columnVisibility: params.defaultValue ?? {},
					setColumnVisibility: (updaterOrValue) =>
						set((state) => ({
							columnVisibility:
								typeof updaterOrValue === "function"
									? updaterOrValue(state.columnVisibility)
									: updaterOrValue,
						})),
				}),
				{ name: params.name },
			),
		);
		stores.set(params.name, useStore);
	}

	return useStore();
}
