import { inject } from "@adonisjs/core";

import File from "#models/file";
import FileService from "#services/file.service";

type FilePresenterOptions = {
	access?: "download" | "view";
};

@inject()
export default class FilePresenter {
	constructor(private fileService: FileService) {}

	async toJSON(file: File, options: FilePresenterOptions = {}) {
		const url =
			options.access === "download"
				? await this.fileService.download(file)
				: await this.fileService.getUrl(file);

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
