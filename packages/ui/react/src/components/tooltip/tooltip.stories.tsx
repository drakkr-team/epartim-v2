import type { Meta, StoryObj } from "@storybook/react-vite";

import { Button } from "../button";
import { Tooltip } from "./index";

const meta: Meta<typeof Tooltip> = {
	title: "Tooltip",
	parameters: {
		docs: {
			description: {
				component: "https://base-ui.com/react/components/tooltip",
			},
		},
	},
	component: Tooltip,
	subcomponents: {
		Provider: Tooltip.Provider,
		Trigger: Tooltip.Trigger,
		Content: Tooltip.Content,
	},
	argTypes: {
		defaultOpen: {
			description: "Whether the tooltip is initially open.",
			control: "boolean",
			type: "boolean",
		},
		open: {
			description: "Whether the tooltip is currently open (controlled).",
			control: "boolean",
			type: "boolean",
		},
		onOpenChange: {
			description: "Event handler called when the tooltip open state changes.",
			table: {
				type: {
					summary: "function",
				},
			},
		},
		disabled: {
			description: "Whether the tooltip is disabled.",
			control: "boolean",
			type: "boolean",
		},
		disableHoverablePopup: {
			description: "Whether the tooltip contents can be hovered without closing the tooltip.",
			control: "boolean",
			type: "boolean",
		},
	},
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
	render: (props) => {
		return (
			<Tooltip.Provider>
				<Tooltip {...props}>
					<Tooltip.Trigger render={<Button />}>Hover me</Tooltip.Trigger>
					<Tooltip.Content>This is an helpful tooltip message</Tooltip.Content>
				</Tooltip>
			</Tooltip.Provider>
		);
	},
};
