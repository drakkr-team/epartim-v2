import { useMutation } from "@tanstack/react-query";
import { useNavigate } from "@tanstack/react-router";
import { useState } from "react";

import { Button } from "@workspace/ui-react/components/button";
import { Field } from "@workspace/ui-react/components/field";
import { PasswordInput } from "@workspace/ui-react/components/password-input";

import { api } from "#/libs/tuyau";

export function LoginForm() {
	const navigate = useNavigate();
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");

	const {
		mutate: login,
		isPending,
		isError,
	} = useMutation(
		api.admin.authentication.login.mutationOptions({
			onSuccess: () => navigate({ to: "/" }),
		}),
	);

	return (
		<form
			className="grid gap-4 [&_input]:h-10 [&_input]:rounded-xl [&_input]:border [&_input]:border-brand-line-strong [&_input]:bg-brand-surface [&_input]:px-3 [&_input]:text-brand-navy [&_label]:font-semibold [&_label]:text-[11px] [&_label]:text-brand-ink-soft [&_label]:uppercase [&_label]:tracking-[0.1em]"
			onSubmit={(event) => {
				event.preventDefault();
				login({ body: { uid: email, password } });
			}}
		>
			<Field className="flex flex-col gap-1" name="email">
				<Field.Label htmlFor="email">Adresse e-mail</Field.Label>
				<input
					autoComplete="username"
					id="email"
					name="email"
					type="email"
					value={email}
					onChange={(event) => setEmail(event.target.value)}
					required
				/>
			</Field>

			<Field className="flex flex-col gap-1" name="password">
				<Field.Label htmlFor="password">Mot de passe</Field.Label>
				<PasswordInput
					autoComplete="current-password"
					id="password"
					name="password"
					value={password}
					onChange={(event) => setPassword(event.target.value)}
					required
				/>
			</Field>

			{isError ? (
				<p className="text-destructive-11 text-sm" role="alert">
					Identifiants invalides ou accès non autorisé.
				</p>
			) : null}

			<Button
				className="mt-2 h-10 w-full justify-center rounded-xl bg-brand-gold text-brand-navy hover:not-data-disabled:bg-brand-gold-hover"
				disabled={isPending}
				type="submit"
				variant="primary"
			>
				{isPending ? "Connexion…" : "Se connecter"}
			</Button>
		</form>
	);
}
