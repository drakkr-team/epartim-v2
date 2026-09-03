export function humanizeIBAN(iban: string) {
	return iban.replace(/(.{4})/g, "$1 ").trim();
}
