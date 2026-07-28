import {
	MenuCheckboxItem,
	MenuContent,
	MenuGroup,
	MenuGroupLabel,
	MenuItem,
	MenuRadioGroup,
	MenuRadioItem,
	MenuRoot,
	MenuSeparator,
	MenuSubmenu,
	MenuSubmenuTrigger,
	MenuTrigger,
} from "./menu";

export { Menu as MenuHeadless } from "@base-ui/react/menu";

export const Menu = Object.assign(MenuRoot, {
	Trigger: MenuTrigger,
	Content: MenuContent,
	Submenu: MenuSubmenu,
	SubmenuTrigger: MenuSubmenuTrigger,
	Group: MenuGroup,
	GroupLabel: MenuGroupLabel,
	Separator: MenuSeparator,
	Item: MenuItem,
	CheckboxItem: MenuCheckboxItem,
	RadioGroup: MenuRadioGroup,
	RadioItem: MenuRadioItem,
});

export type {
	MenuCheckboxItemProps,
	MenuContentProps,
	MenuGroupLabelProps,
	MenuGroupProps,
	MenuItemProps,
	MenuRadioGroupProps,
	MenuRadioItemProps,
	MenuRootProps as MenuProps,
	MenuSeparatorProps,
	MenuSubmenuProps,
	MenuSubmenuTriggerProps,
	MenuTriggerProps,
} from "./menu";
