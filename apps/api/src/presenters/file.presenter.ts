import { inject } from "@adonisjs/core";

import File from "#models/file";
import FileService from "#services/file.service";

@inject()
export default class FilePresenter {
	constructor(private fileService: FileService) {}

	async toJSON(file: File) {
		return {
			id: file.id,

			name: file.name,
			size: file.size,
			type: file.type,
			url: await this.fileService.getUrl(file),

			createdAt: file.createdAt.toJSDate(),
			updatedAt: file.updatedAt.toJSDate(),
		};
	}
}
