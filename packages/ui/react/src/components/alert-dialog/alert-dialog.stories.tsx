import type { Meta, StoryObj } from "@storybook/react-vite";

import { Button } from "../button";
import { AlertDialog } from "./index";

const meta: Meta<typeof AlertDialog> = {
	component: AlertDialog,
	subcomponents: {
		Trigger: AlertDialog.Trigger,
		Content: AlertDialog.Content,
		Title: AlertDialog.Title,
		Description: AlertDialog.Description,
		Close: AlertDialog.Close,
	},
	title: "Alert Dialog",
	parameters: {
		docs: {
			description: {
				component: "https://base-ui.com/react/components/alert-dialog",
			},
		},
	},
	argTypes: {
		defaultOpen: {
			description: "Whether the alert dialog is initially open.",
			control: "boolean",
			type: "boolean",
		},
		open: {
			description: "Whether the alert dialog is currently open.",
			control: "boolean",
			type: "boolean",
		},
		onOpenChange: {
			description: "Event handler called when the alert dialog is opened or closed.",
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
			<AlertDialog {...args}>
				<AlertDialog.Trigger render={<Button />}>Open Alert Dialog</AlertDialog.Trigger>
				<AlertDialog.Content className="flex flex-col gap-9 sm:max-w-lg">
					<div className="grid gap-2">
						<AlertDialog.Title className="font-bold text-2xl text-neutral-12">
							Lorem ipsum dolor sit amet.
						</AlertDialog.Title>
						<AlertDialog.Description className="text-neutral-11 text-sm">
							Lorem, ipsum dolor sit amet consectetur adipisicing elit. Repudiandae, beatae. Nihil,
							pariatur! Sequi iste officiis quos omnis perferendis, adipisci eos repudiandae est
							delectus blanditiis unde enim aut magnam nemo iure!
						</AlertDialog.Description>
					</div>

					<div className="flex flex-col items-center gap-2 sm:flex-row sm:justify-end">
						<AlertDialog.Close className="w-full sm:w-fit" render={<Button variant="default" />}>
							Cancel
						</AlertDialog.Close>
						<AlertDialog.Close
							className="w-full sm:w-fit"
							render={<Button variant="destructive" />}
						>
							Delete
						</AlertDialog.Close>
					</div>
				</AlertDialog.Content>
			</AlertDialog>
		);
	},
};
