import {
	ComboboxChip,
	ComboboxCollection,
	ComboboxDropdown,
	ComboboxEmpty,
	ComboboxGroup,
	ComboboxGroupLabel,
	ComboboxInput,
	ComboboxItem,
	ComboboxList,
	ComboboxRoot,
	ComboboxSearchInput,
	ComboboxSeparator,
	ComboboxValue,
} from "./combobox";

export { Combobox as ComboboxPrimitive } from "@base-ui/react/combobox";

export const Combobox = Object.assign(ComboboxRoot, {
	Input: ComboboxInput,
	Value: ComboboxValue,
	Chip: ComboboxChip,
	Dropdown: ComboboxDropdown,
	List: ComboboxList,
	SearchInput: ComboboxSearchInput,
	Empty: ComboboxEmpty,
	Item: ComboboxItem,
	Collection: ComboboxCollection,
	Group: ComboboxGroup,
	GroupLabel: ComboboxGroupLabel,
	Separator: ComboboxSeparator,
});

export type {
	ComboboxChipProps,
	ComboboxCollectionProps,
	ComboboxDropdownProps,
	ComboboxEmptyProps,
	ComboboxGroupLabelProps,
	ComboboxGroupProps,
	ComboboxInputProps,
	ComboboxItemProps,
	ComboboxListProps,
	ComboboxRootProps as ComboboxProps,
	ComboboxSearchInputProps,
	ComboboxSeparatorProps,
	ComboboxValueProps,
} from "./combobox";
