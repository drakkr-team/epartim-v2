import { globSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
import path from "node:path";

import merge from "deepmerge-json";

const AVAILABLE_LOCALES = ["fr"];

function main() {
	for (const locale of AVAILABLE_LOCALES) {
		console.time(` \x1b[32m✓\x1b[0m Compiled ${locale} locales in `);

		const pattern = path.join(process.cwd(), `**/locales/**/${locale}.json`);
		const files = globSync(pattern);

		let translations = {};

		for (const file of files) {
			try {
				const fileTranslations = JSON.parse(readFileSync(file, "utf-8") ?? "{}");

				translations = merge(translations, fileTranslations);
			} catch (_error) {
				console.error(
					` \x1b[31m✗\x1b[0m Failed to compile ${locale} locales in ${path.relative(process.cwd(), file)}`,
				);
				process.exit(1);
			}
		}

		mkdirSync(path.join(process.cwd(), `src/libs/i18n/build`), { recursive: true });
		writeFileSync(
			path.join(process.cwd(), `src/libs/i18n/build/${locale}.json`),
			JSON.stringify(translations, null, 2),
		);

		console.timeEnd(` \x1b[32m✓\x1b[0m Compiled ${locale} locales in `);
	}
}

main();
