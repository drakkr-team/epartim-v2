import { unlink } from "node:fs/promises";

export async function deleteLocalFile(filePath: string) {
	await unlink(filePath);
}

export async function deleteLocalFiles(filePaths: string[]) {
	await Promise.all(filePaths.map((filePath) => unlink(filePath)));
}
