import { useTranslation } from "react-i18next";

import type { routes } from "@workspace/api/registry";
import { Card } from "@workspace/ui-react/components/card";

import { DocumentCard } from "#/features/subscriptions/documents/components/document-card";

type SubscriptionDocument =
	(typeof routes)["client.subscriptions.view"]["types"]["response"]["documents"][number];

type DocumentsSectionProps = {
	description?: string;
	documents: SubscriptionDocument[];
	eyebrow?: string;
	showRequiredErrors?: boolean;
	subscriptionId: string;
	title?: string;
};

export function DocumentsSection(props: DocumentsSectionProps) {
	const { t } = useTranslation("features.subscriptions.documents.components.documents-section");
	const {
		description = t("description"),
		documents,
		eyebrow = t("eyebrow"),
		showRequiredErrors = false,
		subscriptionId,
		title = t("title"),
	} = props;

	return (
		<Card className="p-6 sm:p-8">
			<section aria-labelledby="documents-heading" className="grid gap-6">
				<div className="border-neutral-4 border-b pb-4">
					<p className="font-bold text-primary-9 text-xs uppercase tracking-widest">{eyebrow}</p>
					<h2 id="documents-heading" className="mt-2 font-bold text-secondary-12 text-xl">
						{title}
					</h2>
					<p className="mt-1 text-neutral-11 text-sm">{description}</p>
				</div>

				<div className="grid gap-4 md:grid-cols-2">
					{documents.map((document) => (
						<DocumentCard
							key={`${document.type}:${document.ownerId ?? "subscription"}`}
							document={document}
							showRequiredError={showRequiredErrors}
							subscriptionId={subscriptionId}
						/>
					))}
				</div>
			</section>
		</Card>
	);
}
