import { useTranslation } from "react-i18next";

import { DatePicker, type DateRange } from "@workspace/ui-react/components/date-picker";
import { Select } from "@workspace/ui-react/components/select";

import { DataTable } from "#/components/app/data-table";
import { parseCalendarDate } from "#/utils/helpers/date";

type SubscriptionsFiltersProps = {
	createdAtFrom?: string;
	createdAtTo?: string;
	onPeriodChange: (range: DateRange | undefined) => void;
	onProgressChange: (progress: number | undefined) => void;
	progress?: number;
};

const progressOptions = [1, 2, 3, 4, 5] as const;

export function SubscriptionsFilters(props: SubscriptionsFiltersProps) {
	const { createdAtFrom, createdAtTo, onPeriodChange, onProgressChange, progress } = props;
	const { t } = useTranslation("features.subscriptions.components.filters");
	const range = {
		from: parseCalendarDate(createdAtFrom),
		to: parseCalendarDate(createdAtTo),
	};
	const options = progressOptions.map((value) => ({
		value,
		label: t("progress.value", {
			progress: value,
			step: t(`progress.steps.${value}`),
		}),
	}));

	return (
		<div className="flex flex-wrap items-center gap-3">
			<div className="w-full sm:w-[18rem]">
				<DataTable.SearchInput
					aria-label={t("search.label")}
					placeholder={t("search.placeholder")}
				/>
			</div>

			<Select<number>
				items={options}
				onValueChange={(value) => onProgressChange(value ?? undefined)}
				value={progress ?? null}
			>
				<Select.Input className="w-52">
					<Select.Value placeholder={t("progress.placeholder")} />
				</Select.Input>
				<Select.Dropdown>
					<Select.Option value={null}>{t("progress.all")}</Select.Option>
					{options.map((option) => (
						<Select.Option key={option.value} value={option.value} label={option.label}>
							{option.label}
						</Select.Option>
					))}
				</Select.Dropdown>
			</Select>

			<DatePicker
				clearLabel={t("period.clear")}
				clearable
				inputClassName="w-64"
				mode="range"
				onSelect={onPeriodChange}
				placeholder={t("period.placeholder")}
				selected={range.from ? range : undefined}
			/>
		</div>
	);
}
