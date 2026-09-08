import { useTranslation } from "react-i18next";

import { Badge } from "@workspace/ui-react/components/badge";
import { Tabs } from "@workspace/ui-react/components/tabs";

import {
	type SubscriptionTabsListStatus as SubscriptionListStatusValue,
	subscriptionListStatuses,
	subscriptionTabsStatusOptions,
} from "#/features/subscriptions/status-options";

type SubscriptionStatusTabsProps = {
	status: SubscriptionListStatusValue;
	statusCounts: Record<SubscriptionListStatusValue, number>;
	onValueChange: (status: SubscriptionListStatusValue) => void;
};

export function SubscriptionStatusTabs(props: SubscriptionStatusTabsProps) {
	const { status, statusCounts, onValueChange } = props;
	const { t } = useTranslation("routes.(private).(operations).subscriptions");

	return (
		<Tabs
			value={status}
			onValueChange={(value) => onValueChange(value as SubscriptionListStatusValue)}
		>
			<Tabs.List className="gap-3">
				{subscriptionListStatuses.map((value) => {
					const option = subscriptionTabsStatusOptions[value];

					return (
						<Tabs.Tab key={value} className="px-3 data-active:bg-transparent" value={value}>
							{t(`tabs.${option.translationKey}`)}
							<Badge
								className={option.badgeClassName}
								size="sm"
								variant={option.variant}
								withDot={false}
							>
								{statusCounts[value]}
							</Badge>
						</Tabs.Tab>
					);
				})}
			</Tabs.List>
		</Tabs>
	);
}
