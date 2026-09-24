import type { TuyauHTTPError } from "@tuyau/core/client";
import type { TFunction } from "i18next";

export function focusFirstInvalidInput() {
	const invalidInput = document.querySelector<HTMLInputElement>('[aria-invalid="true"]');
	invalidInput?.focus();
}

export function getDirtyValues<T extends Record<string, unknown>>(
	defaultValue: T,
	currentValue: T,
): Partial<T> {
	const UNCHANGED = Symbol("unchanged");

	const isFormValues = (value: unknown): value is Readonly<Record<string, unknown>> => {
		if (typeof value !== "object" || value === null || Array.isArray(value)) {
			return false;
		}

		const prototype = Object.getPrototypeOf(value);
		return prototype === Object.prototype || prototype === null;
	};

	const diffValue = (
		defaultFieldValue: unknown,
		currentFieldValue: unknown,
	): unknown | typeof UNCHANGED => {
		if (Object.is(defaultFieldValue, currentFieldValue)) {
			return UNCHANGED;
		}

		if (Array.isArray(defaultFieldValue) && Array.isArray(currentFieldValue)) {
			const arraysMatch =
				defaultFieldValue.length === currentFieldValue.length &&
				currentFieldValue.every(
					(value, index) => diffValue(defaultFieldValue[index], value) === UNCHANGED,
				);

			return arraysMatch ? UNCHANGED : currentFieldValue;
		}

		if (isFormValues(defaultFieldValue) && isFormValues(currentFieldValue)) {
			const changedFields: Record<string, unknown> = {};

			for (const [key, value] of Object.entries(currentFieldValue)) {
				const difference = diffValue(defaultFieldValue[key], value);

				if (difference !== UNCHANGED) {
					changedFields[key] = difference;
				}
			}

			return Object.keys(changedFields).length === 0 ? UNCHANGED : changedFields;
		}

		return currentFieldValue;
	};

	const changedValues: Partial<T> = {};

	for (const [key, currentFieldValue] of Object.entries(currentValue)) {
		const difference = diffValue(defaultValue[key], currentFieldValue);

		if (difference !== UNCHANGED) {
			Reflect.set(changedValues, key, difference);
		}
	}

	return changedValues;
}

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
