import type { TuyauError } from "@tuyau/core/client";

import { type ExternalToast, toast } from "@workspace/ui-react/components/toast";

export function toastifyTuyauError(
	error: TuyauError,
	errorMessages: {
		E_NETWORK: [title: string, data?: ExternalToast];
		E_UNEXPECTED: [title: string, data?: ExternalToast];
		E_VALIDATION?: [title: string, data?: ExternalToast];
	} & Record<string, [title: string, data?: ExternalToast]>,
) {
	const { E_NETWORK, E_UNEXPECTED, E_VALIDATION, ...customErrors } = errorMessages;

	if (error.kind === "network") {
		return toast.error(...E_NETWORK);
	}

	if (error.isValidationError()) {
		return toast.error(...(E_VALIDATION ?? E_UNEXPECTED));
	}

	if (customErrors) {
		const customError = Object.entries(customErrors).find(
			([code]) => error.response?.code === code,
		);

		if (customError) {
			const [, message] = customError;
			return toast.error(...message);
		}
	}

	return toast.error(...E_UNEXPECTED);
}
