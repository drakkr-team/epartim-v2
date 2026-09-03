import type { InfiniteQueryObserverBaseResult } from "@tanstack/react-query";
import { type IntersectionEffectOptions, useOnInView } from "react-intersection-observer";

type UseLoadMoreWhileInViewParams = Pick<
	InfiniteQueryObserverBaseResult,
	"hasNextPage" | "isFetchingNextPage" | "fetchNextPage"
> & {
	options?: IntersectionEffectOptions;
};

export function useLoadMoreWhileInView(params: UseLoadMoreWhileInViewParams) {
	const { hasNextPage, isFetchingNextPage, fetchNextPage, options } = params;

	return useOnInView((inView) => {
		if (inView && hasNextPage && !isFetchingNextPage) {
			fetchNextPage();
		}
	}, options);
}
