import type { Meta, StoryObj } from "@storybook/react-vite";

import { Skeleton } from "./index";

const meta: Meta<typeof Skeleton> = {
	title: "Skeleton",
	component: Skeleton,
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
	render: (props) => (
		<div className="grid gap-1">
			<Skeleton className="size-9 rounded-full" {...props} />
			<Skeleton className="h-3.5 w-24 rounded-lg" {...props} />
			<Skeleton className="h-3 w-72 rounded-lg" {...props} />
		</div>
	),
};
