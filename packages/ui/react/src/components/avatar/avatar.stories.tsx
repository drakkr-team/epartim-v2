import type { Meta, StoryObj } from "@storybook/react-vite";

import { Avatar, type AvatarProps } from "./index";

const AVATAR_SIZES: AvatarProps["size"][] = ["sm", "md", "lg"];

const meta: Meta<typeof Avatar> = {
	title: "Avatar",
	parameters: {
		description: {
			component: "https://base-ui.com/react/components/avatar",
		},
	},
	component: Avatar,
	subcomponents: {
		Image: Avatar.Image,
		Fallback: Avatar.Fallback,
	},
	argTypes: {
		size: {
			description: "The size of the avatar.",
			control: "select",
			options: AVATAR_SIZES,
			table: {
				defaultValue: { summary: "md" },
				type: { summary: '"sm" | "md" | "lg"' },
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
		<Avatar {...args}>
			<Avatar.Image src="https://images.unsplash.com/photo-1543610892-0b1f7e6d8ac1?w=128&h=128&dpr=2&q=80" />
			<Avatar.Fallback>JD</Avatar.Fallback>
		</Avatar>
	),
};

export const Sizes: Story = {
	render: () => (
		<div className="flex items-center gap-4">
			{AVATAR_SIZES.map((size) => (
				<Avatar key={size} size={size}>
					<Avatar.Image src="https://images.unsplash.com/photo-1543610892-0b1f7e6d8ac1?w=128&h=128&dpr=2&q=80" />
					<Avatar.Fallback>JD</Avatar.Fallback>
				</Avatar>
			))}
		</div>
	),
};
