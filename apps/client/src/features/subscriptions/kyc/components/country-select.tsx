import type { Country } from "react-phone-number-input";
import flags from "react-phone-number-input/flags";
import countryLabels from "react-phone-number-input/locale/fr";

import { Combobox } from "@workspace/ui-react/components/combobox";
import { Field } from "@workspace/ui-react/components/field";

export type CountryOption = { label: string; value: string };

const nonIsoCountryCodes = new Set(["AC", "TA", "XA", "XO", "ZZ"]);

export const countryOptions = Object.entries(countryLabels)
	.filter(([value]) => /^[A-Z]{2}$/.test(value) && !nonIsoCountryCodes.has(value))
	.map(([value, label]) => ({ label, value }))
	.sort((first, second) => first.label.localeCompare(second.label, "fr"));
export const countryOptionByValue = new Map(countryOptions.map((option) => [option.value, option]));

type CountrySelectProps = {
	errorMessages?: string[];
	id: string;
	invalid?: boolean;
	label: string;
	onValueChange: (value: string | null) => void;
	required?: boolean;
	value: string | null;
};

type CountryMultiSelectProps = {
	errorMessages?: string[];
	id: string;
	invalid?: boolean;
	label: string;
	onValueChange: (value: string[]) => void;
	required?: boolean;
	value: string[];
};

type CountryComboboxProps = {
	ariaLabel?: string;
	id?: string;
	invalid?: boolean;
	onValueChange: (value: string | null) => void;
	options?: CountryOption[];
	placeholder: string;
	value: string | null;
};

export function CountryFlag({ country }: { country: string }) {
	const Flag = flags[country as Country];

	if (!Flag) return null;

	return (
		<span className="flex size-5 shrink-0 items-center overflow-hidden rounded-sm" aria-hidden>
			<Flag title="" />
		</span>
	);
}

export function CountrySelect(props: CountrySelectProps) {
	const { errorMessages = [], id, invalid = false, label, onValueChange, required, value } = props;

	return (
		<Field name={id} invalid={invalid} className="flex flex-col gap-2">
			<Field.Label htmlFor={id} required={required}>
				{label}
			</Field.Label>
			<CountryCombobox
				id={id}
				invalid={invalid}
				placeholder={label}
				value={value}
				onValueChange={onValueChange}
			/>
			{invalid && errorMessages.map((error) => <Field.Error key={error}>{error}</Field.Error>)}
		</Field>
	);
}

export function CountryCombobox(props: CountryComboboxProps) {
	const {
		ariaLabel,
		id,
		invalid = false,
		onValueChange,
		options = countryOptions,
		placeholder,
		value,
	} = props;

	return (
		<Combobox items={options} value={value} onValueChange={onValueChange}>
			<Combobox.Input id={id} aria-label={ariaLabel} aria-invalid={invalid} className="w-full">
				<Combobox.Value placeholder={placeholder}>
					{(country: string | null | undefined) => {
						if (!country) return placeholder;

						const option = countryOptionByValue.get(country);
						if (!option) return placeholder;

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
	);
}

export function CountryMultiSelect(props: CountryMultiSelectProps) {
	const { errorMessages = [], id, invalid = false, label, onValueChange, required, value } = props;

	return (
		<Field name={id} invalid={invalid} className="flex flex-col gap-2">
			<Field.Label htmlFor={id} required={required}>
				{label}
			</Field.Label>
			<Combobox items={countryOptions} multiple value={value} onValueChange={onValueChange}>
				<Combobox.Input id={id} aria-invalid={invalid} className="w-full">
					<Combobox.Value>
						{(countries: string[]) => {
							if (countries.length === 0) return label;

							return countries.map((country) => {
								const option = countryOptionByValue.get(country);

								return (
									<Combobox.Chip key={country} aria-label={option?.label ?? country}>
										<CountryFlag country={country} />
										{option?.label ?? country}
									</Combobox.Chip>
								);
							});
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
			{invalid && errorMessages.map((error) => <Field.Error key={error}>{error}</Field.Error>)}
		</Field>
	);
}
