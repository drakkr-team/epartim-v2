import type { Meta, StoryObj } from "@storybook/react-vite";

import { Switch } from "./index";

const meta: Meta<typeof Switch> = {
	title: "Switch",
	parameters: {
		docs: {
			description: {
				component: "https://base-ui.com/react/components/switch",
			},
		},
	},
	component: Switch,
	argTypes: {
		defaultChecked: {
			description: "Whether the switch is initially checked.",
			control: "boolean",
			type: "boolean",
		},
		checked: {
			description: "Whether the switch is checked.",
			control: "boolean",
			type: "boolean",
		},
		onCheckedChange: {
			description: "The callback function called when the checked state changes.",
			table: {
				type: {
					summary: "function",
				},
			},
		},
		nativeButton: {
			description:
				"Whether the component renders a native <button> element when replacing it via the render prop. Set to true if the rendered element is a native button.",
			control: "boolean",
			type: "boolean",
		},

		disabled: {
			description: "Whether the switch is disabled.",
			control: "boolean",
			type: "boolean",
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
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
