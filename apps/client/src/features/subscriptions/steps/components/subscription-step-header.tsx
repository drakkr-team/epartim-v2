import { useTranslation } from "react-i18next";

import { Badge } from "@workspace/ui-react/components/badge";

type SubscriptionStepHeaderProps = {
	description: string;
	eyebrow: string;
	isValidated?: boolean;
	title: string;
};

export function SubscriptionStepHeader(props: SubscriptionStepHeaderProps) {
	const { description, eyebrow, isValidated = false, title } = props;
	const { t } = useTranslation("features.subscriptions.steps.subscription-step-header");

	return (
		<header className="border-neutral-4 border-b pb-6">
			<div className="flex flex-wrap items-center gap-3">
				<p className="font-bold text-primary-9 text-xs uppercase tracking-widest">{eyebrow}</p>
				{isValidated && <Badge color="success">{t("validated")}</Badge>}
			</div>
			<h1 className="mt-3 font-bold text-3xl text-secondary-12">{title}</h1>
			<p className="mt-2 text-neutral-11 text-sm sm:text-base">{description}</p>
		</header>
	);
}
