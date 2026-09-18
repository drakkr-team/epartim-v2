import { useState } from "react";
import flags from "react-phone-number-input/flags";
import PhoneInput, {
	type Country,
	getCountries,
	getCountryCallingCode,
	isPossiblePhoneNumber,
	parsePhoneNumber,
} from "react-phone-number-input/input";
import countryLabels from "react-phone-number-input/locale/fr";

import { Field } from "@workspace/ui-react/components/field";
import { Input } from "@workspace/ui-react/components/input";
import { Select } from "@workspace/ui-react/components/select";

const DEFAULT_PHONE_COUNTRY = "FR" satisfies Country;
const PREFERRED_PHONE_COUNTRIES: readonly Country[] = [
	"FR",
	"BE",
	"CH",
	"LU",
	"MC",
	"DE",
	"ES",
	"IT",
	"PT",
	"NL",
	"GB",
	"IE",
	"US",
	"MA",
	"DZ",
];

type PhoneCountryOption = {
	value: Country;
	label: string;
	callingCode: string;
};

type PhoneNumberFieldProps = {
	id: string;
	label: string;
	countryCallingCodeLabel: string;
	value: string;
	onValueChange: (value: string) => void;
	onBlur: () => void;
	required?: boolean;
	invalid: boolean;
	errorMessages: string[];
};

const countryCollator = new Intl.Collator("fr");
const PHONE_COUNTRIES = [
	...PREFERRED_PHONE_COUNTRIES,
	...getCountries().filter((country) => !PREFERRED_PHONE_COUNTRIES.includes(country)),
]
	.sort((firstCountry, secondCountry) => {
		const firstPreferredIndex = PREFERRED_PHONE_COUNTRIES.indexOf(firstCountry);
		const secondPreferredIndex = PREFERRED_PHONE_COUNTRIES.indexOf(secondCountry);

		if (firstPreferredIndex >= 0 && secondPreferredIndex >= 0) {
			return firstPreferredIndex - secondPreferredIndex;
		}
		if (firstPreferredIndex >= 0) return -1;
		if (secondPreferredIndex >= 0) return 1;

		return countryCollator.compare(countryLabels[firstCountry], countryLabels[secondCountry]);
	})
	.map(
		(country): PhoneCountryOption => ({
			value: country,
			label: `${countryLabels[country]} (+${getCountryCallingCode(country)})`,
			callingCode: `+${getCountryCallingCode(country)}`,
		}),
	);

const PHONE_COUNTRY_BY_VALUE = new Map(PHONE_COUNTRIES.map((country) => [country.value, country]));

export function isInternationalPhoneNumber(value: string) {
	return isPossiblePhoneNumber(value);
}

function CountryFlag({ country }: { country: Country }) {
	const Flag = flags[country];

	if (!Flag) return null;

	return (
		<span className="flex size-5 shrink-0 items-center overflow-hidden rounded-sm" aria-hidden>
			<Flag title="" />
		</span>
	);
}

function CountryCallingCode({
	country,
	withCountryName = false,
}: {
	country: Country;
	withCountryName?: boolean;
}) {
	const phoneCountry = PHONE_COUNTRY_BY_VALUE.get(country);

	if (!phoneCountry) return null;

	return (
		<>
			<CountryFlag country={country} />
			<span className="truncate">
				{withCountryName ? phoneCountry.label : phoneCountry.callingCode}
			</span>
		</>
	);
}

export function PhoneNumberField(props: PhoneNumberFieldProps) {
	const {
		id,
		label,
		countryCallingCodeLabel,
		value,
		onValueChange,
		onBlur,
		required,
		invalid,
		errorMessages,
	} = props;
	const [country, setCountry] = useState<Country>(() => {
		const phoneCountry = value ? parsePhoneNumber(value)?.country : undefined;

		return phoneCountry ?? DEFAULT_PHONE_COUNTRY;
	});

	function handleCountryChange(nextCountry: Country) {
		const currentCallingCode = getCountryCallingCode(country);
		const nextCallingCode = getCountryCallingCode(nextCountry);
		const nextValue = value.startsWith(`+${currentCallingCode}`)
			? `+${nextCallingCode}${value.slice(currentCallingCode.length + 1)}`
			: value;

		setCountry(nextCountry);
		onValueChange(nextValue);
		if (isInternationalPhoneNumber(nextValue)) onBlur();
	}

	return (
		<Field name={id} invalid={invalid} className="flex flex-col gap-2">
			<Field.Label htmlFor={id} required={required}>
				{label}
			</Field.Label>
			<div className="flex gap-2">
				<Select
					items={PHONE_COUNTRIES}
					value={country}
					onValueChange={(nextCountry) => {
						if (nextCountry !== null) handleCountryChange(nextCountry);
					}}
				>
					<Select.Input
						aria-invalid={invalid}
						aria-label={countryCallingCodeLabel}
						className="w-28 shrink-0"
					>
						<Select.Value className="flex items-center gap-2">
							{(selectedCountry: Country | null) =>
								selectedCountry && <CountryCallingCode country={selectedCountry} />
							}
						</Select.Value>
					</Select.Input>
					<Select.Dropdown className="w-[min(20rem,calc(100svw-2rem))]">
						{PHONE_COUNTRIES.map((phoneCountry) => (
							<Select.Option
								key={phoneCountry.value}
								value={phoneCountry.value}
								label={phoneCountry.label}
							>
								<span className="flex min-w-0 items-center gap-2">
									<CountryCallingCode country={phoneCountry.value} withCountryName />
								</span>
							</Select.Option>
						))}
					</Select.Dropdown>
				</Select>
				<PhoneInput
					id={id}
					country={country}
					international
					value={value || undefined}
					onChange={(phoneNumber) => onValueChange(phoneNumber ?? "")}
					onBlur={onBlur}
					inputComponent={Input}
					type="tel"
					autoComplete="tel-national"
					placeholder="6 12 34 56 78"
					aria-invalid={invalid}
				/>
			</div>
			{invalid && errorMessages.map((error) => <Field.Error key={error}>{error}</Field.Error>)}
		</Field>
	);
}
