import type { Meta, StoryObj } from "@storybook/react-vite";

import { Checkbox } from "./index";

const meta: Meta<typeof Checkbox> = {
	component: Checkbox,
	title: "Checkbox",
	parameters: {
		docs: {
			description: {
				component: "https://base-ui.com/react/components/checkbox",
			},
		},
	},
	argTypes: {
		defaultChecked: {
			description: "Whether the checkbox is initially checked.",
			control: "boolean",
			type: "boolean",
		},
		checked: {
			description: "Whether the checkbox is checked.",
			control: "boolean",
			type: "boolean",
		},
		onCheckedChange: {
			description: "The callback function called when the checked state changes.",
			table: {
				type: {
					summary: "function",
					detail: "(checked: boolean, event: Checkbox.Root.ChangeEventDetails) => void",
				},
			},
		},
		indeterminate: {
			description: "Whether the checkbox is in a mixed state: neither checked, nor unchecked.",
			control: "boolean",
			type: "boolean",
		},
		nativeButton: {
			description:
				"Whether the component renders a native <button> element when replacing it via the render prop. Set to true if the rendered element is a native button.",
			control: "boolean",
			type: "boolean",
		},
		parent: {
			description: "Whether the checkbox controls a group of child checkboxes.",
			control: "boolean",
			type: "boolean",
		},
		uncheckedValue: {
			description:
				"The value submitted with the form when the checkbox is unchecked. By default, unchecked checkboxes do not submit any value, matching native checkbox behavior.",
			control: "text",
			type: "string",
		},
		disabled: {
			description: "Whether the checkbox is disabled.",
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
