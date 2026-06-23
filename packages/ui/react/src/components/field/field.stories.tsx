import type { Meta, StoryObj } from "@storybook/react-vite";

import { Checkbox } from "../checkbox";
import { Combobox } from "../combobox";
import { Input } from "../input";
import { PasswordInput } from "../password-input";
import { Select } from "../select";
import { Switch } from "../switch";
import { Textarea } from "../textarea";
import { Field } from "./index";

const meta: Meta<typeof Field> = {
	title: "Field",
	parameters: {
		docs: {
			description: {
				component: "https://base-ui.com/react/components/field",
			},
		},
	},
	component: Field,
	subcomponents: {
		Label: Field.Label,
		Description: Field.Description,
		Error: Field.Error,
	},
	argTypes: {
		disabled: {
			description: "Whether the field should ignore user interaction.",
			control: "boolean",
			type: "boolean",
		},
		invalid: {
			description: "Whether the field is invalid.",
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

export const TextField: Story = {
	render: (args) => (
		<Field className="grid gap-1" {...args}>
			<Field.Label>Name</Field.Label>
			<Input />
			<Field.Description>Visible on your profile</Field.Description>
			<Field.Error>Name is required</Field.Error>
		</Field>
	),
};

export const PasswordField: Story = {
	render: (args) => (
		<Field className="grid gap-1" {...args}>
			<Field.Label>Password</Field.Label>
			<PasswordInput />
			<Field.Description>Must be at least 8 characters</Field.Description>
			<Field.Error>Password is too short</Field.Error>
		</Field>
	),
};

export const TextareaField: Story = {
	render: (args) => (
		<Field className="grid gap-1" {...args}>
			<Field.Label>Bio</Field.Label>
			<Textarea autoResize data-invalid={args.invalid || null} />
			<Field.Description>Tell us a little about yourself</Field.Description>
			<Field.Error>Bio is required</Field.Error>
		</Field>
	),
};

export const SwitchField: Story = {
	render: (args) => (
		<Field className="grid grid-cols-[auto_1fr] gap-x-3 gap-y-1" {...args}>
			<Switch className="col-start-1" />

			<Field.Label className="col-start-2">Enable notifications</Field.Label>
			<Field.Description className="col-start-2">
				Receive updates about new features and offers
			</Field.Description>
			<Field.Error className="col-start-2">You must enable notifications to proceed</Field.Error>
		</Field>
	),
};

export const CheckboxField: Story = {
	render: (args) => (
		<Field className="grid grid-cols-[auto_1fr] gap-x-3 gap-y-1" {...args}>
			<Checkbox className="col-start-1" />

			<Field.Label className="col-start-2">Accept terms and conditions</Field.Label>
			<Field.Description className="col-start-2">
				You must accept our terms and conditions to proceed
			</Field.Description>
			<Field.Error className="col-start-2">
				You must accept the terms and conditions to proceed
			</Field.Error>
		</Field>
	),
};

export const SelectField: Story = {
	render: (args) => {
		const options = [
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

		return (
			<Field className="grid gap-1" {...args}>
				<Field.Label>Programming Language</Field.Label>
				<Select items={options}>
					<Select.Input className="w-[min(205px,calc(100svw-2rem))]">
						<Select.Value placeholder="Select an option" />
					</Select.Input>

					<Select.Dropdown>
						{options.map((option) => {
							return (
								<Select.Option key={option.value} value={option.value} label={option.label}>
									{option.label}
								</Select.Option>
							);
						})}
					</Select.Dropdown>
				</Select>
				<Field.Description>Select your preferred programming language</Field.Description>
				<Field.Error>Please select a programming language</Field.Error>
			</Field>
		);
	},
};

export const ComboboxField: Story = {
	render: (args) => {
		const options = [
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

		return (
			<Field className="grid gap-1" {...args}>
				<Field.Label>Programming Language</Field.Label>
				<Combobox items={options}>
					<Combobox.Input className="w-[min(205px,calc(100svw-2rem))]">
						<Combobox.Value placeholder="Select an option" />
					</Combobox.Input>

					<Combobox.Dropdown>
						<Combobox.SearchInput placeholder="Search..." />

						<Combobox.Empty>No options found</Combobox.Empty>

						<Combobox.List>
							{(item: (typeof options)[number]) => (
								<Combobox.Item key={item.value} value={item.value}>
									{item.label}
								</Combobox.Item>
							)}
						</Combobox.List>
					</Combobox.Dropdown>
				</Combobox>
				<Field.Description>Select your preferred programming language</Field.Description>
				<Field.Error>Please select a programming language</Field.Error>
			</Field>
		);
	},
};
