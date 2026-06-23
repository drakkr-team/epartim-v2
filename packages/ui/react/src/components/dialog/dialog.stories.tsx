import type { Meta, StoryObj } from "@storybook/react-vite";

import { Button } from "../button";
import { Dialog } from "./index";

const meta: Meta<typeof Dialog> = {
	component: Dialog,
	subcomponents: {
		Trigger: Dialog.Trigger,
		Content: Dialog.Content,
		Title: Dialog.Title,
		Description: Dialog.Description,
		Close: Dialog.Close,
	},
	title: "Dialog",
	parameters: {
		docs: {
			description: {
				component: "https://base-ui.com/react/components/dialog",
			},
		},
	},
	argTypes: {
		defaultOpen: {
			description: "Whether the dialog is initially open.",
			control: "boolean",
			type: "boolean",
		},
		open: {
			description: "Whether the dialog is currently open.",
			control: "boolean",
			type: "boolean",
		},
		onOpenChange: {
			description: "Event handler called when the dialog is opened or closed.",
			control: false,
			table: {
				type: {
					summary: "function",
				},
			},
		},
		onOpenChangeComplete: {
			description:
				"Event handler called after any animations complete when the modal is opened or closed.",
			control: false,
			table: {
				type: {
					summary: "function",
				},
			},
		},
	},
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
	render: (args) => {
		return (
			<Dialog {...args}>
				<Dialog.Trigger render={<Button />}>Open Dialog</Dialog.Trigger>
				<Dialog.Content className="flex flex-col gap-9 sm:max-w-lg">
					<div className="grid gap-2">
						<Dialog.Title className="font-bold text-2xl text-neutral-12">
							Lorem ipsum dolor sit amet.
						</Dialog.Title>
						<Dialog.Description className="text-neutral-11 text-sm">
							Lorem, ipsum dolor sit amet consectetur adipisicing elit. Repudiandae, beatae. Nihil,
							pariatur! Sequi iste officiis quos omnis perferendis, adipisci eos repudiandae est
							delectus blanditiis unde enim aut magnam nemo iure!
						</Dialog.Description>
					</div>

					<Dialog.Close
						className="w-full sm:ml-auto sm:w-fit"
						render={<Button variant="primary" />}
					>
						Submit
					</Dialog.Close>
				</Dialog.Content>
			</Dialog>
		);
	},
};
