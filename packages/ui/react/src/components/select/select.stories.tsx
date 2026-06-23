import type { Meta, StoryObj } from "@storybook/react-vite";
import { Fragment } from "react/jsx-runtime";

import { Select } from "./index";

const OPTIONS = [
	{ value: 1, label: "Option 1" },
	{ value: 2, label: "Option 2" },
	{ value: 3, label: "Option 3" },
	{ value: 4, label: "Option 4" },
	{ value: 5, label: "Option 5" },
	{ value: 6, label: "Option 6" },
	{ value: 7, label: "Option 7" },
	{ value: 8, label: "Option 8" },
	{ value: 9, label: "Option 9" },
];

const GROUPED_OPTIONS = [
	{ label: "Group 1", value: OPTIONS.slice(0, 3) },
	{ label: "Group 2", value: OPTIONS.slice(3, 6) },
	{ label: "Group 3", value: OPTIONS.slice(6, 9) },
];

const meta: Meta<typeof Select> = {
	title: "Select",
	parameters: {
		docs: {
			description: {
				component: "https://base-ui.com/react/components/select",
			},
		},
	},
	component: Select,
	subcomponents: {
		Input: Select.Input,
		Value: Select.Value,
		Dropdown: Select.Dropdown,
		Option: Select.Option,
		Group: Select.Group,
		GroupLabel: Select.GroupLabel,
		Separator: Select.Separator,
	},
	argTypes: {
		defaultValue: {
			description: "The initial value of the select.",
			table: {
				type: {
					summary: "Value | Value[] | null | undefined",
				},
			},
		},
		value: {
			description: "The value of the select.",
			table: {
				type: {
					summary: "Value | Value[] | null | undefined",
				},
			},
		},
		onValueChange: {
			description: "Event handler called when the value of the select changes.",
			type: "function",
		},
		defaultOpen: {
			description: "Whether the select popup is initially open.",
			type: "boolean",
		},
		open: {
			description: "Whether the select popup is currently open.",
			type: "boolean",
		},
		onOpenChange: {
			description: "Event handler called when the select popup is opened or closed.",
			type: "function",
		},
		highlightItemOnHover: {
			description:
				"Whether moving the pointer over items should highlight them. Disabling this prop allows CSS :hover to be differentiated from the :focus (data-highlighted) state.",
			type: "boolean",
			table: {
				defaultValue: { summary: "true" },
			},
		},
		isItemEqualToValue: {
			description:
				"Custom comparison logic used to determine if a select item value matches the current selected value. Useful when item values are objects without matching referentially. Defaults to Object.is comparison.",
			type: "function",
		},
		itemToStringLabel: {
			description:
				"When the item values are objects (<Select.Option value={object}>), this function converts the object value to a string representation for display in the trigger. If the shape of the object is { value, label }, the label will be used automatically without needing to specify this prop.",
			type: "function",
		},
		itemToStringValue: {
			description:
				"When the item values are objects (<Select.Option value={object}>), this function converts the object value to a string representation for form submission. If the shape of the object is { value, label }, the value will be used automatically without needing to specify this prop.",
			type: "function",
		},
		items: {
			description:
				"Data structure of the items rendered in the select popup. When specified, <Select.Value> renders the label of the selected item instead of the raw value.",
			table: {
				type: {
					summary: "Record<string, ReactNode> | {label: ReactNode, value: any}[] | undefined",
				},
			},
		},
		multiple: {
			description: "Whether multiple items can be selected.",
			type: "boolean",
		},
		onOpenChangeComplete: {
			description:
				"Event handler called after any animations complete when the select popup is opened or closed.",
			type: "function",
		},
		disabled: {
			description: "Whether the component should ignore user interaction.",
			type: "boolean",
		},
	},
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
	args: {
		items: OPTIONS,
	},
	render: (args) => (
		<Select {...args}>
			<Select.Input className="w-[min(205px,calc(100svw-2rem))]">
				<Select.Value placeholder="Select an option" />
			</Select.Input>

			<Select.Dropdown>
				{OPTIONS.map((option) => {
					return (
						<Select.Option key={option.value} value={option.value} label={option.label}>
							{option.label}
						</Select.Option>
					);
				})}
			</Select.Dropdown>
		</Select>
	),
};

export const Multiple: Story = {
	args: {
		items: OPTIONS,
		multiple: true,
	},
	render: (args) => (
		<Select {...args}>
			<Select.Input className="w-[min(205px,calc(100svw-2rem))]">
				<Select.Value>
					{(values: number[]) => {
						if (values.length === 0) {
							return "Select some options";
						}

						const firstOption = OPTIONS.find((option) => option.value === values[0])?.label;
						const otherOptions = values.length > 1 ? `(+${values.length - 1} more)` : "";

						return `${firstOption}  ${otherOptions}`;
					}}
				</Select.Value>
			</Select.Input>

			<Select.Dropdown>
				{OPTIONS.map((option) => {
					return (
						<Select.Option key={option.value} value={option.value} label={option.label}>
							{option.label}
						</Select.Option>
					);
				})}
			</Select.Dropdown>
		</Select>
	),
};

export const Grouped: Story = {
	args: {
		items: OPTIONS,
	},
	render: (args) => (
		<Select {...args}>
			<Select.Input className="w-[min(205px,calc(100svw-2rem))]">
				<Select.Value placeholder="Select an option" />
			</Select.Input>

			<Select.Dropdown>
				{GROUPED_OPTIONS.map((group, index) => {
					return (
						<Fragment key={group.label}>
							{index !== 0 && <Select.Separator />}
							<Select.Group>
								<Select.GroupLabel>{group.label}</Select.GroupLabel>
								{group.value.map((option) => {
									return (
										<Select.Option
											className={"pl-4"}
											key={option.value}
											value={option.value}
											label={option.label}
										>
											{option.label}
										</Select.Option>
									);
								})}
							</Select.Group>
						</Fragment>
					);
				})}
			</Select.Dropdown>
		</Select>
	),
};
