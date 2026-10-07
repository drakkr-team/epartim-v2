import { useTranslation } from "react-i18next";

import { Button } from "@workspace/ui-react/components/button";
import { Checkbox } from "@workspace/ui-react/components/checkbox";
import { Dialog } from "@workspace/ui-react/components/dialog";

import { InpiArticlesSelection } from "#/features/subscriptions/inpi/components/articles-selection";
import { InpiCompanyFields } from "#/features/subscriptions/inpi/components/company-fields";
import { InpiLegalAgentSelection } from "#/features/subscriptions/inpi/components/legal-agent-selection";
import { InpiPeopleSelection } from "#/features/subscriptions/inpi/components/people-selection";
import { useInpiPrefillForm } from "#/features/subscriptions/inpi/hooks/use-prefill-form";
import type { InpiPreview } from "#/features/subscriptions/inpi/types";

type PrefillDialogProps = {
	preview: InpiPreview;
	subscriptionId: string;
	currentSiren: string | null;
	currentName: string | null;
	hasArticles: boolean;
	onApplied: () => void;
	onClose: () => void;
};

export function InpiPrefillDialog(props: PrefillDialogProps) {
	const { preview, subscriptionId, currentSiren, currentName, hasArticles, onApplied, onClose } =
		props;
	const { t } = useTranslation("features.subscriptions.inpi");
	const {
		fields,
		setFields,
		ownerIds,
		setOwnerIds,
		legalAgentId,
		setLegalAgentId,
		confirmed,
		setConfirmed,
		applied,
		replaceExisting,
		setReplaceExisting,
		imported,
		error,
		pending,
		mutations,
		apply,
		importArticles,
	} = useInpiPrefillForm({ subscriptionId, preview, onApplied });

	return (
		<Dialog
			open
			onOpenChange={(open) => {
				if (!open && !pending) onClose();
			}}
		>
			<Dialog.Content className="max-h-[90dvh] w-[calc(100%-2rem)] max-w-2xl overflow-y-auto p-6 sm:p-8">
				<div className="grid gap-6">
					<div>
						<Dialog.Title className="font-bold text-xl">{t("title")}</Dialog.Title>
						<Dialog.Description className="mt-2 text-neutral-11 text-sm">
							{t("description")}
						</Dialog.Description>
					</div>
					<p className="font-semibold text-sm">
						{preview.fields.find((field) => field.key === "name")?.proposed ?? preview.siren}
						<span className="ml-2 font-normal text-neutral-11">{preview.siren}</span>
					</p>
					{error && (
						<p
							role="alert"
							className="rounded-lg border border-error-7 bg-error-2 p-3 text-error-11 text-sm"
						>
							{error}
						</p>
					)}
					{preview.warnings.length > 0 && (
						<ul className="list-disc space-y-1 pl-5 text-neutral-11 text-sm">
							{preview.warnings.map((warning) => (
								<li key={warning}>
									{t(`warnings.${warning}`, { defaultValue: t("warnings.incomplete") })}
								</li>
							))}
						</ul>
					)}
					<section
						className="overflow-hidden rounded-xl border border-neutral-6"
						aria-labelledby="inpi-step-one-title"
					>
						<h3
							id="inpi-step-one-title"
							className="border-neutral-6 border-b bg-neutral-2 px-4 py-4 font-semibold text-lg sm:px-5"
						>
							{t("steps.companyReferences")}
						</h3>
						<div className="grid gap-6 p-4 sm:p-5">
							<InpiCompanyFields
								preview={preview}
								selected={fields}
								onChange={setFields}
								disabled={pending || applied || imported}
							/>
							<InpiLegalAgentSelection
								people={preview.people}
								selected={legalAgentId}
								onChange={setLegalAgentId}
								disabled={pending || applied || imported}
							/>
							<InpiArticlesSelection
								subscriptionId={subscriptionId}
								preview={preview}
								canImport={applied || preview.siren === currentSiren}
								hasExisting={hasArticles}
								replaceExisting={replaceExisting}
								onReplaceChange={setReplaceExisting}
								onImport={(id) => void importArticles(id)}
								pending={pending}
								imported={imported}
							/>
						</div>
					</section>
					<section
						className="overflow-hidden rounded-xl border border-neutral-6"
						aria-labelledby="inpi-step-two-title"
					>
						<h3
							id="inpi-step-two-title"
							className="border-neutral-6 border-b bg-neutral-2 px-4 py-4 font-semibold text-lg sm:px-5"
						>
							{t("steps.kyc")}
						</h3>
						<div className="p-4 sm:p-5">
							<InpiPeopleSelection
								people={preview.people}
								ownerIds={ownerIds}
								onOwnersChange={setOwnerIds}
								disabled={pending || applied || imported}
							/>
						</div>
					</section>
					{preview.companyChangeRequired && !applied && (
						<div className="grid gap-3 rounded-lg border border-neutral-7 bg-neutral-2 p-4">
							<p className="font-semibold">{t("change.title")}</p>
							<p className="text-sm">
								{t("change.companies", {
									previous: currentName ?? currentSiren ?? t("empty"),
									next:
										preview.fields.find((field) => field.key === "name")?.proposed ?? preview.siren,
								})}
							</p>
							<p className="text-sm">{t("change.description")}</p>
							<label htmlFor="inpi-confirm-change" className="flex items-start gap-3 text-sm">
								<Checkbox
									id="inpi-confirm-change"
									checked={confirmed}
									disabled={pending}
									onCheckedChange={setConfirmed}
								/>
								{t("change.confirm")}
							</label>
						</div>
					)}
					{applied ? (
						<p role="status" className="text-primary-11 text-sm">
							{t("applied")}
						</p>
					) : imported ? (
						<p role="status" className="text-primary-11 text-sm">
							{t("articles.refreshPreview")}
						</p>
					) : (
						<Button
							variant="primary"
							onClick={() => void apply()}
							disabled={pending || (preview.companyChangeRequired && !confirmed)}
						>
							{t(mutations.apply.isPending ? "applying" : "apply")}
						</Button>
					)}
					<div className="flex justify-end">
						<Button onClick={onClose} disabled={pending}>
							{t(applied || imported ? "close" : "cancel")}
						</Button>
					</div>
				</div>
			</Dialog.Content>
		</Dialog>
	);
}
