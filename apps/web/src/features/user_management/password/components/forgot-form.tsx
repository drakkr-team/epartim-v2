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
			className="grid gap-4 [&_input]:h-10 [&_input]:rounded-xl [&_input]:border-brand-line-strong [&_input]:bg-brand-surface [&_input]:px-3 [&_input]:text-brand-navy [&_label]:font-semibold [&_label]:text-[11px] [&_label]:text-brand-ink-soft [&_label]:uppercase [&_label]:tracking-[0.1em]"
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
				<form.SubmitButton
					className="mt-2 h-10 w-full justify-center rounded-xl bg-brand-gold text-brand-navy hover:not-data-disabled:bg-brand-gold-hover sm:h-10"
					variant="primary"
				>
					{t("action.sendResetEmail")}
				</form.SubmitButton>
			</form.AppForm>
		</form>
	);
}
