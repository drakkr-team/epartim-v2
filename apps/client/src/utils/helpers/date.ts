import { format, parse } from "date-fns";

const calendarDateFormat = "yyyy-MM-dd";

export function parseCalendarDate(value: string | undefined) {
	if (!value) return undefined;

	return parse(value, calendarDateFormat, new Date());
}

export function formatCalendarDate(date: Date | undefined) {
	if (!date) return undefined;

	return format(date, calendarDateFormat);
}
