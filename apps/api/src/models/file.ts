import drive from "@adonisjs/drive/services/main";
import { beforeDelete } from "@adonisjs/lucid/orm";

import { FileSchema } from "#database/schema";

export default class File extends FileSchema {
	@beforeDelete()
	static async deleteFileFromStorage(file: File) {
		const disk = drive.use();

		return await disk.delete(file.key);
	}
}
