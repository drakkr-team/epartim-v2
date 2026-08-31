import router from "@adonisjs/core/services/router";

import { controllers } from "#generated/controllers";
import { middleware } from "#start/kernel";
import { brutForceLimiter } from "#start/limiter";

router
	.group(() => {
		router
			.post("/login", [controllers.features.client.accountManagement.authentication.Login])
			.use(middleware.guest())
			.use(brutForceLimiter);
		router
			.delete("/logout", [controllers.features.client.accountManagement.authentication.Logout])
			.use(middleware.auth({ guards: ["client"] }));
	})
	.prefix("/client/account-management/authentication")
	.as("client.account_management.authentication");
