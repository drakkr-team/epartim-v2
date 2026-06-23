import type { Meta, StoryObj } from "@storybook/react-vite";
import { Fragment } from "react/jsx-runtime";

import { Combobox } from "./index";

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
	{ value: 10, label: "Option 10" },
	{ value: 11, label: "Option 11" },
	{ value: 12, label: "Option 12" },
	{ value: 13, label: "Option 13" },
	{ value: 14, label: "Option 14" },
	{ value: 15, label: "Option 15" },
	{ value: 16, label: "Option 16" },
];

const GROUPED_OPTIONS = [
	{ value: "Group 1", items: OPTIONS.slice(0, 3) },
	{ value: "Group 2", items: OPTIONS.slice(3, 6) },
	{ value: "Group 3", items: OPTIONS.slice(6, 9) },
	{ value: "Group 4", items: OPTIONS.slice(9, 12) },
	{ value: "Group 5", items: OPTIONS.slice(12, 15) },
];

const meta: Meta<typeof Combobox> = {
	title: "Combobox",
	parameters: {
		docs: {
			description: {
				component: "https://base-ui.com/react/components/combobox",
			},
		},
	},
	component: Combobox,
	subcomponents: {
		Input: Combobox.Input,
		Value: Combobox.Value,
		Dropdown: Combobox.Dropdown,
		List: Combobox.List,
		SearchInput: Combobox.SearchInput,
		Empty: Combobox.Empty,
		Item: Combobox.Item,
		Collection: Combobox.Collection,
		Group: Combobox.Group,
		GroupLabel: Combobox.GroupLabel,
		Separator: Combobox.Separator,
	},
	argTypes: {
		defaultValue: {
			description: "The uncontrolled selected value of the combobox when it’s initially rendered.",
			table: {
				type: {
					summary: "Value[] | Value | null | undefined",
				},
			},
		},
		value: {
			description: "The selected value of the combobox. Use when controlled.",
			table: {
				type: {
					summary: "Value[] | Value | null | undefined",
				},
			},
		},
		onValueChange: {
			description: "Event handler called when the selected value of the combobox changes.",
			type: "function",
		},
		defaultInputValue: {
			description: "The uncontrolled search input value when initially rendered.",
			table: {
				type: {
					summary: "string | number | string[] | undefined",
				},
			},
		},
		inputValue: {
			description: "The search input value. Use when controlled.",
			table: {
				type: {
					summary: "string | number | string[] | undefined",
				},
			},
		},
		onInputValueChange: {
			description: "Event handler called when the search input value changes.",
			type: "function",
		},
		defaultOpen: {
			description: "Whether the popup is initially open.",
			type: "boolean",
		},
		open: {
			description: "Whether the popup is open. Use when controlled.",
			type: "boolean",
		},
		onOpenChange: {
			description: "Event handler called when the popup is opened or closed.",
			type: "function",
		},
		autoHighlight: {
			description: "Whether the first matching item is highlighted automatically while filtering.",
			type: "boolean",
			table: {
				defaultValue: { summary: "true" },
			},
		},
		highlightItemOnHover: {
			description: "Whether moving the pointer over items should highlight them.",
			type: "boolean",
			table: {
				defaultValue: { summary: "true" },
			},
		},
		autoComplete: {
			description: "Provides a hint to the browser for autofill.",
			type: "string",
		},
		filter: {
			description: "ComboboxFilter function used to match items vs input query.",
			type: "function",
		},
		filteredItems: {
			description:
				"Filtered items to display in the list. When provided, the list will use these items instead of filtering the items prop internally.",
			table: {
				type: {
					summary: "any[] | Group[] | undefined",
				},
			},
		},
		isItemEqualToValue: {
			description:
				"Custom comparison logic used to determine if a combobox item value matches the current selected value. ",
			type: "function",
		},
		itemToStringLabel: {
			description:
				"When the item values are objects (<Combobox.Item value={object}>), this function converts the object value to a string representation for display in the input.",
			type: "function",
		},
		itemToStringValue: {
			description:
				"When the item values are objects (<Combobox.Item value={object}>), this function converts the object value to a string representation for form submission.",
			type: "function",
		},
		items: {
			description: "The items to be displayed in the list.",
			table: {
				type: {
					summary: "any[] | Group[] | undefined",
				},
			},
		},
		limit: {
			description: "The maximum number of items to display in the list.",
			type: "number",
			table: {
				defaultValue: { summary: "-1" },
			},
		},
		loopFocus: {
			description:
				"Whether to loop keyboard focus back to the input when the end of the list is reached while using the arrow keys.",
			type: "boolean",
			table: {
				defaultValue: { summary: "true" },
			},
		},
		multiple: {
			description: "Whether multiple items can be selected.",
			type: "boolean",
		},
		onItemHighlighted: {
			description: "Callback fired when an item is highlighted or unhighlighted.",
			type: "function",
		},
		onOpenChangeComplete: {
			description:
				"Event handler called after any animations complete when the popup is opened or closed.",
			type: "function",
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
		<Combobox {...args}>
			<Combobox.Input className="w-[min(205px,calc(100svw-2rem))]">
				<Combobox.Value placeholder="Select an option" />
			</Combobox.Input>

			<Combobox.Dropdown>
				<Combobox.SearchInput placeholder="Search..." />

				<Combobox.Empty>No options found</Combobox.Empty>

				<Combobox.List>
					{(item: (typeof OPTIONS)[number]) => (
						<Combobox.Item key={item.value} value={item}>
							{item.label}
						</Combobox.Item>
					)}
				</Combobox.List>
			</Combobox.Dropdown>
		</Combobox>
	),
};

export const Multiple: Story = {
	args: {
		items: OPTIONS,
		multiple: true,
	},
	render: (args) => (
		<Combobox {...args}>
			<Combobox.Input className="w-[min(205px,calc(100svw-2rem))]">
				<Combobox.Value>
					{(values: typeof OPTIONS) => {
						if (values.length === 0) return "Select some options";

						return values.map((value) => (
							<Combobox.Chip key={value.value} aria-label={value.label}>
								{value.label}
							</Combobox.Chip>
						));
					}}
				</Combobox.Value>
			</Combobox.Input>
			<Combobox.Dropdown>
				<Combobox.SearchInput placeholder="Search..." />

				<Combobox.Empty>No options found</Combobox.Empty>

				<Combobox.List>
					{(item: (typeof OPTIONS)[number]) => (
						<Combobox.Item key={item.value} value={item}>
							{item.label}
						</Combobox.Item>
					)}
				</Combobox.List>
			</Combobox.Dropdown>
		</Combobox>
	),
};

export const Grouped: Story = {
	args: {
		items: GROUPED_OPTIONS,
	},
	render: (args) => (
		<Combobox {...args}>
			<Combobox.Input className="w-[min(205px,calc(100svw-2rem))]">
				<Combobox.Value placeholder="Select an option" />
			</Combobox.Input>

			<Combobox.Dropdown>
				<Combobox.SearchInput placeholder="Search..." />

				<Combobox.List>
					{(group: (typeof GROUPED_OPTIONS)[number], index) => (
						<Fragment key={group.value}>
							{index !== 0 && <Combobox.Separator />}
							<Combobox.Group items={group.items}>
								<Combobox.GroupLabel>{group.value}</Combobox.GroupLabel>
								<Combobox.Collection>
									{(item: (typeof OPTIONS)[number]) => (
										<Combobox.Item className="pr-2 pl-4" key={item.value} value={item}>
											{item.label}
										</Combobox.Item>
									)}
								</Combobox.Collection>
							</Combobox.Group>
						</Fragment>
					)}
				</Combobox.List>
			</Combobox.Dropdown>
		</Combobox>
	),
};
