import { mkdir, readFile } from "node:fs/promises";
import { promisify } from "node:util";

import { inject } from "@adonisjs/core";
import app from "@adonisjs/core/services/app";
import { unzip } from "fflate";

import ftp from "#libs/ftp";
import AdmundiDailyFeedPosaService from "#services/amundi/daily_feed/posa.service";
import { deleteLocalFiles } from "#utils/local_file";

const FTP_DAILY_FEED_ARCHIVES_PATH = "amundi_daily_feed/archives";
const TMP_ARCHIVES_LOCAL_DIR = "tmp/import/amundi/daily_feed";

@inject()
export default class AmundiDailyFeedService {
	constructor(protected posaService: AdmundiDailyFeedPosaService) {}

	async import() {
		const archivesFilesLocalPaths = await this.#downloadArchives();
		const extractedEntiesPromises = archivesFilesLocalPaths.map((archiveLocalPath) =>
			this.#extractArchive(archiveLocalPath),
		);
		const extractedEntries = (await Promise.all(extractedEntiesPromises)).flat();

		await Promise.all(
			extractedEntries.map(async ([fileName, buffer]) => {
				if (!fileName.endsWith(".csv")) return;

				if (fileName.startsWith("GOEE_POSA")) {
					await this.posaService.import(buffer);
				}

				// Handle other types of CSV files if needed
			}),
		);

		await deleteLocalFiles(archivesFilesLocalPaths);
	}

	async #downloadArchives() {
		return await ftp(async (client) => {
			const archivesFilesLocalPaths: string[] = [];

			await client.cd(FTP_DAILY_FEED_ARCHIVES_PATH);
			const ftpFiles = await client.list();

			// FTP action cant be performed concurrently due to potential connection issues, hence using a for loop
			for (const [index, ftpFile] of ftpFiles.entries()) {
				if (index > 1) continue; // To Check in DB if ftpFile has already been processed

				const archiveLocalPath = `${TMP_ARCHIVES_LOCAL_DIR}/${ftpFile.name}`;

				await mkdir(app.makePath(TMP_ARCHIVES_LOCAL_DIR), { recursive: true });
				await client.downloadTo(archiveLocalPath, ftpFile.name);

				archivesFilesLocalPaths.push(archiveLocalPath);
			}

			return archivesFilesLocalPaths;
		});
	}

	async #extractArchive(archiveLocalPath: string) {
		const archiveBuffer = await readFile(archiveLocalPath);
		const archiveContents = await promisify(unzip)(archiveBuffer);

		return Object.entries(archiveContents);
	}
}
