import { Link } from "@tanstack/react-router";
import type { ReactNode } from "react";
import { useTranslation } from "react-i18next";

import { Button } from "@workspace/ui-react/components/button";

const TOTAL_STEPS = 5;

type SubscriptionStepFooterProps = {
	children: ReactNode;
	currentStep: number;
	stepLabel: string;
};

export function SubscriptionStepFooter(props: SubscriptionStepFooterProps) {
	const { children, currentStep, stepLabel } = props;
	const { t } = useTranslation("features.subscriptions.steps.subscription-step-footer");
	const currentStepLabel = t("current-step", {
		current: String(currentStep).padStart(2, "0"),
		label: stepLabel,
		total: String(TOTAL_STEPS).padStart(2, "0"),
	});

	return (
		<footer className="flex flex-col gap-4 rounded-md border border-neutral-4 bg-neutral-1 p-4 sm:flex-row sm:items-center sm:justify-between sm:px-6">
			<div className="flex min-w-0 flex-wrap items-center gap-x-8 gap-y-3">
				<Button nativeButton={false} variant="ghost" render={<Link to="/subscriptions" />}>
					{t("action.quit")}
				</Button>
				<p className="font-medium text-neutral-11 text-xs sm:text-xs">{currentStepLabel}</p>
			</div>
			<div className="shrink-0">{children}</div>
		</footer>
	);
}
