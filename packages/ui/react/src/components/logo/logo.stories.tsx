import type { Meta, StoryObj } from "@storybook/react-vite";

import { Logo } from "./index";

const meta: Meta<typeof Logo> = {
	title: "Logo",
	component: Logo,
	args: {
		className: "h-10 w-auto text-primary-12",
	},
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
