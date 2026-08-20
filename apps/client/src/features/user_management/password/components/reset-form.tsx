import { useTranslation } from "react-i18next";

import {
	type UseResetPasswordFormParams,
	useResetPasswordForm,
} from "#/features/user_management/password/hooks/use-reset-form";

type ResetPasswordFormProps = UseResetPasswordFormParams;

export function ResetPasswordForm(props: ResetPasswordFormProps) {
	const { token, defaultValues } = props;

	const { t } = useTranslation("features.user_management.password.components.reset-form");

	const form = useResetPasswordForm({ token, defaultValues });

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
				<form.SubmitButton variant="primary">{t("action.resetPassword")}</form.SubmitButton>
			</form.AppForm>
		</form>
	);
}
