import router from "@adonisjs/core/services/router";

import { controllers } from "#generated/controllers";
import { middleware } from "#start/kernel";

router
	.group(() => {
		router
			.post("/login", [controllers.features.client.userManagement.authentication.Login])
			.use(middleware.guest())
			.use(middleware.authAttempt({ identifier: "uid", scope: "login" }));
		router
			.delete("/logout", [controllers.features.client.userManagement.authentication.Logout])
			.use(middleware.auth({ guards: ["client"] }));
	})
	.prefix("/client/user-management/authentication")
	.as("client.user_management.authentication");
