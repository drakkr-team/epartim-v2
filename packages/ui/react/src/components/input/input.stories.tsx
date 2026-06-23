import type { Meta, StoryObj } from "@storybook/react-vite";

import { SearchIcon } from "../../icons";
import { Input } from "./index";

const meta: Meta<typeof Input> = {
	title: "Input",
	parameters: {
		docs: {
			description: {
				component: "https://base-ui.com/react/components/input",
			},
		},
	},
	component: Input,
	argTypes: {
		defaultValue: {
			description: "The initial value of the input.",
			control: "text",
			type: "string",
		},
		value: {
			description: "The value of the input.",
			control: "text",
			type: "string",
		},
		placeholder: {
			description: "The placeholder text to display when the input is empty.",
			control: "text",
			type: "string",
		},
		disabled: {
			description: "Whether the input is disabled.",
			control: "boolean",
			type: "boolean",
		},
		leftSlot: {
			description: "The left slot of the input.",
			control: "select",
			options: ["Search"],
			mapping: {
				Search: <SearchIcon className="mx-1 size-4 text-neutral-11" />,
			},
			table: {
				type: {
					summary: "ReactNode",
				},
			},
		},
		rightSlot: {
			description: "The right slot of the input.",
			control: "select",
			options: ["Search"],
			mapping: {
				Search: <SearchIcon className="mx-1 size-4 text-neutral-11" />,
			},
			table: {
				type: {
					summary: "ReactNode",
				},
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
		onValueChange: {
			description: "The callback function called when the value changes.",
			table: {
				type: {
					summary: "function",
				},
			},
		},
	},
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
