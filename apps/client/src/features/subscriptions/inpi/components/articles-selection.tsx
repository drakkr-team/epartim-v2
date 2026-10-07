import { useTranslation } from "react-i18next";

import { Button } from "@workspace/ui-react/components/button";
import { Checkbox } from "@workspace/ui-react/components/checkbox";

import type { InpiPreview } from "#/features/subscriptions/inpi/types";
import { client } from "#/libs/tuyau";

type ArticlesSelectionProps = {
	subscriptionId: string;
	preview: InpiPreview;
	canImport: boolean;
	hasExisting: boolean;
	replaceExisting: boolean;
	onReplaceChange: (checked: boolean) => void;
	onImport: (actId: string) => void;
	pending: boolean;
	imported: boolean;
};

export function InpiArticlesSelection(props: ArticlesSelectionProps) {
	const {
		subscriptionId,
		preview,
		canImport,
		hasExisting,
		replaceExisting,
		onReplaceChange,
		onImport,
		pending,
		imported,
	} = props;
	const { t } = useTranslation("features.subscriptions.inpi");
	const article = preview.articles[0];
	const url = article
		? new URL(
				client.urlFor("client.subscriptions.inpi.preview_articles", {
					subscriptionId,
					previewId: preview.id,
					actId: article.id,
				}),
				import.meta.env.VITE_API_BASE_URL,
			).href
		: null;
	return (
		<section className="grid gap-3" aria-labelledby="inpi-articles-title">
			<h4 id="inpi-articles-title" className="font-semibold">
				{t("articles.title")}
			</h4>
			<p className="text-neutral-11 text-sm">{t("articles.description")}</p>
			{article && url ? (
				<>
					<p className="text-sm">
						{t("articles.date", {
							date: new Intl.DateTimeFormat("fr-FR").format(new Date(article.date)),
						})}
					</p>
					<a className="text-primary-9 underline" href={url} target="_blank" rel="noreferrer">
						{t("articles.preview")}
					</a>
					{hasExisting && !imported && (
						<label htmlFor="inpi-replace-articles" className="flex items-center gap-3 text-sm">
							<Checkbox
								id="inpi-replace-articles"
								checked={replaceExisting}
								disabled={pending}
								onCheckedChange={onReplaceChange}
							/>
							{t("articles.replace")}
						</label>
					)}
					{!canImport && <p className="text-neutral-11 text-sm">{t("articles.applyFirst")}</p>}
					<Button
						onClick={() => onImport(article.id)}
						disabled={!canImport || pending || imported || (hasExisting && !replaceExisting)}
					>
						{t(imported ? "articles.imported" : pending ? "articles.importing" : "articles.import")}
					</Button>
				</>
			) : (
				<p className="text-sm">{t("articles.empty")}</p>
			)}
		</section>
	);
}
