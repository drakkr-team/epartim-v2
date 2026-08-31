import NetworkValidationException from "#exceptions/network_validation.exception";

export interface PaymentDetailsInput {
	iban: string;
	bic: string;
}

export interface NormalizedPaymentDetails {
	iban: string;
	bic: string;
}

export function normalizePaymentDetails(
	paymentDetails: PaymentDetailsInput,
): NormalizedPaymentDetails {
	const iban = paymentDetails.iban.replaceAll(/\s/g, "").toUpperCase();
	const bic = paymentDetails.bic.replaceAll(/\s/g, "").toUpperCase();

	if (!isValidIban(iban)) {
		throw new NetworkValidationException("The IBAN format is invalid.");
	}

	if (!/^[A-Z]{6}[A-Z0-9]{2}(?:[A-Z0-9]{3})?$/.test(bic)) {
		throw new NetworkValidationException("The BIC format is invalid.");
	}

	return { iban, bic };
}

function isValidIban(iban: string) {
	if (!/^[A-Z]{2}\d{2}[A-Z0-9]{11,30}$/.test(iban)) {
		return false;
	}

	const rearranged = `${iban.slice(4)}${iban.slice(0, 4)}`;
	let remainder = 0;

	for (const character of rearranged) {
		const numericValue =
			character >= "A" && character <= "Z" ? String(character.charCodeAt(0) - 55) : character;

		for (const digit of numericValue) {
			remainder = (remainder * 10 + Number(digit)) % 97;
		}
	}

	return remainder === 1;
}
