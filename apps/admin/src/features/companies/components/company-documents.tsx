import { useTranslation } from "react-i18next";

import { Card } from "@workspace/ui-react/components/card";

import { DetailField } from "#/components/app/detail-field";
import type { CompanyDetail } from "#/features/companies/types";

const documents = [
	"bankDetailsDocument",
	"legalAgentIdDocument",
	"companyDetailsDocument",
	"contactsStatusDocument",
] as const;

export function CompanyDocuments({ company }: { company: CompanyDetail }) {
	const { t } = useTranslation("routes.(protected).companies.$companyId");

	return (
		<Card className="grid gap-5">
			<h2 className="font-semibold text-lg text-secondary-12">{t("section.documents")}</h2>
			{documents.map((key) => {
				const file = company[key];

				return (
					<section key={key} className="grid grid-cols-2 gap-4 border-neutral-6 border-t pt-4">
						<h3 className="col-span-2 font-medium text-neutral-12">{t(`document.${key}`)}</h3>
						{file ? (
							<>
								<DetailField
									label={t("field.file.name")}
									value={
										<a
											href={file.url}
											target="_blank"
											rel="noopener noreferrer"
											className="text-primary-11 underline"
										>
											{file.name}
										</a>
									}
								/>
								<DetailField label={t("field.file.type")} value={file.type} />
								<DetailField
									label={t("field.file.size")}
									value={t("field.file.sizeValue", { size: file.size })}
								/>
								<DetailField
									label={t("field.file.createdAt")}
									value={file.createdAt.toLocaleDateString("fr-FR")}
								/>
								<DetailField
									label={t("field.file.updatedAt")}
									value={file.updatedAt.toLocaleDateString("fr-FR")}
								/>
							</>
						) : (
							<p className="col-span-2 text-neutral-11 text-sm">{t("status.notProvided")}</p>
						)}
					</section>
				);
			})}
		</Card>
	);
}
