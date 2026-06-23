import type { Meta, StoryObj } from "@storybook/react-vite";

import { Card } from "../card";
import { ScrollArea } from "./index";

const meta: Meta<typeof ScrollArea> = {
	title: "Scroll Area",
	parameters: {
		docs: {
			description: {
				component: "https://base-ui.com/react/components/scroll-area",
			},
		},
	},
	component: ScrollArea,
	argTypes: {
		variant: {
			description: "The variant of the scroll area.",
			control: "select",
			options: ["scrollbar", "gradient", "both"],
			table: {
				defaultValue: {
					summary: "scrollbar",
				},
				type: {
					summary: "'scrollbar' | 'gradient' | 'both'",
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
	},
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
	render: (args) => (
		<ScrollArea className="h-96 w-96 p-0" render={<Card />} {...args}>
			<Card.Content className="grid grid-cols-[repeat(5,1fr)] gap-4 p-4">
				{Array.from({ length: 50 }).map((_, i) => (
					<div
						// biome-ignore lint/suspicious/noArrayIndexKey: Using index as key is acceptable here because the list is static and will not change.
						key={i}
						className="flex size-24 items-center justify-center rounded-lg bg-neutral-3 text-neutral-12 text-sm"
					>
						{i + 1}
					</div>
				))}
			</Card.Content>
		</ScrollArea>
	),
};
