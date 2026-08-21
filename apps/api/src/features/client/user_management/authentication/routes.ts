import router from "@adonisjs/core/services/router";

import { controllers } from "#generated/controllers";
import { middleware } from "#start/kernel";
import { brutForceLimiter } from "#start/limiter";

router
	.group(() => {
		router
			.post("/login", [controllers.features.client.userManagement.authentication.Login])
			.use(middleware.guest())
			.use(brutForceLimiter);
		router
			.delete("/logout", [controllers.features.client.userManagement.authentication.Logout])
			.use(middleware.auth({ guards: ["client"] }));
	})
	.prefix("/client/user-management/authentication")
	.as("client.user_management.authentication");
