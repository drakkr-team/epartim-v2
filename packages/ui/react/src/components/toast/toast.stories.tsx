import type { Meta, StoryObj } from "@storybook/react-vite";

import { Button } from "../button";
import { ToastProvider, toast } from "./index";

const meta: Meta<typeof ToastProvider> = {
	title: "Toast",
	parameters: {
		docs: {
			description: {
				component: "https://sonner.emilkowal.ski/getting-started",
			},
		},
	},
	component: ToastProvider,
	argTypes: {
		position: {
			control: {
				type: "select",
			},
			options: [
				"top-left",
				"top-center",
				"top-right",
				"bottom-left",
				"bottom-center",
				"bottom-right",
			],
		},
	},
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
	render: (args) => (
		<>
			<ToastProvider {...args} />
			<Button
				onClick={() =>
					toast("This is a toast message!", {
						description: "This is a description for the toast message.",
					})
				}
			>
				Render Toast
			</Button>
		</>
	),
};

export const Info: Story = {
	render: (args) => (
		<>
			<ToastProvider {...args} />
			<Button
				onClick={() =>
					toast.info("This is an info toast message!", {
						description: "This is a description for the info toast message.",
					})
				}
			>
				Render Info Toast
			</Button>
		</>
	),
};

export const Success: Story = {
	render: (args) => (
		<>
			<ToastProvider {...args} />
			<Button
				onClick={() =>
					toast.success("This is a success toast message!", {
						description: "This is a description for the success toast message.",
					})
				}
			>
				Render Success Toast
			</Button>
		</>
	),
};

// biome-ignore lint/suspicious/noShadowRestrictedNames: Variant name
export const Error: Story = {
	render: (args) => (
		<>
			<ToastProvider {...args} />
			<Button
				onClick={() =>
					toast.error("This is an error toast message!", {
						description: "This is a description for the error toast message.",
					})
				}
			>
				Render Error Toast
			</Button>
		</>
	),
};

export const Warning: Story = {
	render: (args) => (
		<>
			<ToastProvider {...args} />
			<Button
				onClick={() =>
					toast.warning("This is a warning toast message!", {
						description: "This is a description for the warning toast message.",
					})
				}
			>
				Render Warning Toast
			</Button>
		</>
	),
};

export const Loading: Story = {
	render: (args) => (
		<>
			<ToastProvider {...args} />
			<Button
				onClick={() =>
					toast.loading("This is a loading toast message!", {
						description: "This is a description for the loading toast message.",
					})
				}
			>
				Render Loading Toast
			</Button>
		</>
	),
};
