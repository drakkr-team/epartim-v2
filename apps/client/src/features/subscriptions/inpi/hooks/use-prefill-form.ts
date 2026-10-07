import type { TuyauError } from "@tuyau/core/client";
import { useState } from "react";
import { useTranslation } from "react-i18next";

import { useInpiMutations } from "#/features/subscriptions/inpi/hooks/use-inpi-mutations";
import type { InpiFieldKey, InpiPreview } from "#/features/subscriptions/inpi/types";

type PrefillFormParams = {
	subscriptionId: string;
	preview: InpiPreview;
	onApplied: () => void;
};
export function useInpiPrefillForm({ subscriptionId, preview, onApplied }: PrefillFormParams) {
	const { t } = useTranslation("features.subscriptions.inpi");
	const mutations = useInpiMutations(subscriptionId);
	const [fields, setFields] = useState<InpiFieldKey[]>(() =>
		preview.fields.filter((field) => field.selected).map((field) => field.key),
	);
	const [ownerIds, setOwnerIds] = useState<string[]>(() =>
		preview.people.map((person) => person.id),
	);
	const [legalAgentId, setLegalAgentId] = useState<string | null>(null);
	const [confirmed, setConfirmed] = useState(false);
	const [applied, setApplied] = useState(false);
	const [replaceExisting, setReplaceExisting] = useState(false);
	const [imported, setImported] = useState(false);
	const [error, setError] = useState<string | null>(null);
	const pending = Object.values(mutations).some((mutation) => mutation.isPending);

	function reportFailure(failure: TuyauError) {
		const code = failure.response?.code;
		setError(t(`errors.${code ?? "E_NETWORK"}`, { defaultValue: t("errors.E_UNEXPECTED") }));
	}

	async function apply() {
		setError(null);
		try {
			await mutations.apply.mutateAsync({
				params: { subscriptionId },
				body: {
					previewId: preview.id,
					fields,
					ownerIds,
					legalAgentId,
					confirmCompanyChange: confirmed,
				},
			});
			setApplied(true);
			onApplied();
		} catch (failure) {
			reportFailure(failure as TuyauError);
		}
	}

	async function importArticles(actId: string) {
		setError(null);
		try {
			await mutations.articles.mutateAsync({
				params: { subscriptionId },
				body: { previewId: preview.id, actId, replaceExisting },
			});
			setImported(true);
		} catch (failure) {
			reportFailure(failure as TuyauError);
		}
	}

	return {
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
	};
}
