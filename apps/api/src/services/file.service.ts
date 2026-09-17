import { MultipartFile } from "@adonisjs/core/bodyparser";
import stringHelper from "@adonisjs/core/helpers/string";
import drive from "@adonisjs/drive/services/main";

import File from "#models/file";

export type FileUrlOptions = {
	disposition?: "attachment" | "inline";
};

export default class FileService {
	async getUrl(file: File, options: FileUrlOptions = {}) {
		const { disposition = "inline" } = options;
		const disk = drive.use();

		if (disposition === "inline" && (await disk.getVisibility(file.key)) === "public") {
			return disk.getUrl(file.key);
		}

		return disk.getSignedUrl(file.key, {
			expiresIn: "1h",
			...(disposition === "attachment"
				? { contentDisposition: `attachment; filename*=UTF-8''${encodeURIComponent(file.name)}` }
				: {}),
		});
	}

	async upload(params: { file: MultipartFile; path?: string }) {
		const { file, path } = params;

		const extension = file.extname?.replace(/[^a-z0-9]/gi, "").toLowerCase();
		const fileName = extension ? `${stringHelper.uuid()}.${extension}` : stringHelper.uuid();
		const key = path ? `${path}/${fileName}` : fileName;
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
