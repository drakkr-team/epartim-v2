import { MultipartFile } from "@adonisjs/core/bodyparser";
import stringHelper from "@adonisjs/core/helpers/string";
import drive from "@adonisjs/drive/services/main";

import File from "#models/file";

export default class FileService {
	async getUrl(file: File) {
		const disk = drive.use();
		const fileVisibility = await disk.getVisibility(file.key);

		if (fileVisibility === "public") {
			return disk.getUrl(file.key);
		}

		return disk.getSignedUrl(file.key, { expiresIn: "1h" });
	}

	async upload(params: { file: MultipartFile; path?: string }) {
		const { file, path } = params;

		const key = path
			? `${path}/${stringHelper.uuid()}-${file.clientName}`
			: `${stringHelper.uuid()}-${file.clientName}`;
		const type = file.type && file.extname ? `${file.type}/${file.extname}` : null;

		await file.moveToDisk(key, {
			moveAs: "stream",
		});
		return await File.create({
			key,
			name: file.clientName,
			size: file.size,
			type: type,
		});
	}
}
