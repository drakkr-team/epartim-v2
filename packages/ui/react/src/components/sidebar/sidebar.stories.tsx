import type { Meta, StoryObj } from "@storybook/react-vite";

import { Sidebar } from "./index";

const meta: Meta<typeof Sidebar> = {
	component: Sidebar,
	subcomponents: {
		Header: Sidebar.Header,
		Body: Sidebar.Body,
		Footer: Sidebar.Footer,
	},
	title: "Sidebar",
	parameters: {
		layout: "fullscreen",
	},
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
	render: () => (
		<Sidebar>
			<Sidebar.Header></Sidebar.Header>
			<Sidebar.Body></Sidebar.Body>
			<Sidebar.Footer></Sidebar.Footer>
		</Sidebar>
	),
};
