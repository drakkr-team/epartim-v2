import {
	SelectDropdown,
	SelectGroup,
	SelectGroupLabel,
	SelectInput,
	SelectOption,
	SelectRoot,
	SelectSeparator,
	SelectValue,
} from "./select";

export { Select as SelectHeadless } from "@base-ui/react/select";

export const Select = Object.assign(SelectRoot, {
	Input: SelectInput,
	Value: SelectValue,
	Dropdown: SelectDropdown,
	Option: SelectOption,
	Group: SelectGroup,
	GroupLabel: SelectGroupLabel,
	Separator: SelectSeparator,
});

export type {
	SelectDropdownProps,
	SelectGroupLabelProps,
	SelectGroupProps,
	SelectInputProps,
	SelectOptionProps,
	SelectRootProps as SelectProps,
	SelectSeparatorProps,
	SelectValueProps,
} from "./select";
