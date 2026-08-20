import router from "@adonisjs/core/services/router";

import { controllers } from "#generated/controllers";
import { middleware } from "#start/kernel";

router
	.group(() => {
		router
			.post("/login", [controllers.features.admin.adminManagement.authentication.Login])
			.use(middleware.guest())
			.use(middleware.authAttempt({ identifier: "uid", scope: "login" }));
		router
			.delete("/logout", [controllers.features.admin.adminManagement.authentication.Logout])
			.use(middleware.auth({ guards: ["client"] }));
	})
	.prefix("admin/admin-management/authentication")
	.as("admin.admin_management.authentication");
