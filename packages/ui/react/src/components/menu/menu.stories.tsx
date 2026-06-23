import type { Meta, StoryObj } from "@storybook/react-vite";

import { LaptopMinimalIcon, LogOutIcon, MoonIcon, SunIcon } from "../../icons";
import { Button } from "../button";
import { Menu } from "./index";

const meta: Meta<typeof Menu> = {
	title: "Menu",
	parameters: {
		docs: {
			description: {
				component: "https://base-ui.com/react/components/menu",
			},
		},
	},
	component: Menu,
	subcomponents: {
		Trigger: Menu.Trigger,
		Content: Menu.Content,
		Item: Menu.Item,
		Separator: Menu.Separator,
		Group: Menu.Group,
		GroupLabel: Menu.GroupLabel,
		Submenu: Menu.Submenu,
		SubmenuTrigger: Menu.SubmenuTrigger,
		CheckboxItem: Menu.CheckboxItem,
		RadioGroup: Menu.RadioGroup,
		RadioItem: Menu.RadioItem,
	},
	argTypes: {
		defaultOpen: {
			description: "Whether the menu is initially open.",
			control: "boolean",
			type: "boolean",
		},
		open: {
			description: "Whether the menu is open.",
			control: "boolean",
			type: "boolean",
		},
		onOpenChange: {
			description: "Event handler called when the menu is opened or closed.",
			table: {
				type: {
					summary: "function",
					detail: "(open: boolean, event: Menu.Root.ChangeEventDetails) => void",
				},
			},
		},
		highlightItemOnHover: {
			description:
				"Whether moving the pointer over items should highlight them. Disabling this prop allows CSS :hover to be differentiated from the :focus (data-highlighted) state.",
			control: "boolean",
			type: "boolean",
			table: {
				defaultValue: {
					summary: "true",
				},
			},
		},
		closeParentOnEsc: {
			description:
				"When in a submenu, determines whether pressing the Escape key closes the entire menu, or only the current child menu.",
			control: "boolean",
			type: "boolean",
			table: {
				defaultValue: { summary: "false" },
			},
		},
		loopFocus: {
			description:
				"Whether to loop keyboard focus back to the first item when the end of the list is reached while using the arrow keys.",
			control: "boolean",
			type: "boolean",
			table: {
				defaultValue: { summary: "true" },
			},
		},
		modal: {
			description: "Determines if the menu enters a modal state when open.",
			control: "boolean",
			type: "boolean",
			table: {
				defaultValue: { summary: "true" },
			},
		},
		onOpenChangeComplete: {
			description: "Event handler called after any animations complete when the menu is closed.",
			table: {
				type: {
					summary: "function",
					detail: "(open: boolean) => void",
				},
			},
		},
		disabled: {
			description: "Whether the component should ignore user interaction.",
			control: "boolean",
			type: "boolean",
		},
	},
};

export default meta;
type Story = StoryObj<typeof Menu>;

export const Default: Story = {
	render: () => (
		<Menu>
			<Menu.Trigger render={<Button variant="default" />}>Dropdown Menu</Menu.Trigger>
			<Menu.Content>
				<Menu.Item>Item 1</Menu.Item>
				<Menu.Item>Item 2</Menu.Item>
				<Menu.Separator />
				<Menu.Group>
					<Menu.GroupLabel>Group</Menu.GroupLabel>
					<Menu.Item>Group Item 1</Menu.Item>
					<Menu.Item>Group Item 2</Menu.Item>
					<Menu.Item disabled>Group Item 3</Menu.Item>
				</Menu.Group>
				<Menu.Separator />
				<Menu.Submenu>
					<Menu.SubmenuTrigger>Sub Menu</Menu.SubmenuTrigger>
					<Menu.Content sideOffset={8} alignOffset={-4}>
						<Menu.Item>Sub Menu Item 1</Menu.Item>
						<Menu.Item>Sub Menu Item 2</Menu.Item>
						<Menu.Item>Sub Menu Item 3</Menu.Item>
					</Menu.Content>
				</Menu.Submenu>
				<Menu.Submenu>
					<Menu.SubmenuTrigger>Theme</Menu.SubmenuTrigger>
					<Menu.Content sideOffset={8} alignOffset={-4}>
						<Menu.RadioGroup defaultValue="system">
							<Menu.RadioItem value="light">
								<SunIcon />
								Light
							</Menu.RadioItem>
							<Menu.RadioItem value="dark">
								<MoonIcon />
								Dark
							</Menu.RadioItem>
							<Menu.RadioItem value="system">
								<LaptopMinimalIcon />
								System
							</Menu.RadioItem>
						</Menu.RadioGroup>
					</Menu.Content>
				</Menu.Submenu>
				<Menu.Submenu>
					<Menu.SubmenuTrigger>Checkbox</Menu.SubmenuTrigger>
					<Menu.Content sideOffset={8} alignOffset={-4}>
						<Menu.CheckboxItem>Checkbox Item 1</Menu.CheckboxItem>
						<Menu.CheckboxItem>Checkbox Item 2</Menu.CheckboxItem>
						<Menu.CheckboxItem>Checkbox Item 3</Menu.CheckboxItem>
					</Menu.Content>
				</Menu.Submenu>
				<Menu.Separator />
				<Menu.Item variant="destructive">
					<LogOutIcon />
					Log out
				</Menu.Item>
			</Menu.Content>
		</Menu>
	),
};
