import { useDebouncedCallback } from "@tanstack/react-pacer";
import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { useTranslation } from "react-i18next";

import { Combobox } from "@workspace/ui-react/components/combobox";
import { Field } from "@workspace/ui-react/components/field";

import { api } from "#/libs/tuyau";

type NetworkOption = {
	readonly value: string;
	readonly label: string;
};

type NetworkFieldProps = {
	value: number | null;
	isInvalid: boolean;
	errorMessages: readonly string[];
	onChange: (networkId: number | null) => void;
	onBlur: () => void;
};

export function NetworkField(props: NetworkFieldProps) {
	const { value, isInvalid, errorMessages, onChange, onBlur } = props;
	const { t } = useTranslation("features.firms.components.form");
	const [query, setQuery] = useState("");
	const updateQuery = useDebouncedCallback((nextQuery: string) => setQuery(nextQuery), {
		wait: 300,
	});
	const networks = useQuery(
		api.networks.list.queryOptions(
			{
				query: {
					q: query || undefined,
					perPage: 20,
					orderBy: "name_asc",
				},
			},
			{ placeholderData: keepPreviousData },
		),
	);
	const options =
		networks.data?.data.map((network) => ({
			value: network.id.toString(),
			label: network.name,
		})) ?? [];
	const selectedOption = options.find((option) => option.value === value?.toString()) ?? null;

	return (
		<Field name="networkId" invalid={isInvalid} className="flex flex-col gap-2">
			<Field.Label>{t("field.networkId.label")}</Field.Label>
			<Combobox<NetworkOption>
				items={options}
				filteredItems={options}
				value={selectedOption}
				isItemEqualToValue={(option, selected) => option.value === selected.value}
				onInputValueChange={updateQuery}
				onValueChange={(option) => onChange(option === null ? null : Number(option.value))}
				onOpenChange={(open) => {
					if (!open) onBlur();
				}}
			>
				<Combobox.Input aria-invalid={isInvalid} clearButtonLabel={t("field.networkId.clear")}>
					<Combobox.Value placeholder={t("field.networkId.placeholder")} />
				</Combobox.Input>

				<Combobox.Dropdown>
					<Combobox.SearchInput placeholder={t("field.networkId.search")} />
					<Combobox.Empty className="p-3 text-neutral-11 text-sm">
						{networks.isError ? t("field.networkId.error") : t("field.networkId.empty")}
					</Combobox.Empty>
					<Combobox.List>
						{(option: NetworkOption) => (
							<Combobox.Item key={option.value} value={option}>
								{option.label}
							</Combobox.Item>
						)}
					</Combobox.List>
				</Combobox.Dropdown>
			</Combobox>
			{errorMessages.map((message) => (
				<Field.Error key={message}>{message}</Field.Error>
			))}
		</Field>
	);
}
