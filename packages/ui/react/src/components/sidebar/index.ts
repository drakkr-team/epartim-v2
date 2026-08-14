import {
	SidebarBody,
	SidebarFooter,
	SidebarGroup,
	SidebarGroupLabel,
	SidebarHeader,
	SidebarItem,
	SidebarRoot,
} from "./sidebar";

export const Sidebar = Object.assign(SidebarRoot, {
	Header: SidebarHeader,
	Body: SidebarBody,
	Footer: SidebarFooter,
	Group: SidebarGroup,
	GroupLabel: SidebarGroupLabel,
	Item: SidebarItem,
});

export type {
	SidebarBodyProps,
	SidebarFooterProps,
	SidebarGroupLabelProps,
	SidebarGroupProps,
	SidebarHeaderProps,
	SidebarItemProps,
	SidebarRootProps as SidebarProps,
} from "./sidebar";
