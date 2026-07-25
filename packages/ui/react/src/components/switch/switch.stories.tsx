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
		name: {
			type: "string",
		},
		defaultChecked: {
			type: "boolean",
		},
		checked: {
			type: "boolean",
		},
		onCheckedChange: {
			type: "function",
		},
		onBlur: {
			type: "function",
		},
		value: {
			type: "string",
		},
		form: {
			type: "string",
		},
		nativeButton: {
			type: "boolean",
		},
		uncheckedValue: {
			type: "string",
		},
		disabled: {
			type: "boolean",
		},
		readOnly: {
			type: "boolean",
		},
		required: {
			type: "boolean",
		},
		inputRef: {
			type: "function",
		},
		id: {
			type: "string",
		},
		className: {
			type: "string",
		},
		style: {},
		render: {
			type: "function",
		},
	},
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
