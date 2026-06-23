import {
	AutocompleteCollection,
	AutocompleteDropdown,
	AutocompleteEmpty,
	AutocompleteGroup,
	AutocompleteGroupLabel,
	AutocompleteInput,
	AutocompleteItem,
	AutocompleteList,
	AutocompleteRoot,
	AutocompleteSeparator,
} from "./autocomplete";

export { Autocomplete as AutocompletePrimitive } from "@base-ui/react/autocomplete";

export const Autocomplete = Object.assign(AutocompleteRoot, {
	Input: AutocompleteInput,
	Dropdown: AutocompleteDropdown,
	List: AutocompleteList,
	Item: AutocompleteItem,
	Empty: AutocompleteEmpty,
	Collection: AutocompleteCollection,
	Group: AutocompleteGroup,
	GroupLabel: AutocompleteGroupLabel,
	Separator: AutocompleteSeparator,
});

export type {
	AutoCompleteInputProps,
	AutocompleteCollectionProps,
	AutocompleteDropdownProps,
	AutocompleteEmptyProps,
	AutocompleteGroupLabelProps,
	AutocompleteGroupProps,
	AutocompleteItemProps,
	AutocompleteListProps,
	AutocompleteRootProps as AutocompleteProps,
	AutocompleteSeparatorProps,
} from "./autocomplete";
