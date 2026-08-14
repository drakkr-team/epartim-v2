import type { Meta, StoryObj } from "@storybook/react-vite";
import { useState } from "react";

import { Field } from "../field";
import { Checkbox, type CheckboxProps } from "./index";

const CHECKBOX_SIZES: CheckboxProps["size"][] = ["md", "sm"];

const meta: Meta<typeof Checkbox> = {
	component: Checkbox,
	subcomponents: {
		Group: Checkbox.Group,
	},
	title: "Checkbox",
	parameters: {
		docs: {
			description: {
				component: "https://base-ui.com/react/components/checkbox",
			},
		},
	},
	argTypes: {
		size: {
			type: "string",
			control: "select",
			options: CHECKBOX_SIZES,
		},
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
		indeterminate: {
			type: "boolean",
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
		parent: {
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

export const Sizes: Story = {
	argTypes: {
		size: {
			control: false,
		},
	},
	render: (args) => (
		<div className="flex flex-wrap items-center justify-center gap-6">
			{CHECKBOX_SIZES.map((size) => (
				<Checkbox key={size} size={size} {...args} />
			))}
		</div>
	),
};

export const Group: Story = {
	argTypes: {
		value: {
			control: false,
		},
		parent: {
			control: false,
		},
	},
	render: (args) => {
		const fruits = ["Fuji", "Gala", "Granny Smith"];
		const [value, setValue] = useState<string[]>([]);

		return (
			<Checkbox.Group
				className="grid gap-2"
				value={value}
				onValueChange={setValue}
				allValues={fruits}
			>
				<Field>
					<Field.Label className="flex items-center gap-2 font-normal">
						<Checkbox parent {...args} />
						Apples
					</Field.Label>
				</Field>
				<div className="grid gap-2 pl-4">
					{fruits.map((fruit) => (
						<Field key={fruit}>
							<Field.Label className="flex items-center gap-2 font-normal">
								<Checkbox value={fruit} {...args} />
								{fruit}
							</Field.Label>
						</Field>
					))}
				</div>
			</Checkbox.Group>
		);
	},
};
