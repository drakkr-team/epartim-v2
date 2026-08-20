import router from "@adonisjs/core/services/router";

import { controllers } from "#generated/controllers";
import { middleware } from "#start/kernel";
import { brutForceLimiter } from "#start/limiter";

router
	.group(() => {
		router
			.post("/login", [controllers.features.admin.adminManagement.authentication.Login])
			.use(middleware.guest({ guards: ["admin"] }))
			.use(brutForceLimiter);
		router
			.delete("/logout", [controllers.features.admin.adminManagement.authentication.Logout])
			.use(middleware.auth({ guards: ["admin"] }));
	})
	.prefix("admin/admin-management/authentication")
	.as("admin.admin_management.authentication");
