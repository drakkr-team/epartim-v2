import type { TuyauHTTPError } from "@tuyau/core/client";
import type { TFunction } from "i18next";

// biome-ignore lint/suspicious/noExplicitAny: ""
export function convertTuyauErrorToFormErrorMap(error: TuyauHTTPError, t: TFunction<any>) {
	if (error.isValidationError()) {
		// @ts-expect-error: "error.response.errors" is not typed, but we know it exists and is an array of objects with "field", "message", and "rule" properties.
		return error.response.errors.reduce(
			(
				acc: Record<string, { message: string }>,
				message: { field: string; message: string; rule: string },
			) => {
				acc[message.field] = {
					message: t(`validation.${message.field}.${message.rule}`),
				};
				return acc;
			},
			{} as Record<string, { message: string }>,
		);
	}

	return null;
}
