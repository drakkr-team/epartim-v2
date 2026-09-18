import type { Meta, StoryObj } from "@storybook/react-vite";
import { useState } from "react";
import type { DateRange } from "react-day-picker";

import { DatePicker } from "./index";

const meta: Meta<typeof DatePicker> = {
	title: "DatePicker",
	component: DatePicker,
};

export default meta;
type Story = StoryObj;

function SingleDatePickerStory() {
	const [selected, setSelected] = useState<Date>();

	return (
		<DatePicker
			clearLabel="Effacer la date"
			clearable
			mode="single"
			onSelect={setSelected}
			placeholder="Sélectionner une date"
			selected={selected}
		/>
	);
}

function RangeDatePickerStory() {
	const [selected, setSelected] = useState<DateRange>();

	return (
		<DatePicker
			clearLabel="Effacer la période"
			clearable
			mode="range"
			onSelect={setSelected}
			placeholder="Sélectionner une période"
			selected={selected}
		/>
	);
}

export const Single: Story = {
	render: () => <SingleDatePickerStory />,
};

export const Range: Story = {
	render: () => <RangeDatePickerStory />,
};
