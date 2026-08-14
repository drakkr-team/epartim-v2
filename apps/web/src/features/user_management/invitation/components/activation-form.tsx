import { useTranslation } from "react-i18next";

import { useActivationForm } from "#/features/user_management/invitation/hooks/use-activation-form";

export function ActivationForm({ token }: { token: string }) {
	const { t } = useTranslation("features.user_management.invitation.components.activation-form");
	const form = useActivationForm(token);

	return (
		<form
			className="grid gap-4"
			onSubmit={(event) => {
				event.preventDefault();
				event.stopPropagation();
				form.handleSubmit();
			}}
			noValidate
		>
			<form.AppField name="password">
				{(field) => (
					<field.PasswordField
						label={t("field.password.label")}
						inputProps={{ autoComplete: "new-password" }}
					/>
				)}
			</form.AppField>

			<form.AppField name="passwordConfirmation">
				{(field) => (
					<field.PasswordField
						label={t("field.passwordConfirmation.label")}
						inputProps={{ autoComplete: "new-password" }}
					/>
				)}
			</form.AppField>

			<form.AppForm>
				<form.SubmitButton variant="primary">{t("action.activate")}</form.SubmitButton>
			</form.AppForm>
		</form>
	);
}
