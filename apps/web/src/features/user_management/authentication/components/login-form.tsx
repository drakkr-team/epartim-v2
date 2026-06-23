import { Link as RouterLink } from "@tanstack/react-router";
import { useTranslation } from "react-i18next";

import { Field } from "@workspace/ui-react/components/field";
import { Link } from "@workspace/ui-react/components/link";
import { PasswordInput } from "@workspace/ui-react/components/password-input";

import {
	type UseLoginFormParams,
	useLoginForm,
} from "#/features/user_management/authentication/hooks/use-login-form";

type LoginFormProps = UseLoginFormParams;

export function LoginForm(props: LoginFormProps) {
	const { redirectTo, defaultValues } = props;

	const { t } = useTranslation("features.user_management.authentication.components.login-form");

	const form = useLoginForm({ defaultValues, redirectTo });

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
								<Link render={<RouterLink to="/forgot-password" />} className="text-xs">
									{t("action.forgotPassword")}
								</Link>
							</div>
							<PasswordInput
								id={field.name}
								name={field.name}
								value={field.state.value}
								aria-invalid={isInvalid}
								onChange={(e) => field.handleChange(e.target.value)}
								onBlur={field.handleBlur}
							/>
						</Field>
					);
				}}
			</form.AppField>

			<form.AppForm>
				<form.SubmitButton variant="primary">{t("action.login")}</form.SubmitButton>
			</form.AppForm>
		</form>
	);
}
