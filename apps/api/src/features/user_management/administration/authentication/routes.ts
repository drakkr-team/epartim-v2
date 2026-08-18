import router from "@adonisjs/core/services/router";

import { controllers } from "#generated/controllers";
import { middleware } from "#start/kernel";

router
	.group(() => {
		router
			.post("/login", [controllers.features.userManagement.administration.authentication.Login])
			.use(middleware.guest({ guards: ["admin"] }))
			.use(middleware.authAttempt({ identifier: "uid", scope: "admin-login" }));
		router
			.delete("/logout", [controllers.features.userManagement.administration.authentication.Logout])
			.use(middleware.auth({ guards: ["admin"] }));
		router
			.get("/me", [
				controllers.features.userManagement.administration.authentication.ViewCurrentUser,
			])
			.use(middleware.auth({ guards: ["admin"] }));
	})
	.prefix("/admin/authentication")
	.as("admin.authentication");
