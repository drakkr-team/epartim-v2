import { globSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
import path from "node:path";

import deepmergeJson from "deepmerge-json";

export type MergeOptions = {
	/**
	 * Array of locale codes to merge.
	 * @example ["en", "fr", "de"]
	 */
	readonly locales: readonly string[];
	/**
	 * Glob pattern to match JSON files.
	 * The glob pattern should point to the directory containing locale JSON files do not include the locale code or file name.
	 * @example "src/locales/**"
	 */
	readonly glob: string;
	/**
	 * Directory to output merged JSON files.
	 * @example "dist/locales"
	 */
	readonly outputDir: string;
};

export default function merge(options: MergeOptions) {
	const { locales, glob, outputDir } = options;

	for (const locale of locales) {
		const pattern = path.join(process.cwd(), `${glob}/${locale}.json`);
		const files = globSync(pattern);

		let content = {};

		for (const file of files) {
			try {
				const fileContent = JSON.parse(readFileSync(file, "utf-8"));
				content = deepmergeJson(content, fileContent);
			} catch (error) {
				console.error(error);
			}
		}

		const outputFile = path.join(outputDir, `${locale}.json`);
		mkdirSync(outputDir, { recursive: true });
		writeFileSync(outputFile, JSON.stringify(content, null, 2), "utf-8");
	}
}
