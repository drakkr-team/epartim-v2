import { inject } from "@adonisjs/core";

import File from "#models/file";
import FileService, { type FileUrlOptions } from "#services/file.service";

@inject()
export default class FilePresenter {
	constructor(private fileService: FileService) {}

	async toJSON(file: File, options: FileUrlOptions = {}) {
		const url = await this.fileService.getUrl(file, options);

		return {
			id: file.id,

			name: file.name,
			size: file.size,
			type: file.type,
			url,

			createdAt: file.createdAt.toJSDate(),
			updatedAt: file.updatedAt.toJSDate(),
		};
	}
}
