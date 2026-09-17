import { useTranslation } from "react-i18next";

import type { routes } from "@workspace/api/registry";
import { Card } from "@workspace/ui-react/components/card";

type SubscriptionDocument =
	(typeof routes)["client.subscriptions.view"]["types"]["response"]["documents"][number];

type DocumentsChecklistProps = {
	documents: SubscriptionDocument[];
};

export function DocumentsChecklist(props: DocumentsChecklistProps) {
	const { documents } = props;
	const { t } = useTranslation("features.subscriptions.documents.components.documents-section");

	return (
		<Card className="p-4">
			<section aria-labelledby="documents-checklist-heading">
				<h2
					id="documents-checklist-heading"
					className="font-bold text-[0.6875rem] text-neutral-11 uppercase tracking-widest"
				>
					{t("checklist.title")}
				</h2>
				<ul className="mt-4 divide-y divide-neutral-4">
					{documents.map((document) => (
						<li
							key={document.type}
							className="flex items-start justify-between gap-3 py-2 first:pt-0"
						>
							<span className="text-neutral-11 text-xs leading-4">{document.label}</span>
							<span
								className={
									document.status === "attached"
										? "shrink-0 font-bold text-secondary-12 text-xs leading-4"
										: "shrink-0 font-bold text-primary-10 text-xs leading-4"
								}
							>
								{document.status === "attached" ? t("status.attached") : t("status.pending")}
							</span>
						</li>
					))}
				</ul>
			</section>
		</Card>
	);
}
