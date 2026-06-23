import type { Meta, StoryObj } from "@storybook/react-vite";

import { PlusIcon } from "../../icons";
import { Button, type ButtonProps } from "./index";

const BUTTON_VARIANTS: ButtonProps["variant"][] = ["default", "primary", "ghost", "destructive"];
const BUTTON_SIZES: ButtonProps["size"][] = ["md", "icon-sm", "icon-md"];

const meta: Meta<typeof Button> = {
	title: "Button",
	parameters: {
		docs: {
			description: {
				component: "https://base-ui.com/react/components/button",
			},
		},
	},
	component: Button,
	argTypes: {
		type: {
			description: "The HTML button type attribute.",
			control: "select",
			options: ["button", "submit", "reset"],
			table: {
				defaultValue: {
					summary: "button",
				},
				type: {
					summary: "'button' | 'submit' | 'reset'",
				},
			},
		},
		children: {
			description: "The content of the button.",
			control: "select",
			options: ["Text", "Icon", "Text + Icon"],
			mapping: {
				Text: "Button",
				Icon: <PlusIcon />,
				"Text + Icon": (
					<>
						<PlusIcon />
						Button
					</>
				),
			},
			table: {
				type: {
					summary: "ReactNode",
				},
			},
		},
		variant: {
			description: "The variant of the button.",
			control: "select",
			options: BUTTON_VARIANTS,
			table: {
				defaultValue: {
					summary: "default",
				},
				type: {
					summary: "'default' | 'primary' | 'ghost' | 'destructive'",
				},
			},
		},
		size: {
			description: "The size of the button.",
			control: "select",
			options: BUTTON_SIZES,
			table: {
				defaultValue: {
					summary: "md",
				},
				type: {
					summary: "'md' | 'icon-sm' | 'icon-md'",
				},
			},
		},
		disabled: {
			description: "Whether the button is disabled.",
			control: "boolean",
			type: "boolean",
		},
		focusableWhenDisabled: {
			description: "Whether the button should be focusable when disabled.",
			control: "boolean",
			type: "boolean",
		},
		nativeButton: {
			description:
				"Whether the component renders a native <button> element when replacing it via the render prop. Set to false if the rendered element is not a button (e.g. `<div>`).",
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
type Story = StoryObj<typeof Button>;

export const Default: Story = {
	args: {
		children: "Text",
	},
};

export const Variants: Story = {
	argTypes: {
		variant: {
			control: false,
		},
	},
	args: {
		children: "Text",
	},
	render: (args) => (
		<div className="flex flex-wrap gap-4">
			{BUTTON_VARIANTS.map((variant) => (
				<Button key={variant} variant={variant} {...args} />
			))}
		</div>
	),
};
