import { useTranslation } from "react-i18next";

import {
	type UseActivateFormParams,
	useActivateForm,
} from "#/features/account_management/onboarding/hooks/use-activate-form.ts";

type ActivateFormProps = UseActivateFormParams;

export function ActivateForm(props: ActivateFormProps) {
	const { token, defaultValues } = props;

	const { t } = useTranslation("features.account_management.onboarding.components.activate-form");

	const form = useActivateForm({ token, defaultValues });

	return (
		<form
			className="grid gap-4"
			onSubmit={(e) => {
				e.preventDefault();
				e.stopPropagation();
				form.handleSubmit();
			}}
			noValidate
		>
			<form.AppField name="newPassword">
				{(field) => (
					<field.PasswordField
						label={t("field.newPassword.label")}
						inputProps={{ autoComplete: "new-password" }}
					/>
				)}
			</form.AppField>

			<form.AppField name="newPasswordConfirmation">
				{(field) => (
					<field.PasswordField
						label={t("field.newPasswordConfirmation.label")}
						inputProps={{ autoComplete: "new-password" }}
					/>
				)}
			</form.AppField>

			<form.AppForm>
				<form.SubmitButton className="mt-2" variant="primary">
					{t("action.resetPassword")}
				</form.SubmitButton>
			</form.AppForm>
		</form>
	);
}
