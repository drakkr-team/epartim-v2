import app from "@adonisjs/core/services/app";
import { defineConfig, services } from "@adonisjs/drive";

import env from "#start/env";

const driveConfig = defineConfig({
	default: env.get("DRIVE_DRIVER"),

	services: {
		fs: services.fs({
			location: app.makePath("storage"),
			serveFiles: true,
			routeBasePath: "/uploads",
			visibility: "private",
			appUrl: env.get("APP_URL"),
		}),
		s3: services.s3({
			credentials: {
				accessKeyId: env.get("S3_ACCESS_KEY_ID", ""),
				secretAccessKey: env.get("S3_SECRET_ACCESS_KEY", ""),
			},
			region: env.get("S3_REGION", ""),
			bucket: env.get("S3_BUCKET", ""),
			visibility: "private",
		}),
	},
});

export default driveConfig;

declare module "@adonisjs/drive/types" {
	export interface DriveDisks extends InferDriveDisks<typeof driveConfig> {}
}
