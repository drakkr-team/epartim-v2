import { useTranslation } from "react-i18next";

import type { Subscription } from "@workspace/api/data";

const TOTAL_STEPS = 5;

export function SubscriptionProgressCell({ completedSteps }: Pick<Subscription, "completedSteps">) {
	const { t } = useTranslation("features.subscriptions.hooks.use-table");
	const currentStep = Math.min(Math.max((completedSteps?.length ?? 0) + 1, 1), TOTAL_STEPS);

	return (
		<div className="flex min-w-28 items-center gap-3">
			<div
				aria-label={t("progress.label", { current: currentStep })}
				aria-valuemax={TOTAL_STEPS}
				aria-valuemin={1}
				aria-valuenow={currentStep}
				className="h-1.5 w-20 overflow-hidden rounded-full bg-neutral-5"
				role="progressbar"
			>
				<div
					className="h-full bg-primary-9"
					style={{ width: `${(currentStep / TOTAL_STEPS) * 100}%` }}
				/>
			</div>
			<span className="font-bold text-xs">{t("progress.value", { current: currentStep })}</span>
		</div>
	);
}
