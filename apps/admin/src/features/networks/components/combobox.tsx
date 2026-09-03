import { useInfiniteQuery } from "@tanstack/react-query";
import { useState } from "react";
import { useTranslation } from "react-i18next";

import type { Network } from "@workspace/api/data";
import { Combobox, type ComboboxProps } from "@workspace/ui-react/components/combobox";

import { useLoadMoreWhileInView } from "#/hooks/use-load-more-while-in-view.ts";
import { api } from "#/libs/tuyau.ts";

type NetworkComboboxProps = Omit<ComboboxProps<Network>, "items" | "onInputValueChange">;

export function NetworkCombobox(props: NetworkComboboxProps) {
	const { t } = useTranslation("features.networks.components.combobox");

	const [search, setSearch] = useState("");

	const {
		data: networks,
		fetchNextPage,
		hasNextPage,
		isFetchingNextPage,
	} = useInfiniteQuery(
		api.networks.list.infiniteQueryOptions(
			{ query: { q: search } },
			{
				initialPageParam: 1,
				getNextPageParam: (lastPage) => {
					const { currentPage, total, perPage } = lastPage.meta;
					const pageCount = Math.ceil(total / perPage);
					return currentPage < pageCount ? currentPage + 1 : undefined;
				},
				select: (data) => {
					return data.pages.flatMap((page) => page.data);
				},
			},
		),
	);
	const loadMoreRef = useLoadMoreWhileInView({ hasNextPage, isFetchingNextPage, fetchNextPage });
	const networkItems = networks ?? [];

	return (
		<Combobox items={networkItems} onInputValueChange={setSearch} {...props}>
			<Combobox.Input>
				<Combobox.Value>
					{(item: Network | null | undefined) => {
						if (!item) return t("placeholder");

						return item.name;
					}}
				</Combobox.Value>
			</Combobox.Input>

			<Combobox.Dropdown>
				<Combobox.SearchInput placeholder={t("search")} />

				{networkItems.length === 0 && (
					<Combobox.Empty className="p-3 text-neutral-11 text-sm">{t("empty")}</Combobox.Empty>
				)}

				<Combobox.List>
					{(item: Network) => (
						<Combobox.Item key={item.id} value={item}>
							{item.name}
						</Combobox.Item>
					)}
				</Combobox.List>

				{hasNextPage && !isFetchingNextPage && <span ref={loadMoreRef} />}
			</Combobox.Dropdown>
		</Combobox>
	);
}
