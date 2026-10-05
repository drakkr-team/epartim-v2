import { Link } from "@tanstack/react-router";
import { useEffect, useRef } from "react";
import { useTranslation } from "react-i18next";
import { cn } from "tailwind-variants";

import type { Subscription } from "@workspace/api/data";
import { CheckIcon, ChevronRightIcon } from "@workspace/ui-react/icons";

import { SUPPORTED_SUBSCRIPTION_STEPS } from "#/features/subscriptions/steps/step.constants";

type SubscriptionStepNavigationProps = Pick<Subscription, "completedSteps"> & {
	currentStep: number;
	subscriptionId: string;
};

export function SubscriptionStepNavigation(props: SubscriptionStepNavigationProps) {
	const { completedSteps, currentStep, subscriptionId } = props;
	const { t } = useTranslation("features.subscriptions.steps.subscription-step-navigation");
	const navigationRef = useRef<HTMLElement>(null);

	useEffect(() => {
		navigationRef.current
			?.querySelector(`[data-step="${currentStep}"]`)
			?.scrollIntoView({ block: "nearest", inline: "nearest" });
	}, [currentStep]);

	return (
		<nav
			aria-label={t("label")}
			className="overflow-x-auto rounded-md border border-neutral-4 bg-neutral-1 p-1.5 shadow-sm"
			ref={navigationRef}
		>
			<ol className="flex min-w-max items-center gap-1">
				{SUPPORTED_SUBSCRIPTION_STEPS.map((step, index) => {
					const isCurrent = step === currentStep;
					const isValidated = completedSteps?.includes(step) ?? false;
					const status = isValidated ? "validated" : isCurrent ? "current" : "pending";
					const number = String(step).padStart(2, "0");

					return (
						<li key={step} className="flex min-w-44 flex-1 items-center gap-1" data-step={step}>
							<Link
								activeOptions={{ exact: true }}
								className={cn(
									"flex min-w-0 flex-1 items-center gap-2 rounded-sm border px-2.5 py-1.5 transition-colors focus-visible:outline-2 focus-visible:outline-secondary-12 focus-visible:outline-offset-2",
									isCurrent
										? "border-secondary-12 bg-secondary-2"
										: "border-transparent hover:bg-neutral-2",
								)}
								params={{ id: subscriptionId, step: String(step) }}
								to="/subscriptions/$id/steps/$step"
							>
								<span
									aria-hidden="true"
									className={cn(
										"flex size-7 shrink-0 items-center justify-center rounded-full border-2 font-bold text-xs",
										isValidated
											? "border-secondary-12 bg-secondary-12 text-neutral-1"
											: isCurrent
												? "border-secondary-12 text-secondary-12"
												: "border-neutral-5 text-neutral-10",
									)}
								>
									{isValidated ? <CheckIcon className="size-3.5" /> : number}
								</span>
								<span className="grid min-w-0 gap-0.5">
									<span className="font-semibold text-2xs text-neutral-10 uppercase tracking-widest">
										{t("step", { number })}
									</span>
									<span
										className={cn(
											"whitespace-nowrap font-semibold text-xs",
											isCurrent ? "text-secondary-12" : "text-neutral-11",
										)}
									>
										{t(`steps.${step}`)}
									</span>
									<span
										className={cn(
											"text-2xs",
											isValidated && "sr-only",
											isCurrent ? "font-semibold text-primary-9" : "text-neutral-10",
										)}
									>
										{t(`status.${status}`)}
									</span>
								</span>
							</Link>
							{index < SUPPORTED_SUBSCRIPTION_STEPS.length - 1 && (
								<ChevronRightIcon aria-hidden="true" className="size-3.5 shrink-0 text-neutral-7" />
							)}
						</li>
					);
				})}
			</ol>
		</nav>
	);
}
