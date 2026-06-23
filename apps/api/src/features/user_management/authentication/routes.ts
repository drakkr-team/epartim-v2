import router from "@adonisjs/core/services/router";

import { controllers } from "#generated/controllers";
import { middleware } from "#start/kernel";
import { brutForceLimiter } from "#start/limiter";

router
	.group(() => {
		router
			.post("/login", [controllers.features.userManagement.authentication.Login])
			.use(middleware.guest())
			.use(brutForceLimiter);
		router
			.delete("/logout", [controllers.features.userManagement.authentication.Logout])
			.use(middleware.auth({ guards: ["web"] }));
	})
	.prefix("/user-management/authentication")
	.as("user_management.authentication");
