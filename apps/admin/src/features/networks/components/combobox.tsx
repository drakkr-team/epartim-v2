import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { useTranslation } from "react-i18next";

import type { Network } from "@workspace/api/data";
import { Combobox, type ComboboxProps } from "@workspace/ui-react/components/combobox";

import { api } from "#/libs/tuyau.ts";

type NetworkComboboxProps = Omit<ComboboxProps<Network>, "items" | "onInputValueChange">;

export function NetworkCombobox(props: NetworkComboboxProps) {
	const { t } = useTranslation("features.networks.components.combobox");

	const [search, setSearch] = useState("");

	const { data: networks } = useQuery(api.networks.list.queryOptions({ query: { q: search } }));
	const networkItems = networks?.data ?? [];

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
			</Combobox.Dropdown>
		</Combobox>
	);
}
