import router from "@adonisjs/core/services/router";

import { controllers } from "#generated/controllers";
import { middleware } from "#start/kernel";
import { brutForceLimiter } from "#start/limiter";

router
	.group(() => {
		router
			.post("/login", [controllers.features.admin.accountManagement.authentication.Login])
			.use(middleware.guest({ guards: ["admin"] }))
			.use(brutForceLimiter);
		router
			.delete("/logout", [controllers.features.admin.accountManagement.authentication.Logout])
			.use(middleware.auth({ guards: ["admin"] }));
	})
	.prefix("admin/account-management/authentication")
	.as("admin.account_management.authentication");
