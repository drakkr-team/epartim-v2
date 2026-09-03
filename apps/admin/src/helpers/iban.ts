export function humanizeIBAN(iban: string) {
	return iban.replace(/(.{4})/g, "$1 ").trim();
}

export function normalizeIBAN(iban: string) {
	return iban.replaceAll(" ", "").toUpperCase();
}

export function isValidIBAN(value: string) {
	const iban = normalizeIBAN(value);
	if (!/^[A-Z]{2}\d{2}[A-Z0-9]{11,30}$/.test(iban)) {
		return false;
	}

	const rearranged = `${iban.slice(4)}${iban.slice(0, 4)}`;
	let remainder = 0;

	for (const character of rearranged) {
		const digits =
			character >= "A" && character <= "Z"
				? String(character.charCodeAt(0) - "A".charCodeAt(0) + 10)
				: character;

		for (const digit of digits) {
			remainder = (remainder * 10 + Number(digit)) % 97;
		}
	}

	return remainder === 1;
}
