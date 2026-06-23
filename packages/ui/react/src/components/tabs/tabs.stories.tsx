import type { Meta, StoryObj } from "@storybook/react-vite";
import { fn } from "storybook/test";

import {
	ActivityIcon,
	ChartAreaIcon,
	LayoutDashboardIcon,
	LifeBuoyIcon,
	MessageCircleIcon,
	Settings2Icon,
	UserIcon,
} from "../../icons";
import { Tabs } from "./index";

const meta: Meta<typeof Tabs> = {
	component: Tabs,
	subcomponents: {
		List: Tabs.List,
		Tab: Tabs.Tab,
		Panel: Tabs.Panel,
	},
	title: "Tabs",
	parameters: {
		docs: {
			description: {
				component: "https://base-ui.com/react/components/tabs",
			},
		},
		layout: "padded",
	},
	argTypes: {
		defaultValue: {
			description:
				"The default value. Use when the component is not controlled. When the value is null, no Tab will be active.",
			table: {
				type: {
					summary: "Tabs.Tab.Value",
				},
				defaultValue: {
					summary: "0",
				},
			},
		},
		value: {
			description:
				"The value of the currently active Tab. Use when the component is controlled. When the value is null, no Tab will be active.",
			table: {
				type: {
					summary: "Tabs.Tab.Value",
				},
			},
		},
		onValueChange: {
			description: "Callback invoked when new value is being set.",
			table: {
				type: {
					summary: "function",
				},
			},
		},
		orientation: {
			description: "The component orientation (layout flow direction).",
			control: "select",
			options: ["horizontal", "vertical", undefined],
			table: {
				defaultValue: { summary: "horizontal" },
			},
		},
		render: {
			description:
				"Allows you to replace the component’s HTML element with a different tag, or compose it with another component.",
			control: false,
			table: {
				type: {
					summary: "ReactElement",
				},
			},
		},
	},
	args: {
		onValueChange: fn(),
	},
};

export default meta;
type Story = StoryObj<typeof Tabs>;

export const Default: Story = {
	render: (args) => (
		<Tabs {...args}>
			<Tabs.List>
				<Tabs.Tab value={1}>
					<LayoutDashboardIcon />
					Tableau de bord
				</Tabs.Tab>
				<Tabs.Tab value={2}>
					<UserIcon />
					Profil
				</Tabs.Tab>
				<Tabs.Tab value={3}>
					<MessageCircleIcon />
					Messages
				</Tabs.Tab>
				<Tabs.Tab value={4}>
					<Settings2Icon />
					Paramètres
				</Tabs.Tab>
				<Tabs.Tab value={5}>
					<ActivityIcon />
					Activités
				</Tabs.Tab>
				<Tabs.Tab value={6}>
					<LifeBuoyIcon />
					Aide
				</Tabs.Tab>
				<Tabs.Tab value={7}>
					<ChartAreaIcon />
					Statistiques
				</Tabs.Tab>
			</Tabs.List>
		</Tabs>
	),
};
