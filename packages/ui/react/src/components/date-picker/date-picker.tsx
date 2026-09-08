import { Popover as PopoverHeadless } from "@base-ui/react/popover";
import { type MouseEvent, type ReactNode, useState } from "react";
import {
	type DateRange,
	DayPicker,
	type PropsBase,
	type PropsRange,
	type PropsSingle,
} from "react-day-picker";
import { fr } from "react-day-picker/locale";
import { cn } from "tailwind-variants";

import { CalendarIcon, XIcon } from "../../icons";
import { Button } from "../button";
import { Input } from "../input";

type DatePickerBaseProps = {
	clearable?: boolean;
	clearLabel?: string;
	dateStyle?: Intl.DateTimeFormatOptions["dateStyle"];
	inputClassName?: string;
	placeholder?: string;
};

export type DatePickerSingleProps = DatePickerBaseProps &
	Omit<PropsSingle, "onSelect" | "selected"> & {
		defaultSelected?: Date;
		onSelect?: (selected: Date | undefined) => void;
		selected?: Date;
	};

export type DatePickerRangeProps = DatePickerBaseProps &
	Omit<PropsRange, "onSelect" | "selected"> & {
		defaultSelected?: DateRange;
		onSelect?: (selected: DateRange | undefined) => void;
		selected?: DateRange;
	};

export type DatePickerProps = DatePickerSingleProps | DatePickerRangeProps;

type DatePickerContentProps = Pick<
	DatePickerBaseProps,
	"clearable" | "clearLabel" | "dateStyle" | "inputClassName" | "placeholder"
> & {
	children: ReactNode;
	onClear: () => void;
	selected: Date | DateRange | undefined;
};

function formatDate(date: Date, dateStyle: Intl.DateTimeFormatOptions["dateStyle"]) {
	return new Intl.DateTimeFormat("fr-FR", { dateStyle }).format(date);
}

function formatValue(
	selected: Date | DateRange | undefined,
	dateStyle: Intl.DateTimeFormatOptions["dateStyle"],
) {
	if (selected instanceof Date) return formatDate(selected, dateStyle);
	if (!selected?.from) return undefined;
	if (!selected.to) return formatDate(selected.from, dateStyle);

	return `${formatDate(selected.from, dateStyle)} – ${formatDate(selected.to, dateStyle)}`;
}

function DatePickerContent(props: DatePickerContentProps) {
	const {
		children,
		clearable = false,
		clearLabel = "Clear selection",
		dateStyle = "short",
		inputClassName,
		onClear,
		placeholder,
		selected,
	} = props;
	const [open, setOpen] = useState(false);
	const value = formatValue(selected, dateStyle);

	const handleClear = (event: MouseEvent<HTMLButtonElement>) => {
		event.preventDefault();
		event.stopPropagation();
		onClear();
		setOpen(false);
	};

	return (
		<PopoverHeadless.Root open={open} onOpenChange={setOpen}>
			<PopoverHeadless.Trigger
				nativeButton={false}
				render={
					<div className="relative">
						<Input
							aria-label={placeholder}
							className={cn(
								"cursor-pointer",
								!value && "text-neutral-9",
								clearable && value && "pr-10",
								inputClassName,
							)}
							readOnly
							rightSlot={<CalendarIcon className="size-4 text-neutral-11" />}
							type="button"
							value={value ?? placeholder ?? ""}
						/>
						{clearable && value && (
							<Button
								aria-label={clearLabel}
								className="absolute top-1/2 right-1 -translate-y-1/2"
								onClick={handleClear}
								size="icon-sm"
								variant="ghost"
							>
								<XIcon />
							</Button>
						)}
					</div>
				}
			/>
			<PopoverHeadless.Portal>
				<PopoverHeadless.Positioner align="start" collisionPadding={16} sideOffset={8}>
					<PopoverHeadless.Popup
						className={cn(
							"z-50 origin-(--transform-origin) outline-none transition",
							"data-starting-style:scale-95 data-starting-style:opacity-0",
							"data-ending-style:scale-95 data-ending-style:opacity-0",
						)}
					>
						{children}
					</PopoverHeadless.Popup>
				</PopoverHeadless.Positioner>
			</PopoverHeadless.Portal>
		</PopoverHeadless.Root>
	);
}

function Calendar(props: PropsBase & (PropsSingle | PropsRange)) {
	const { captionLayout = "dropdown", classNames, components, ...rest } = props;
	const currentYear = new Date().getFullYear();

	return (
		<DayPicker
			captionLayout={captionLayout}
			classNames={{
				root: cn(
					"rounded-lg border border-neutral-7 bg-neutral-1 p-3 text-neutral-12",
					classNames?.root,
				),
				months: cn("flex items-start gap-2", classNames?.months),
				month: cn("relative grid gap-4", classNames?.month),
				button_previous: cn("absolute top-0 left-0", classNames?.button_previous),
				button_next: cn("absolute top-0 right-0", classNames?.button_next),
				month_caption: cn(
					"relative mx-9 flex h-9 items-center justify-center",
					classNames?.month_caption,
				),
				dropdowns: cn("flex items-center gap-2 text-neutral-12 text-sm", classNames?.dropdowns),
				dropdown_root: cn(
					"relative inline-flex h-9 items-center rounded-md border border-neutral-7 bg-neutral-1 px-2",
					classNames?.dropdown_root,
				),
				dropdown: cn(
					"absolute inset-0 z-10 m-0 size-full cursor-pointer appearance-none border-0 p-0 opacity-0",
					classNames?.dropdown,
				),
				month_grid: cn(
					"border-separate border-spacing-x-1 border-spacing-y-2",
					classNames?.month_grid,
				),
				weekday: cn("font-normal text-neutral-11 text-xs capitalize", classNames?.weekday),
				caption_label: cn(
					"flex items-center gap-1 whitespace-nowrap text-neutral-12 text-sm",
					classNames?.caption_label,
				),
				day: cn(
					"size-9 rounded-md text-center font-medium text-sm transition hover:bg-neutral-3",
					classNames?.day,
				),
				today: cn("bg-neutral-3 hover:bg-neutral-4", classNames?.today),
				outside: cn("opacity-50", classNames?.outside),
				selected: cn("bg-primary-9 text-primary-1 hover:bg-primary-10", classNames?.selected),
				focused: cn("ring-3 ring-primary-7", classNames?.focused),
				disabled: cn("pointer-events-none line-through opacity-30", classNames?.disabled),
				range_middle: cn("bg-neutral-4 text-neutral-12", classNames?.range_middle),
				day_button: cn(
					"flex h-full w-full items-center justify-center outline-none",
					classNames?.day_button,
				),
				...classNames,
			}}
			components={{
				NextMonthButton: (buttonProps) => (
					<Button {...buttonProps} size="icon-sm" variant="ghost" />
				),
				PreviousMonthButton: (buttonProps) => (
					<Button {...buttonProps} size="icon-sm" variant="ghost" />
				),
				...components,
			}}
			endMonth={new Date(currentYear + 5, 11)}
			fixedWeeks
			locale={fr}
			navLayout="around"
			showOutsideDays
			startMonth={new Date(currentYear - 100, 0)}
			{...rest}
		/>
	);
}

function SingleDatePicker(props: DatePickerSingleProps) {
	const { defaultSelected, onSelect, selected: selectedProp, ...calendarProps } = props;
	const [uncontrolledSelected, setUncontrolledSelected] = useState(defaultSelected);
	const isControlled = "selected" in props;
	const selected = isControlled ? selectedProp : uncontrolledSelected;

	return (
		<DatePickerContent
			{...props}
			onClear={() => {
				if (!isControlled) setUncontrolledSelected(undefined);
				onSelect?.(undefined);
			}}
			selected={selected}
		>
			<Calendar
				{...calendarProps}
				selected={selected}
				onSelect={(nextSelected: Date | undefined) => {
					if (!isControlled) setUncontrolledSelected(nextSelected);
					onSelect?.(nextSelected);
				}}
			/>
		</DatePickerContent>
	);
}

function RangeDatePicker(props: DatePickerRangeProps) {
	const { defaultSelected, onSelect, selected: selectedProp, ...calendarProps } = props;
	const [uncontrolledSelected, setUncontrolledSelected] = useState(defaultSelected);
	const isControlled = "selected" in props;
	const selected = isControlled ? selectedProp : uncontrolledSelected;

	return (
		<DatePickerContent
			{...props}
			onClear={() => {
				if (!isControlled) setUncontrolledSelected(undefined);
				onSelect?.(undefined);
			}}
			selected={selected}
		>
			<Calendar
				{...calendarProps}
				selected={selected}
				onSelect={(nextSelected: DateRange | undefined) => {
					if (!isControlled) setUncontrolledSelected(nextSelected);
					onSelect?.(nextSelected);
				}}
			/>
		</DatePickerContent>
	);
}

export function DatePicker(props: DatePickerProps) {
	return props.mode === "single" ? <SingleDatePicker {...props} /> : <RangeDatePicker {...props} />;
}
