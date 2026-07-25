import type { Meta, StoryObj } from "@storybook/react-vite";

import { NumberInput } from "./index";

const meta: Meta<typeof NumberInput> = {
	title: "Number Input",
	parameters: {
		docs: {
			description: {
				component: "https://base-ui.com/react/components/number-field",
			},
		},
	},
	component: NumberInput,
	argTypes: {
		name: {
			type: "string",
		},
		defaultValue: {
			type: "number",
		},
		value: {
			type: "number",
		},
		onValueChange: {
			type: "function",
		},
		onValueCommitted: {
			type: "function",
		},
		onBlur: {
			type: "function",
		},
		allowOutOfRange: {
			type: "boolean",
		},
		form: {
			type: "string",
		},
		locale: {},
		snapOnStep: {
			type: "boolean",
		},
		step: {
			type: "number",
		},
		smallStep: {
			type: "number",
		},
		largeStep: {
			type: "number",
		},
		min: {
			type: "number",
		},
		max: {
			type: "number",
		},
		allowWheelScrub: {
			type: "boolean",
		},
		format: {
			type: "function",
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
