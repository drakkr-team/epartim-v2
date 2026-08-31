import { useTranslation } from "react-i18next";

import {
	type UseForgotPasswordFormParams,
	useForgotPasswordForm,
} from "#/features/account_management/password/hooks/use-forgot-form";

type ForgotPasswordFormProps = UseForgotPasswordFormParams;

export function ForgotPasswordForm(props: ForgotPasswordFormProps) {
	const { defaultValues } = props;

	const { t } = useTranslation("features.account_management.password.components.forgot-form");

	const form = useForgotPasswordForm({ defaultValues });

	return (
		<form
			onSubmit={(e) => {
				e.preventDefault();
				e.stopPropagation();
				form.handleSubmit();
			}}
			noValidate
			className="grid gap-4"
		>
			<form.AppField name="email">
				{(field) => (
					<field.TextField label={t("field.email.label")} inputProps={{ type: "email" }} />
				)}
			</form.AppField>

			<form.AppForm>
				<form.SubmitButton className="mt-2" variant="primary">
					{t("action.sendResetEmail")}
				</form.SubmitButton>
			</form.AppForm>
		</form>
	);
}
