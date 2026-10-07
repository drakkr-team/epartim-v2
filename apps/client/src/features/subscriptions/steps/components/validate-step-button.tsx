import { useIsMutating, useMutation, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "@tanstack/react-router";
import { useCallback, useEffect, useId, useState } from "react";
import { useTranslation } from "react-i18next";

import { Button } from "@workspace/ui-react/components/button";
import { toast } from "@workspace/ui-react/components/toast";

import { SUPPORTED_SUBSCRIPTION_STEPS } from "#/features/subscriptions/steps/step.constants";
import { useSubscriptionStepValidation } from "#/features/subscriptions/steps/step-validation-context";
import { api } from "#/libs/tuyau";
import { toastifyTuyauError } from "#/utils/tuyau";

type ValidateStepButtonProps = {
	areDocumentsComplete: boolean;
	incompleteMessage?: string;
	isValidated: boolean;
	onValidationAttempt?: () => void;
	step: number;
	subscriptionId: string;
};

function scrollToFirstInvalidElement() {
	requestAnimationFrame(() => {
		document.querySelector<HTMLElement>("[aria-invalid='true']")?.scrollIntoView({
			behavior: "smooth",
			block: "center",
		});
	});
}

export function ValidateStepButton(props: ValidateStepButtonProps) {
	const {
		areDocumentsComplete,
		incompleteMessage,
		isValidated,
		onValidationAttempt,
		step,
		subscriptionId,
	} = props;
	const { t } = useTranslation("features.subscriptions.steps.validate-step-button");
	const { canValidate: areFormsValid, validateForms } = useSubscriptionStepValidation();
	const navigate = useNavigate();
	const queryClient = useQueryClient();
	const [isValidationRequested, setIsValidationRequested] = useState(false);
	const hintId = useId();
	const isSaving =
		useIsMutating({
			predicate: (mutation) =>
				mutation.options.scope?.id.startsWith(`subscription:${subscriptionId}:`) ?? false,
		}) > 0;
	const isReadyToValidate = areDocumentsComplete && areFormsValid;
	let unavailableReason: string | undefined;
	if (!isValidated) {
		if (isSaving) unavailableReason = t("unavailable.saving");
		else if (!areDocumentsComplete) unavailableReason = incompleteMessage;
		else if (!areFormsValid) unavailableReason = t("unavailable.fields");
	}
	const validation = useMutation(
		api.subscriptions.validateStep.mutationOptions({
			onSuccess: async () => {
				await Promise.all([
					queryClient.invalidateQueries({ queryKey: api.subscriptions.view.pathKey() }),
					queryClient.invalidateQueries({ queryKey: api.subscriptions.list.pathKey() }),
				]);
				toast.success(t("success.title"), { description: t("success.description") });

				const nextStep = step + 1;
				if (!SUPPORTED_SUBSCRIPTION_STEPS.some((supportedStep) => supportedStep === nextStep))
					return;

				await navigate({
					to: "/subscriptions/$id/steps/$step",
					params: { id: subscriptionId, step: String(nextStep) },
				});
			},
			onError: (error) => {
				scrollToFirstInvalidElement();
				toastifyTuyauError(error, {
					E_NETWORK: [t("error.network.title"), { description: t("error.network.description") }],
					E_VALIDATION: [
						t("error.validation.title"),
						{ description: t("error.validation.description") },
					],
					E_UNEXPECTED: [
						t("error.unexpected.title"),
						{ description: t("error.unexpected.description") },
					],
				});
			},
		}),
	);

	const validateStep = useCallback(async () => {
		const areFormsValid = await validateForms();
		if (!areFormsValid) {
			scrollToFirstInvalidElement();
			return;
		}

		validation.mutate({ params: { step: String(step), subscriptionId } });
	}, [step, subscriptionId, validateForms, validation]);

	useEffect(() => {
		if (!isValidationRequested || isSaving) return;

		setIsValidationRequested(false);
		void validateStep();
	}, [isSaving, isValidationRequested, validateStep]);

	return (
		<div className="grid max-w-64 justify-items-start gap-2">
			<Button
				type="button"
				variant={isValidated ? "secondary" : "primary"}
				disabled={isValidated || !isReadyToValidate || isSaving || validation.isPending}
				aria-describedby={unavailableReason ? hintId : undefined}
				onClick={() => {
					onValidationAttempt?.();
					setIsValidationRequested(true);
				}}
			>
				{t(isValidated ? "action.validated" : "action.validate")}
			</Button>
			<p id={hintId} role="status" className="text-neutral-11 text-xs empty:hidden">
				{unavailableReason}
			</p>
		</div>
	);
}
