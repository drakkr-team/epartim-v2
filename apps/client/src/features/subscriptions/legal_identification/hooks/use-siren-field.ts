import { useMutation, useQueryClient } from "@tanstack/react-query";
import type { TuyauError } from "@tuyau/core/client";
import { useRef, useState } from "react";
import { useTranslation } from "react-i18next";

import type { InpiPreview } from "#/features/subscriptions/inpi/types";
import { useSubscriptionStepValidation } from "#/features/subscriptions/steps/step-validation-context";
import { useFieldContext } from "#/libs/form";
import { api } from "#/libs/tuyau";

type SirenFieldParams = {
	subscriptionId: string;
	currentSiren: string | null;
	onPreview: (preview: InpiPreview) => void;
	onCompanyChange: () => void;
};

export function useSirenField({
	subscriptionId,
	currentSiren,
	onPreview,
	onCompanyChange,
}: SirenFieldParams) {
	const field = useFieldContext<string>();
	const { t } = useTranslation("features.subscriptions.inpi");
	const queryClient = useQueryClient();
	const { hasUnsavedChanges } = useSubscriptionStepValidation();
	const busy = useRef(false);
	const [pending, setPending] = useState(false);
	const [error, setError] = useState<string | null>(null);
	const [companyChange, setCompanyChange] = useState<string | null>(null);
	const preview = useMutation(
		api.subscriptions.inpi.preview.mutationOptions({
			scope: { id: `subscription:${subscriptionId}:inpi` },
		}),
	);
	const update = useMutation(
		api.subscriptions.updateLegalIdentification.mutationOptions({
			scope: { id: `subscription:${subscriptionId}:legal-identification` },
			onSuccess: () =>
				queryClient.invalidateQueries({ queryKey: api.subscriptions.view.pathKey() }),
		}),
	);

	function setBusy(value: boolean) {
		busy.current = value;
		setPending(value);
	}

	function reportFailure(failure: unknown) {
		const code = (failure as TuyauError).response?.code;
		setError(t(`errors.${code ?? "E_NETWORK"}`, { defaultValue: t("errors.E_UNEXPECTED") }));
	}

	async function waitForPendingChanges() {
		const filters = {
			predicate: (mutation: { options: { scope?: { id: string } } }) =>
				mutation.options.scope?.id.startsWith(`subscription:${subscriptionId}:`) ?? false,
		};
		if (!queryClient.isMutating(filters)) return;
		await new Promise<void>((resolve) => {
			const unsubscribe = queryClient.getMutationCache().subscribe(() => {
				if (queryClient.isMutating(filters)) return;
				unsubscribe();
				resolve();
			});
		});
	}

	function checkOtherFieldsSaved() {
		if (!hasUnsavedChanges({ form: field.form, field: field.name })) return true;
		setError(t("unsaved"));
		return false;
	}

	function restoreSiren() {
		field.handleChange(currentSiren ?? "");
		field.setMeta((meta) => ({ ...meta, isDirty: false, isTouched: false, errorMap: {} }));
	}

	async function search() {
		field.handleBlur();
		const siren = field.state.value.trim();
		if (busy.current || companyChange || !/^\d{9}$/.test(siren)) return;
		setBusy(true);
		setError(null);
		try {
			await waitForPendingChanges();
			if (!checkOtherFieldsSaved()) return;
			const result = await preview.mutateAsync({
				params: { subscriptionId },
				body: { siren },
			});
			await waitForPendingChanges();
			if (!checkOtherFieldsSaved()) return;
			restoreSiren();
			onPreview(result);
		} catch (failure) {
			reportFailure(failure);
		} finally {
			setBusy(false);
		}
	}

	async function save(confirmCompanyChange = false) {
		const siren = companyChange ?? field.state.value.trim();
		if (busy.current || siren === currentSiren || !/^\d{9}$/.test(siren)) return;
		setBusy(true);
		setError(null);
		try {
			await update.mutateAsync({
				params: { subscriptionId },
				body: { legalIdentification: { siren }, confirmCompanyChange },
			});
			field.setMeta((meta) => ({ ...meta, isDirty: false }));
			setCompanyChange(null);
			if (confirmCompanyChange) onCompanyChange();
		} catch (failure) {
			if ((failure as TuyauError).response?.code === "E_COMPANY_CHANGE_CONFIRMATION_REQUIRED") {
				setCompanyChange(siren);
			} else reportFailure(failure);
		} finally {
			setBusy(false);
		}
	}

	function blur() {
		field.handleBlur();
		if (!companyChange) void save();
	}

	function cancelCompanyChange() {
		restoreSiren();
		setCompanyChange(null);
		setError(null);
	}

	return { field, pending, error, companyChange, search, save, blur, cancelCompanyChange };
}
