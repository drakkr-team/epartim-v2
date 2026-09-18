import { useTranslation } from "react-i18next";

import type { routes } from "@workspace/api/registry";
import { Card } from "@workspace/ui-react/components/card";

import { DocumentCard } from "#/features/subscriptions/documents/components/document-card";

type SubscriptionDocument =
	(typeof routes)["client.subscriptions.view"]["types"]["response"]["documents"][number];

type DocumentsSectionProps = {
	documents: SubscriptionDocument[];
	showRequiredErrors?: boolean;
	subscriptionId: string;
};

export function DocumentsSection(props: DocumentsSectionProps) {
	const { documents, showRequiredErrors = false, subscriptionId } = props;
	const { t } = useTranslation("features.subscriptions.documents.components.documents-section");

	return (
		<Card className="p-6 sm:p-8">
			<section aria-labelledby="documents-heading" className="grid gap-6">
				<div className="border-neutral-4 border-b pb-4">
					<p className="font-bold text-primary-9 text-xs uppercase tracking-widest">
						{t("eyebrow")}
					</p>
					<h2 id="documents-heading" className="mt-2 font-bold text-secondary-12 text-xl">
						{t("title")}
					</h2>
					<p className="mt-1 text-neutral-11 text-sm">{t("description")}</p>
				</div>

				<div className="grid gap-4 md:grid-cols-2">
					{documents.map((document) => (
						<DocumentCard
							key={document.type}
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
