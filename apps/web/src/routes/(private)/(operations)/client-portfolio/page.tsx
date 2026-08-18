import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useTranslation } from "react-i18next";

import { Button } from "@workspace/ui-react/components/button";
import { DownloadIcon, PlusIcon } from "@workspace/ui-react/icons";

import { PageHeader } from "#/components/app/page-header";
import type { BreadcrumbStaticData } from "#/libs/breadcrumb";

export const Route = createFileRoute("/(private)/(operations)/client-portfolio/")({
	staticData: {
		breadcrumb: { labelKey: "client-portfolio", to: "/client-portfolio" },
	} satisfies BreadcrumbStaticData,
	component: ClientPortfolioPage,
});

function ClientPortfolioPage() {
	const { t: tRoute } = useTranslation("routes.(private)");
	const { t } = useTranslation("routes.(private).(operations).client-portfolio");
	const navigate = useNavigate();

	return (
		<PageHeader
			actions={
				<>
					<Button className="border-brand-line-strong bg-brand-surface text-brand-navy hover:border-brand-line-strong hover:bg-brand-surface">
						<DownloadIcon />
						{t("action.export")}
					</Button>
					<Button
						className="bg-brand-gold text-brand-navy hover:bg-brand-gold-hover"
						onClick={() =>
							navigate({
								to: "/souscription/$id",
								params: { id: crypto.randomUUID() },
							})
						}
					>
						<PlusIcon />
						{t("action.new-subscription")}
					</Button>
				</>
			}
			description={t("description")}
			section={tRoute("operations")}
			title={tRoute("client-portfolio")}
		/>
	);
}
