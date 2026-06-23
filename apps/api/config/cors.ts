import app from "@adonisjs/core/services/app";
import { defineConfig } from "@adonisjs/cors";

import env from "#start/env";

const corsConfig = defineConfig({
	enabled: true,
	origin: app.inDev ? true : env.get("CORS_AUTHORIZED_ORIGINS", "").split(","),
	methods: ["GET", "HEAD", "POST", "PUT", "DELETE"],
	headers: true,
	exposeHeaders: [],
	credentials: true,
	maxAge: 90,
});

export default corsConfig;
