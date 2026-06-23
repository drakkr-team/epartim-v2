import type { Meta, StoryObj } from "@storybook/react-vite";

import { Link } from "./index";

const meta: Meta<typeof Link> = {
	component: Link,
	title: "Link",
	argTypes: {
		children: {
			description: "The content of the link.",
			control: "text",
			table: {
				type: {
					summary: "ReactNode",
				},
			},
		},
		href: {
			description: "The URL that the link points to.",
			control: "text",
			table: {
				type: {
					summary: "string",
				},
			},
		},
	},
	args: {
		children: "This is a link",
		href: "#",
	},
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
