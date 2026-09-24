import { useInfiniteQuery } from "@tanstack/react-query";
import { useState } from "react";
import { useTranslation } from "react-i18next";

import type { Firm } from "@workspace/api/data";
import { Combobox, type ComboboxProps } from "@workspace/ui-react/components/combobox";

import { useLoadMoreWhileInView } from "#/hooks/use-load-more-while-in-view.ts";
import { api } from "#/libs/tuyau.ts";

type FirmComboboxProps = Omit<ComboboxProps<Firm>, "items" | "onInputValueChange" | "filter">;

export function FirmCombobox(props: FirmComboboxProps) {
	const { t } = useTranslation("features.firms.components.combobox");

	const [search, setSearch] = useState("");

	const {
		data: firms,
		fetchNextPage,
		hasNextPage,
		isFetchingNextPage,
	} = useInfiniteQuery(
		api.firms.list.infiniteQueryOptions(
			{ query: { q: search } },
			{
				initialPageParam: 1,
				getNextPageParam: (page) => {
					const { currentPage, lastPage } = page.meta;
					return currentPage < lastPage ? lastPage + 1 : undefined;
				},
				select: (data) => {
					return data.pages.flatMap((page) => page.data);
				},
			},
		),
	);
	const loadMoreRef = useLoadMoreWhileInView({ hasNextPage, isFetchingNextPage, fetchNextPage });
	const firmItems = firms ?? [];

	return (
		<Combobox items={firmItems} onInputValueChange={setSearch} filter={null} {...props}>
			<Combobox.Input>
				<Combobox.Value>
					{(item: Firm | null | undefined) => {
						if (!item) return t("placeholder");

						return item.name;
					}}
				</Combobox.Value>
			</Combobox.Input>

			<Combobox.Dropdown>
				<Combobox.SearchInput placeholder={t("search")} />

				{firmItems.length === 0 && (
					<Combobox.Empty className="p-3 text-neutral-11 text-sm">{t("empty")}</Combobox.Empty>
				)}

				<Combobox.List>
					{(item: Firm) => (
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
