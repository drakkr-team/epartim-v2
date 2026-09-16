import { useIsMutating, useMutation, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "@tanstack/react-router";
import { useCallback, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";

import { Button } from "@workspace/ui-react/components/button";
import { toast } from "@workspace/ui-react/components/toast";

import { useSubscriptionStepValidation } from "#/features/subscriptions/steps/step-validation-context";
import { api } from "#/libs/tuyau";
import { toastifyTuyauError } from "#/utils/tuyau";

type ValidateStepButtonProps = {
	areDocumentsComplete: boolean;
	isValidated: boolean;
	nextStep: number;
	onValidationAttempt: () => void;
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
	const { areDocumentsComplete, isValidated, nextStep, onValidationAttempt, step, subscriptionId } =
		props;
	const { t } = useTranslation("features.subscriptions.steps.validate-step-button");
	const { canValidate: areFormsValid, validateForms } = useSubscriptionStepValidation();
	const navigate = useNavigate();
	const queryClient = useQueryClient();
	const [isValidationRequested, setIsValidationRequested] = useState(false);
	const isSaving =
		useIsMutating({
			predicate: (mutation) =>
				mutation.options.scope?.id.startsWith(`subscription:${subscriptionId}:`) ?? false,
		}) > 0;
	const isReadyToValidate = areDocumentsComplete && areFormsValid;
	const validation = useMutation(
		api.subscriptions.validateStep.mutationOptions({
			onSuccess: async () => {
				await queryClient.invalidateQueries({ queryKey: api.subscriptions.view.pathKey() });
				toast.success(t("success.title"), { description: t("success.description") });
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
		<Button
			type="button"
			variant={isValidated ? "secondary" : "primary"}
			disabled={!isReadyToValidate || isSaving || validation.isPending}
			onClick={() => {
				onValidationAttempt();
				setIsValidationRequested(true);
			}}
		>
			{t(isValidated ? "action.validated" : "action.validate")}
		</Button>
	);
}
