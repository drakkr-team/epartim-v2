import { Link as RouterLink } from "@tanstack/react-router";
import { useTranslation } from "react-i18next";

import { Field } from "@workspace/ui-react/components/field";
import { Link } from "@workspace/ui-react/components/link";
import { PasswordInput } from "@workspace/ui-react/components/password-input";

import {
	type UseLoginFormParams,
	useLoginForm,
} from "#/features/account_management/authentication/hooks/use-login-form";

type LoginFormProps = UseLoginFormParams;

export function LoginForm(props: LoginFormProps) {
	const { redirectTo, defaultValues } = props;

	const { t } = useTranslation("features.account_management.authentication.components.login-form");

	const form = useLoginForm({ defaultValues, redirectTo });

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
			<form.AppField name="uid">
				{(field) => (
					<field.TextField label={t("field.email.label")} inputProps={{ type: "email" }} />
				)}
			</form.AppField>

			<form.AppField name="password">
				{(field) => {
					const isInvalid = field.state.meta.isTouched && !field.state.meta.isValid;

					return (
						<Field name={field.name} invalid={isInvalid} className="flex flex-col gap-1">
							<div className="flex items-end justify-between">
								<Field.Label htmlFor={field.name}>{t("field.password.label")}</Field.Label>
								<Link
									className="text-primary-11 text-xs"
									render={<RouterLink to="/forgot-password" />}
								>
									{t("action.forgotPassword")}
								</Link>
							</div>
							<PasswordInput
								id={field.name}
								name={field.name}
								value={field.state.value}
								showPasswordLabel={t("action.showPassword")}
								hidePasswordLabel={t("action.hidePassword")}
								aria-invalid={isInvalid}
								onChange={(e) => field.handleChange(e.target.value)}
								onBlur={field.handleBlur}
							/>
						</Field>
					);
				}}
			</form.AppField>

			<form.AppForm>
				<form.SubmitButton
					className="mt-2 text-secondary-12 active:not-data-disabled:bg-primary-10!"
					variant="primary"
				>
					{t("action.login")}
				</form.SubmitButton>
			</form.AppForm>
		</form>
	);
}
