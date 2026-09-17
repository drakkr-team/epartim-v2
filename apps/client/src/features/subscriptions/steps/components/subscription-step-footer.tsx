import { Link } from "@tanstack/react-router";
import type { ReactNode } from "react";
import { useTranslation } from "react-i18next";

import { Button } from "@workspace/ui-react/components/button";
import { ChevronLeftIcon, ChevronRightIcon } from "@workspace/ui-react/icons";

const TOTAL_STEPS = 5;

type SubscriptionStepFooterProps = {
	children: ReactNode;
	currentStep: number;
	nextStep?: number;
	stepLabel: string;
	subscriptionId: string;
};

export function SubscriptionStepFooter(props: SubscriptionStepFooterProps) {
	const { children, currentStep, nextStep, stepLabel, subscriptionId } = props;
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
			<div className="flex shrink-0 flex-wrap items-center gap-3">
				{currentStep > 1 && (
					<Button
						nativeButton={false}
						variant="default"
						render={
							<Link
								to="/subscriptions/$id/steps/$step"
								params={{ id: subscriptionId, step: String(currentStep - 1) }}
							/>
						}
					>
						<ChevronLeftIcon aria-hidden="true" />
						{t("action.previous")}
					</Button>
				)}
				{children}
				{nextStep && (
					<Button
						nativeButton={false}
						variant="default"
						render={
							<Link
								to="/subscriptions/$id/steps/$step"
								params={{ id: subscriptionId, step: String(nextStep) }}
							/>
						}
					>
						{t("action.next")}
						<ChevronRightIcon aria-hidden="true" />
					</Button>
				)}
			</div>
		</footer>
	);
}
