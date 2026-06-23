import type { Meta, StoryObj } from "@storybook/react-vite";

import { Button } from "@workspace/ui-react/components/button";

import { CopyIcon, FileCodeCornerIcon, SendHorizontalIcon } from "../../icons";
import { Textarea } from "./index";

const meta: Meta<typeof Textarea> = {
	component: Textarea,
	title: "Textarea",
	argTypes: {
		defaultValue: {
			description: "The initial value of the text area.",
			type: "string",
		},
		value: {
			description: "The value of the text area.",
			type: "string",
		},
		placeholder: {
			description: "The placeholder text to display when the text area is empty.",
			type: "string",
		},
		disabled: {
			description: "Whether the text area is disabled.",
			type: "boolean",
		},
		autoResize: {
			description: "Whether the text area should automatically resize to fit its content.",
			type: "boolean",
		},
		topSlot: {
			description: "The top slot of the text area.",
			control: "select",
			options: ["File Info"],
			mapping: {
				"File Info": (
					<div className="flex items-center justify-between">
						<p className="flex items-center gap-1 text-neutral-11 text-xs">
							<FileCodeCornerIcon className="size-4" /> Index.tsx
						</p>

						<Button variant="ghost" size="icon-sm">
							<CopyIcon />
						</Button>
					</div>
				),
			},
		},
		bottomSlot: {
			description: "The bottom slot of the text area.",
			control: "select",
			options: ["Submit Button"],
			mapping: {
				"Submit Button": (
					<div className="flex justify-end">
						<Button variant="primary" size="icon-sm">
							<SendHorizontalIcon />
						</Button>
					</div>
				),
			},
		},
		onChange: {
			description: "The change event handler of the text area.",
			type: "function",
		},
	},
	args: {
		defaultValue:
			"Lorem ipsum dolor sit amet consectetur, adipisicing elit. Voluptas, quasi officiis. Iure autem eum non quam commodi numquam maiores sapiente quibusdam perspiciatis, explicabo dolorum dolore voluptate adipisci, impedit labore quos.",
	},
};

export default meta;
type Story = StoryObj<typeof Textarea>;

export const Default: Story = {
	render: (args) => <Textarea className="min-h-24 w-72" {...args} />,
};
