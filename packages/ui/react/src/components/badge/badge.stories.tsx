import type { Meta, StoryObj } from "@storybook/react-vite";

import { Badge, type BadgeProps } from "./index";

const COLORS: NonNullable<BadgeProps["color"]>[] = [
	"neutral",
	"primary",
	"secondary",
	"info",
	"success",
	"warning",
	"error",
];

const SIZES: NonNullable<BadgeProps["size"]>[] = ["sm", "md", "lg"];

const meta: Meta<typeof Badge> = {
	title: "Badge",
	component: Badge,
	args: {
		children: "Saisie en cours",
	},
	argTypes: {
		color: {
			control: "select",
			options: COLORS,
		},
		size: {
			control: "select",
			options: SIZES,
		},
	},
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const Colors: Story = {
	render: () => (
		<div className="flex flex-wrap items-center gap-3">
			{COLORS.map((color) => (
				<Badge key={color} color={color}>
					{color}
				</Badge>
			))}
		</div>
	),
};

export const Sizes: Story = {
	render: () => (
		<div className="flex items-center gap-3">
			{SIZES.map((size) => (
				<Badge key={size} size={size}>
					Saisie en cours
				</Badge>
			))}
		</div>
	),
};

export const WithoutDot: Story = {
	args: {
		withDot: false,
	},
};
