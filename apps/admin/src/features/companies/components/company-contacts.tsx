import { useTranslation } from "react-i18next";

import { Card } from "@workspace/ui-react/components/card";

import { DetailField } from "#/components/app/detail-field";
import type { CompanyDetail } from "#/features/companies/types";

type Contact = CompanyDetail["contacts"][number];

function ContactCard({ contact, title }: { contact: Contact | null; title: string }) {
	const { t } = useTranslation("routes.(protected).companies.$companyId");
	const empty = t("status.notProvided");
	const answer = (value: boolean | null) =>
		value === null ? empty : value ? t("status.yes") : t("status.no");

	return (
		<Card className="grid grid-cols-2 gap-4">
			<h2 className="col-span-2 font-semibold text-lg text-secondary-12">{title}</h2>
			{contact ? (
				<>
					<DetailField label={t("field.contact.id")} value={contact.id.toString()} />
					<DetailField
						label={t("field.contact.kind")}
						value={contact.kind ? t(`contact.kind.${contact.kind}`) : empty}
					/>
					<DetailField
						label={t("field.contact.civility")}
						value={contact.civility ? t(`contact.civility.${contact.civility}`) : empty}
					/>
					<DetailField label={t("field.contact.firstName")} value={contact.firstName ?? empty} />
					<DetailField label={t("field.contact.lastName")} value={contact.lastName ?? empty} />
					<DetailField label={t("field.contact.legalName")} value={contact.legalName ?? empty} />
					<DetailField
						label={t("field.contact.function")}
						value={contact.function ? t(`contact.function.${contact.function}`) : empty}
					/>
					<DetailField label={t("field.contact.email")} value={contact.email ?? empty} />
					<DetailField
						label={t("field.contact.phoneNumber")}
						value={contact.phoneNumber ?? empty}
					/>
					<DetailField
						label={t("field.contact.amundiPortalId")}
						value={contact.amundiPortalId ?? empty}
					/>
					<DetailField
						label={t("field.contact.isSignatoryOnKbis")}
						value={answer(contact.isSignatoryOnKbis)}
					/>
					<DetailField
						label={t("field.contact.isSameAsLegal")}
						value={answer(contact.isSameAsLegal)}
					/>
					<DetailField
						label={t("field.contact.authorizations")}
						value={
							contact.authorizations?.length
								? contact.authorizations
										.map((value) => t(`contact.authorization.${value}`))
										.join(", ")
								: empty
						}
					/>
					<DetailField
						label={t("field.createdAt")}
						value={contact.createdAt.toLocaleDateString("fr-FR")}
					/>
					<DetailField
						label={t("field.updatedAt")}
						value={contact.updatedAt.toLocaleDateString("fr-FR")}
					/>
				</>
			) : (
				<p className="col-span-2 text-neutral-11 text-sm">{empty}</p>
			)}
		</Card>
	);
}

export function CompanyContacts({ company }: { company: CompanyDetail }) {
	const { t } = useTranslation("routes.(protected).companies.$companyId");

	return (
		<>
			<ContactCard title={t("section.legalAgent")} contact={company.legalAgent} />
			<ContactCard title={t("section.signer")} contact={company.signer} />
			<ContactCard title={t("section.correspondent")} contact={company.correspondent} />
			{company.contacts.length ? (
				company.contacts.map((contact, index) => (
					<ContactCard
						key={contact.id}
						title={t("section.contact", { index: index + 1 })}
						contact={contact}
					/>
				))
			) : (
				<Card className="grid gap-4">
					<h2 className="font-semibold text-lg text-secondary-12">{t("section.contacts")}</h2>
					<p className="text-neutral-11 text-sm">{t("status.none")}</p>
				</Card>
			)}
		</>
	);
}
