import type { Meta, StoryObj } from "@storybook/react-vite";

import { Spinner } from "./index";

const meta: Meta<typeof Spinner> = {
	title: "Spinner",
	component: Spinner,
	args: {
		className: "size-6 text-neutral-12",
	},
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
