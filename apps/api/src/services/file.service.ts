import { MultipartFile } from "@adonisjs/core/bodyparser";
import stringHelper from "@adonisjs/core/helpers/string";
import drive from "@adonisjs/drive/services/main";

import File from "#models/file";

export type FileUrlOptions = {
	disposition?: "attachment" | "inline";
};

type FileUploadParams = { path?: string } & (
	| { file: MultipartFile }
	| { buffer: Buffer; name: string; extension: string; contentType: string }
);

export default class FileService {
	async uploadPdf(params: { buffer: Buffer; name: string; path: string }) {
		const key = `${params.path}/${stringHelper.uuid()}.pdf`;
		await drive.use().put(key, params.buffer, { contentType: "application/pdf" });
		try {
			return await File.create({
				key,
				name: params.name,
				size: params.buffer.length,
				type: "application/pdf",
			});
		} catch (error) {
			await drive.use().delete(key);
			throw error;
		}
	}
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

	async upload(params: FileUploadParams) {
		const { path } = params;
		const metadata =
			"file" in params
				? {
						extension: params.file.extname,
						name: params.file.clientName,
						size: params.file.size,
						type:
							params.file.type && params.file.extname
								? `${params.file.type}/${params.file.extname}`
								: null,
					}
				: {
						extension: params.extension,
						name: params.name,
						size: params.buffer.length,
						type: params.contentType,
					};

		const extension = metadata.extension?.replace(/[^a-z0-9]/gi, "").toLowerCase();
		const fileName = extension ? `${stringHelper.uuid()}.${extension}` : stringHelper.uuid();
		const key = path ? `${path}/${fileName}` : fileName;

		if ("file" in params) {
			await params.file.moveToDisk(key, { moveAs: "stream" });
		} else {
			await drive.use().put(key, params.buffer, { contentType: params.contentType });
		}

		try {
			return await File.create({
				key,
				name: metadata.name,
				size: metadata.size,
				type: metadata.type,
			});
		} catch (error) {
			await drive.use().delete(key);
			throw error;
		}
	}
}
