import { useInfiniteQuery } from "@tanstack/react-query";
import { useState } from "react";
import { useTranslation } from "react-i18next";

import type { Role } from "@workspace/api/data";
import { Combobox, type ComboboxProps } from "@workspace/ui-react/components/combobox";

import { useLoadMoreWhileInView } from "#/hooks/use-load-more-while-in-view.ts";
import { api } from "#/libs/tuyau.ts";

type RoleComboboxProps = Omit<ComboboxProps<Role>, "items" | "onInputValueChange">;

export function RoleCombobox(props: RoleComboboxProps) {
	const { t } = useTranslation("features.roles.components.combobox");

	const [search, setSearch] = useState("");

	const {
		data: roles,
		fetchNextPage,
		hasNextPage,
		isFetchingNextPage,
	} = useInfiniteQuery(
		api.roles.list.infiniteQueryOptions(
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
	const roleItems = roles ?? [];

	return (
		<Combobox items={roleItems} onInputValueChange={setSearch} {...props}>
			<Combobox.Input>
				<Combobox.Value>
					{(item: Role | null | undefined) => {
						if (!item) return t("placeholder");

						return item.name;
					}}
				</Combobox.Value>
			</Combobox.Input>

			<Combobox.Dropdown>
				<Combobox.SearchInput placeholder={t("search")} />

				{roleItems.length === 0 && (
					<Combobox.Empty className="p-3 text-neutral-11 text-sm">{t("empty")}</Combobox.Empty>
				)}

				<Combobox.List>
					{(item: Role) => (
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
