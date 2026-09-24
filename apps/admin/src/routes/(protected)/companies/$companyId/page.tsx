import { useSuspenseQuery } from "@tanstack/react-query";
import { createFileRoute, notFound } from "@tanstack/react-router";
import { TuyauError } from "@tuyau/core/client";
import { useTranslation } from "react-i18next";

import { CompanyContacts } from "#/features/companies/components/company-contacts";
import { CompanyDocuments } from "#/features/companies/components/company-documents";
import { CompanyKyc } from "#/features/companies/components/company-kyc";
import { CompanyLegalAgentCard } from "#/features/companies/components/legal-agent-card.tsx";
import { CompanyOverviewCard } from "#/features/companies/components/overview-card.tsx";
import { api } from "#/libs/tuyau";

export const Route = createFileRoute("/(protected)/companies/$companyId/")({
	loader: async ({ context, params }) => {
		await context.queryClient.query(
			api.companies.view.queryOptions(
				{ params: { companyId: params.companyId } },
				{ staleTime: "static" },
			),
		);
	},
	onError: (error) => {
		if (error instanceof TuyauError && error.isStatus(404)) {
			throw notFound();
		}
	},
	component: Page,
});

function Page() {
	const { t } = useTranslation("routes.(protected).companies.$companyId");
	const { companyId } = Route.useParams();

	const { data: company } = useSuspenseQuery(
		api.companies.view.queryOptions({ params: { companyId } }),
	);

	return (
		<main className="mx-auto grid max-w-2xl gap-9">
			<header className="grid gap-1">
				<h2 className="font-bold text-primary-9 text-xs uppercase tracking-widest">
					{t("headline")}
				</h2>
				<h1 className="font-bold text-3xl text-secondary-12">
					{company.name ?? t("status.notProvided")}
				</h1>
				<p className="text-neutral-11 text-sm">{t("description")}</p>
			</header>

			<CompanyOverviewCard company={company} />

			<CompanyLegalAgentCard legalAgent={company.legalAgent} />

			<CompanyContacts company={company} />
			<CompanyKyc profile={company.kycProfile} />
			<CompanyDocuments company={company} />
		</main>
	);
}
