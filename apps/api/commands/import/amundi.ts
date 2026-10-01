import { mkdir, readFile, unlink } from "node:fs/promises";
import { promisify } from "node:util";

import { BaseCommand } from "@adonisjs/core/ace";
import type { CommandOptions } from "@adonisjs/core/types/ace";
import { parse } from "csv/sync";
import { unzip } from "fflate";
import { DateTime } from "luxon";

import ftp from "#libs/ftp";

const TMP_DIR = "tmp/import/amundi";

type PosaRow = {
	CD_ENT: string;
	CD_DISPO: string;
	TYPE_DISPO: string;
	CD_FOUNDS: string;
	ISIN_FCPE: string;
	DT_VAL: DateTime;
	COURS: number;
	"SUN(NB_PARTS_DISPO)": number;
	"SUM(NB_PARTS_INDISPO)": number;
};

export default class ImportAmundi extends BaseCommand {
	static commandName = "import:amundi";
	static description = "Import data from Amundi";

	static options: CommandOptions = {
		startApp: true,
	};

	async run() {
		const filesPath = await ftp(async (client) => {
			const filesPath: string[] = [];

			await client.cd("amundi_daily_feed/archives");
			const files = await client.list();

			// FTP action cant be performed concurrently due to potential connection issues, hence using a for loop
			for (const [index, file] of files.entries()) {
				if (index > 1) continue;

				const tmpFilePath = `${TMP_DIR}/${file.name}`;

				await mkdir(this.app.makePath(TMP_DIR), { recursive: true });
				await client.downloadTo(tmpFilePath, file.name);

				filesPath.push(tmpFilePath);
			}

			return filesPath;
		});

		const extractedPathsPromises = filesPath.map(async (filePath) => {
			const archivebuffer = await readFile(filePath);
			const archiveContents = await promisify(unzip)(archivebuffer);

			const entries = Object.entries(archiveContents).map(([fileName, buffer]) => {
				if (fileName.startsWith("GOEE_POSA1") && fileName.endsWith(".csv")) {
					const content = parse<PosaRow>(buffer, {
						columns: true,
						delimiter: "|",
						skip_empty_lines: true,
						cast: (value, context) => {
							if (
								["COURS", "SUM(NB_PARTS_DISPO)", "SUM(NB_PARTS_INDISPO)"].includes(
									context.column.toString(),
								)
							) {
								return parseFloat(value);
							}

							if (context.column === "DT_VAL") {
								return DateTime.fromFormat(value, "dd/MM/yyyy");
							}

							return value;
						},
					});
					console.log(content);
				}

				return null;
			});

			return entries;
		});

		// const removeArchives = filesPath.map(async (filePath) => {
		// 	await unlink(filePath);
		// });

		await Promise.all(extractedPathsPromises);
		// await Promise.all(removeArchives);
	}
}
