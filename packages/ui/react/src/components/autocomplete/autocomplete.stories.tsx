import type { Meta, StoryObj } from "@storybook/react-vite";

import { Autocomplete } from "./index";

const OPTIONS = [
	{ value: "js", label: "JavaScript" },
	{ value: "ts", label: "TypeScript" },
	{ value: "py", label: "Python" },
	{ value: "java", label: "Java" },
	{ value: "c", label: "C" },
	{ value: "cpp", label: "C++" },
	{ value: "csharp", label: "C#" },
	{ value: "ruby", label: "Ruby" },
	{ value: "php", label: "PHP" },
	{ value: "go", label: "Go" },
	{ value: "rust", label: "Rust" },
	{ value: "swift", label: "Swift" },
	{ value: "kotlin", label: "Kotlin" },
	{ value: "scala", label: "Scala" },
	{ value: "r", label: "R" },
	{ value: "dart", label: "Dart" },
	{ value: "elixir", label: "Elixir" },
	{ value: "clojure", label: "Clojure" },
	{ value: "haskell", label: "Haskell" },
	{ value: "lua", label: "Lua" },
	{ value: "perl", label: "Perl" },
];

const meta: Meta<typeof Autocomplete> = {
	title: "Autocomplete",
	parameters: {
		docs: {
			description: {
				component: "https://base-ui.com/react/components/autocomplete",
			},
		},
	},
	component: Autocomplete,
	subcomponents: {
		Input: Autocomplete.Input,
		Dropdown: Autocomplete.Dropdown,
		List: Autocomplete.List,
		Item: Autocomplete.Item,
		Empty: Autocomplete.Empty,
		Collection: Autocomplete.Collection,
		Group: Autocomplete.Group,
		GroupLabel: Autocomplete.GroupLabel,
		Separator: Autocomplete.Separator,
	},
	argTypes: {
		defaultValue: {
			description: "The uncontrolled input value of the autocomplete when it’s initially rendered.",
			table: {
				type: {
					summary: "string | number | string[] | undefined",
				},
			},
		},
		value: {
			description: "The input value of the autocomplete. Use when controlled.",
			table: {
				type: {
					summary: "string | number | string[] | undefined",
				},
			},
		},
		onValueChange: {
			description: "Event handler called when the input value of the autocomplete changes.",
			type: "function",
		},
		defaultOpen: {
			description: "Whether the popup is initially open.",
			type: "boolean",
		},
		open: {
			description: "Whether the popup is currently open. Use when controlled.",
			type: "boolean",
		},
		onOpenChange: {
			description: "Event handler called when the popup is opened or closed.",
			type: "function",
		},
		autoHighlight: {
			description: "Whether the first matching item is highlighted automatically.",
			table: {
				type: {
					summary: "boolean | 'always' | undefined",
				},
				defaultValue: { summary: "true" },
			},
		},
		keepHighlight: {
			description:
				"Whether the highlighted item should be preserved when the pointer leaves the list.",
			type: "boolean",
		},
		highlightItemOnHover: {
			description: "Whether moving the pointer over items should highlight them.",
			type: "boolean",
			table: {
				defaultValue: { summary: "true" },
			},
		},
		filter: {
			description: "AutocompleteFilter function used to match items vs input query.",
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
		itemToStringValue: {
			description:
				"When the item values are objects (<Autocomplete.Item value={object}>), this function converts the object value to a string representation for both display in the input and form submission.",
			type: "function",
		},
		items: {
			description: "The items to be displayed in the list.",
			table: {
				type: {
					summary: "{ items: any[] }[] | ItemValue[] | undefined",
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
		onItemHighlighted: {
			description: "Callback fired when an item is highlighted or unhighlighted.",
			type: "function",
		},
		onOpenChangeComplete: {
			description:
				"Event handler called after any animations complete when the popup is opened or closed.",
			type: "function",
		},
		openOnInputClick: {
			description: "Whether the popup opens when clicking the input.",
			type: "boolean",
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
		<Autocomplete {...args}>
			<Autocomplete.Input />

			<Autocomplete.Dropdown>
				<Autocomplete.Empty>No results found.</Autocomplete.Empty>

				<Autocomplete.List>
					{(item: (typeof OPTIONS)[number]) => (
						<Autocomplete.Item key={item.value} value={item}>
							{item.label}
						</Autocomplete.Item>
					)}
				</Autocomplete.List>
			</Autocomplete.Dropdown>
		</Autocomplete>
	),
};
