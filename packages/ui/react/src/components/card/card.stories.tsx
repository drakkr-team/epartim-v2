import type { Meta, StoryObj } from "@storybook/react-vite";

import { Button } from "../button";
import { Card } from "./index";

const meta: Meta<typeof Card> = {
	title: "Card",
	component: Card,
	subcomponents: {
		Header: Card.Header,
		Content: Card.Content,
		Footer: Card.Footer,
	},
	argTypes: {
		children: {
			description: "The content of the card.",
			control: "text",
			table: {
				type: {
					summary: "ReactNode",
				},
			},
		},
		className: {
			description: "Additional CSS classes to apply to the card.",
			control: "text",
			table: {
				type: {
					summary: "string",
				},
			},
		},
		render: {
			description:
				"Allows you to replace the component's HTML element with a different tag, or compose it with another component.",
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

export const Default: Story = {
	render: (args) => (
		<Card className="max-w-sm" {...args}>
			<Card.Header>
				<h3 className="font-semibold text-lg text-neutral-12">Card Title</h3>
			</Card.Header>

			<Card.Content>
				<p className="text-neutral-11 text-sm">
					This card contains richer content with a title and description. It demonstrates how the
					card can be used as a container for more complex layouts.
				</p>
			</Card.Content>

			<Card.Footer>
				<Button>Action</Button>
			</Card.Footer>
		</Card>
	),
};
