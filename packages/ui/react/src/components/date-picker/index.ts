import { DatePicker as DatePickerRoot } from "./date-picker";

export { DayPicker as DatePickerHeadless } from "react-day-picker";

export const DatePicker = Object.assign(DatePickerRoot, {});

export type { DateRange } from "react-day-picker";

export type {
	DatePickerProps,
	DatePickerRangeProps,
	DatePickerSingleProps,
} from "./date-picker";
