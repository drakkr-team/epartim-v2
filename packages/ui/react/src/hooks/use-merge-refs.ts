import { type Ref, useCallback } from "react";

export function useMergeRefs<T>(...refs: Array<Ref<T> | undefined>) {
	return useCallback(
		(node: T) => {
			refs.forEach((ref) => {
				if (!ref) return;

				if (typeof ref === "function") {
					ref(node);
					return;
				}

				ref.current = node;
			});
		},
		[refs],
	);
}
