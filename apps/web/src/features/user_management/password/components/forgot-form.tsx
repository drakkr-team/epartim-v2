import { useTranslation } from "react-i18next";

import {
	type UseForgotPasswordFormParams,
	useForgotPasswordForm,
} from "#/features/user_management/password/hooks/use-forgot-form";

type ForgotPasswordFormProps = UseForgotPasswordFormParams;

export function ForgotPasswordForm(props: ForgotPasswordFormProps) {
	const { defaultValues } = props;

	const { t } = useTranslation("features.user_management.password.components.forgot-form");

	const form = useForgotPasswordForm({ defaultValues });

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
			<form.AppField name="email">
				{(field) => (
					<field.TextField label={t("field.email.label")} inputProps={{ type: "email" }} />
				)}
			</form.AppField>

			<form.AppForm>
				<form.SubmitButton variant="primary">{t("action.sendResetEmail")}</form.SubmitButton>
			</form.AppForm>
		</form>
	);
}
