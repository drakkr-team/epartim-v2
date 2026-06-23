import { defineConfig } from "@adonisjs/core/http";
import app from "@adonisjs/core/services/app";

import env from "#start/env";

export const http = defineConfig({
	generateRequestId: true,
	allowMethodSpoofing: false,
	useAsyncLocalStorage: false,

	cookie: {
		domain: env.get("COOKIE_DOMAIN", ""),
		path: "/",
		maxAge: "2h",
		httpOnly: true,
		secure: app.inProduction,
		sameSite: "lax",
	},
});
