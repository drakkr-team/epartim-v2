import { Client, FTPError } from "basic-ftp";

import FtpException from "#exceptions/ftp.exception";
import env from "#start/env";

export default async function ftp<T>(transaction: (client: Client) => Promise<T>) {
	const client = new Client();

	try {
		await client.access({
			host: env.get("FTP_HOST"),
			user: env.get("FTP_USER"),
			password: env.get("FTP_PASSWORD"),
			secure: true,
		});

		return await transaction(client);
	} catch (error) {
		if (error instanceof FTPError) {
			throw new FtpException(error.message);
		}

		throw error;
	} finally {
		client.close();
	}
}
