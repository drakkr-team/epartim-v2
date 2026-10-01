import type { ReactNode } from "react";

import { Card } from "@workspace/ui-react/components/card";
import { HeadphonesIcon } from "@workspace/ui-react/icons";

type InformationCardProps = {
	children?: ReactNode;
	description: ReactNode;
	title: ReactNode;
};

export function InformationCard(props: InformationCardProps) {
	const { children, description, title } = props;

	return (
		<Card
			role="note"
			className="grid gap-4 rounded-sm border border-neutral-5 bg-neutral-2 p-4 sm:grid-cols-[auto_1fr]"
		>
			<div className="flex size-9 items-center justify-center rounded-full bg-secondary-12 text-primary-7">
				<HeadphonesIcon aria-hidden="true" className="size-4" />
			</div>
			<div>
				<h3 className="font-bold text-secondary-12 text-sm">{title}</h3>
				<p className="mt-1 text-neutral-11 text-sm">{description}</p>
				{children}
			</div>
		</Card>
	);
}
