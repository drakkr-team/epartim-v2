import { useTranslation } from "react-i18next";

import { Button } from "@workspace/ui-react/components/button";
import { PlusIcon } from "@workspace/ui-react/icons";

import { BeneficialOwnerCard } from "#/features/subscriptions/kyc/components/beneficial-owner-card";
import type { useKycOwnersForm } from "#/features/subscriptions/kyc/hooks/use-kyc-owners-form";

const namespace = "features.subscriptions.kyc";

type BeneficialOwnersSectionProps = {
	createKycOwner: ReturnType<typeof useKycOwnersForm>["createKycOwner"];
	deleteKycOwner: ReturnType<typeof useKycOwnersForm>["deleteKycOwner"];
	form: ReturnType<typeof useKycOwnersForm>["form"];
};

export function BeneficialOwnersSection(props: BeneficialOwnersSectionProps) {
	const { createKycOwner, deleteKycOwner, form } = props;
	const { t } = useTranslation(namespace);

	return (
		<section
			aria-labelledby="owners-heading"
			className="mt-6 grid gap-5 border-neutral-4 border-t pt-6"
		>
			<div>
				<p className="font-bold text-primary-9 text-xs uppercase tracking-widest">
					{t("owners.eyebrow")}
				</p>
				<h2 id="owners-heading" className="mt-2 font-bold text-secondary-12 text-xl">
					{t("owners.title")}
				</h2>
				<p className="mt-2 text-neutral-11 text-sm">{t("owners.description")}</p>
			</div>
			<div className="rounded-md border border-warning-6 bg-warning-2 p-4 text-sm text-warning-11">
				{t("owners.warning")}
			</div>
			<form.Subscribe selector={(state) => state.values.owners}>
				{(owners) => {
					const total = owners.reduce((sum, owner) => sum + (owner.shareholdingPercentage ?? 0), 0);

					return (
						<>
							{owners.length === 0 ? (
								<p className="rounded-md border border-neutral-5 border-dashed py-8 text-center text-neutral-10">
									{t("owners.empty")}
								</p>
							) : (
								<div className="grid gap-4">
									{owners.map((owner, index) => (
										<BeneficialOwnerCard
											key={owner.id}
											form={form}
											index={index}
											onRemove={() => deleteKycOwner(owner.id)}
											owner={owner}
										/>
									))}
								</div>
							)}
							<div className="flex flex-wrap items-center justify-between gap-4">
								<p className="font-medium text-secondary-12">
									{t("owners.total", {
										total: new Intl.NumberFormat("fr-FR", { maximumFractionDigits: 2 }).format(
											total,
										),
									})}
								</p>
								<Button type="button" className="rounded-full" onClick={createKycOwner}>
									<PlusIcon />
									{t("owners.add")}
								</Button>
							</div>
						</>
					);
				}}
			</form.Subscribe>
		</section>
	);
}
