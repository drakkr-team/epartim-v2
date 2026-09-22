export function focusFirstInvalidInput() {
	const invalidInput = document.querySelector<HTMLInputElement>('[aria-invalid="true"]');
	invalidInput?.focus();
}
