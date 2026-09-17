import type { Country } from "react-phone-number-input";
import flags from "react-phone-number-input/flags";
import countryLabels from "react-phone-number-input/locale/fr";

import { Combobox } from "@workspace/ui-react/components/combobox";
import { Field } from "@workspace/ui-react/components/field";

type CountryOption = { label: string; value: string };

const nonIsoCountryCodes = new Set(["AC", "TA", "XA", "XO", "ZZ"]);

const options = Object.entries(countryLabels)
	.filter(([value]) => /^[A-Z]{2}$/.test(value) && !nonIsoCountryCodes.has(value))
	.map(([value, label]) => ({ label, value }))
	.sort((first, second) => first.label.localeCompare(second.label, "fr"));
const optionByValue = new Map(options.map((option) => [option.value, option]));

type CountrySelectProps = {
	id: string;
	invalid?: boolean;
	label: string;
	onValueChange: (value: string | null) => void;
	required?: boolean;
	value: string | null;
};

function CountryFlag({ country }: { country: string }) {
	const Flag = flags[country as Country];

	if (!Flag) return null;

	return (
		<span className="flex size-5 shrink-0 items-center overflow-hidden rounded-sm" aria-hidden>
			<Flag title="" />
		</span>
	);
}

export function CountrySelect(props: CountrySelectProps) {
	const { id, invalid = false, label, onValueChange, required, value } = props;

	return (
		<Field name={id} invalid={invalid} className="flex flex-col gap-2">
			<Field.Label htmlFor={id} required={required}>
				{label}
			</Field.Label>
			<Combobox items={options} value={value} onValueChange={onValueChange}>
				<Combobox.Input id={id} aria-invalid={invalid} className="w-full">
					<Combobox.Value placeholder={label}>
						{(country: string | null | undefined) => {
							if (!country) return label;

							const option = optionByValue.get(country);
							if (!option) return label;

							return (
								<span className="flex min-w-0 items-center gap-2">
									<CountryFlag country={country} />
									<span className="truncate">{option.label}</span>
								</span>
							);
						}}
					</Combobox.Value>
				</Combobox.Input>
				<Combobox.Dropdown>
					<Combobox.SearchInput placeholder="Rechercher un pays" />
					<Combobox.Empty>Aucun pays trouvé.</Combobox.Empty>
					<Combobox.List>
						{(option: CountryOption) => (
							<Combobox.Item key={option.value} value={option.value}>
								<span className="flex min-w-0 items-center gap-2">
									<CountryFlag country={option.value} />
									<span className="truncate">{option.label}</span>
								</span>
							</Combobox.Item>
						)}
					</Combobox.List>
				</Combobox.Dropdown>
			</Combobox>
		</Field>
	);
}
