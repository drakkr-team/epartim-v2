import { TuyauError } from "@tuyau/core/client";

import { useLoginMutation } from "#/features/account_management/authentication/hooks/use-login-mutation";
import { useAppForm } from "#/libs/form";

export type UseLoginFormParams = {
	redirectTo?: string;
	defaultValues?: {
		uid?: string;
		password?: string;
	};
};

export function useLoginForm(params?: UseLoginFormParams) {
	const { redirectTo, defaultValues } = params ?? {};

	const { mutateAsync: login } = useLoginMutation({ redirectTo });

	return useAppForm({
		defaultValues: {
			uid: "",
			password: "",
			...defaultValues,
		},
		onSubmit: async ({ value }) => {
			try {
				await login({ body: value });
			} catch (error) {
				if (!(error instanceof TuyauError)) throw error;
			}
		},
	});
}
